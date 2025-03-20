import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPost, getComments, createComment, upvotePost, downvotePost, deletePost } from '../utils/api'; 
import Comment from '../components/Comment';

const SinglePost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await getPost(id);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getComments(id);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (type) => {
    if (!user) return;
    try {
      if (type === 'upvote') {
        await upvotePost(id);
      } else {
        await downvotePost(id);
      }
      fetchPost();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      await createComment({
        content: newComment,
        post: id
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleCommentVote = () => {
    fetchComments();
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  if (loading || !post) {
    return <div className="raleFont text-center py-8">Loading...</div>;
  }

  const voteCount = post.upvotes.length - post.downvotes.length;
  const isAuthor = user && post.author._id === user.id;
  const hasUpvoted = user && post.upvotes.includes(user.id);
  const hasDownvoted = user && post.downvotes.includes(user.id);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-start space-x-4">
          <div className="flex flex-col items-center">
            <button
              onClick={() => handleVote('upvote')}
              className={`hover:text-green-500 ${!hasUpvoted ? 'text-gray-500' : 'text-green-500'}`}
            >
              ▲
            </button>
            <span className="font-semibold">{voteCount}</span>
            <button
              onClick={() => handleVote('downvote')}
              className={`hover:text-red-500 ${hasDownvoted ? 'text-red-500' : 'text-gray-500'}`}
            >
              ▼
            </button>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900 raleFont">{post.title}</h1>
              {isAuthor && (
                <div>
                  <Link
                    to={`/post/${id}/edit`}
                    className="raleFont px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDeletePost} 
                    className="raleFont px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition font-medium ml-4"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <p className="text-gray-700 mb-4">{post.content}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span><span>By</span> <span className="roboFont text-xl font-bold">{post.author.username}</span></span>
              <span className="raleFont">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 raleFont">Comments</h2>
        
        {user ? (
          <form onSubmit={handleComment} className="mb-6 raleFont">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border rounded-lg mb-2"
              placeholder="Write a comment..."
              rows="3"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-700"
            >
              Comment
            </button>
          </form>
        ) : (
          <p className="text-gray-500 mb-6">Please log in to comment</p>
        )}

        <div className="space-y-4">
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              postId={id}
              onVote={handleCommentVote}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SinglePost;