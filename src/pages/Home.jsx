import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, upvotePost, downvotePost } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getPosts();
      // Check if response.data exists and is an array
      const postsData = response.data || [];
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (postId, voteType) => {
    if (!user) return;
    
    try {
      if (voteType === 'upvote') {
        await upvotePost(postId);
      } else {
        await downvotePost(postId);
      }
      // Refresh posts to get updated vote counts
      fetchPosts();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-gray-600">Loading posts...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Top Posts</h1>
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post._id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between">
                <h2 className="text-xl xs:text-2xl sm:text-4xl font-semibold raleFont text-indigo-500 mb-3">{post.title}</h2>
                <div>
                  <span>By </span> <span className="text-2xl sm:text-4xl roboFont mr-2">{post.author.username}</span><span className="italic"> {post.createdAt.slice(0,10)}</span>
                </div>
              </div>
              <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleVote(post._id, 'upvote')}
                    className={`text-gray-500 hover:text-indigo-500 transition ${
                      user && post.upvotes.includes(user.id) ? 'text-indigo-500' : ''
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <span className="font-medium text-gray-700">{post.upvotes.length - post.downvotes.length}</span>
                  <button
                    onClick={() => handleVote(post._id, 'downvote')}
                    className={`text-gray-500 hover:text-indigo-500 transition ${
                      user && post.downvotes.includes(user.id) ? 'text-indigo-500' : ''
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                <Link
                  to={`/post/${post._id}`}
                  className="px-4 py-2 raleFont bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  View Post
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home; 