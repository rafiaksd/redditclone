import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { upvotePost, downvotePost } from '../utils/api';

const PostCard = ({ post, onVote }) => {
  const { user } = useAuth();

  const handleVote = async (type) => {
    if (!user) return;
    
    try {
      if (type === 'upvote') {
        await upvotePost(post._id);
      } else {
        await downvotePost(post._id);
      }
      onVote(post._id);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const voteCount = post.upvotes.length - post.downvotes.length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
      <div className="flex items-start space-x-4">
        <div className="flex flex-col items-center">
          <button
            onClick={() => handleVote('upvote')}
            className={`text-gray-500 hover:text-blue-500 ${
              user && post.upvotes.includes(user.id) ? 'text-blue-500' : ''
            }`}
          >
            ▲
          </button>
          <span className="font-semibold">{voteCount}</span>
          <button
            onClick={() => handleVote('downvote')}
            className={`text-gray-500 hover:text-red-500 ${
              user && post.downvotes.includes(user.id) ? 'text-red-500' : ''
            }`}
          >
            ▼
          </button>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-indigo-500 mb-2">{post.title}</h2>
          <p className="text-gray-700 mb-4">{post.content}</p>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Posted by {post.author.username} •{' '}
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <Link
              to={`/post/${post._id}`}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-700 transition"
            >
              View Post
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard; 