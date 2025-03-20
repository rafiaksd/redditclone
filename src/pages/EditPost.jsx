import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPost, updatePost } from '../utils/api';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await getPost(id);
      const post = response.data;
      
      // Check if user is the author
      if (post.author._id !== user.id) {
        setError('You can only edit your own posts');
        return;
      }

      setTitle(post.title);
      setContent(post.content);
    } catch (error) {
      setError('Error fetching post');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost(id, { title, content });
      navigate(`/post/${id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating post');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => navigate(`/post/${id}`)}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-700 transition"
        >
          Back to Post
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Edit Post</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="8"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Update Post
          </button>
          <button
            type="button"
            onClick={() => navigate(`/post/${id}`)}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost; 