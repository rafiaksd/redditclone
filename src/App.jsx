import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useState, useEffect } from 'react';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import SinglePost from './pages/SinglePost';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Login from './pages/Login';
import Register from './pages/Register';
import { getPosts } from './utils/api';

// Separate component to handle post viewing
const PostTracker = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    if (!user) {
      setRecentPosts([]);
      return;
    }

    // Get recent posts from localStorage with user-specific key
    const storageKey = `recentPosts_${user.id}`;
    const storedPosts = JSON.parse(localStorage.getItem(storageKey) || '[]');
    setRecentPosts(storedPosts);

    // Check if we're on a post page (e.g., /post/:id)
    const postMatch = location.pathname.match(/^\/post\/([^/]+)$/);
    if (postMatch) {
      const postId = postMatch[1];
      
      // If the post isn't already in the recent posts, add it
      updateRecentPosts(postId, storedPosts, storageKey);
    }
  }, [location, user]); // Re-run this effect whenever location or user changes

  const updateRecentPosts = (postId, currentPosts, storageKey) => {
    // Check if post is already in the recent posts list
    const postIndex = currentPosts.findIndex(post => post._id === postId);
    
    if (postIndex !== -1) {
      // Post is already in the list, move it to the front
      const updatedPosts = [
        currentPosts[postIndex], 
        ...currentPosts.slice(0, postIndex), 
        ...currentPosts.slice(postIndex + 1)
      ];
      
      localStorage.setItem(storageKey, JSON.stringify(updatedPosts.slice(0, 8)));
      setRecentPosts(updatedPosts.slice(0, 8));
    } else {
      // Post is not in the list, fetch it and add to the front
      fetchPostDetails(postId, currentPosts, storageKey);
    }
  };

  const fetchPostDetails = async (postId, currentPosts, storageKey) => {
    try {
      // Fetch all posts (or you can optimize this to only fetch a specific post)
      const response = await getPosts();
      const posts = response.data || [];
      const post = posts.find(p => p._id === postId);

      // If post is found, update recent posts and store in localStorage
      if (post) {
        const updatedPosts = [post, ...currentPosts.filter(p => p._id !== postId)].slice(0, 8);
        localStorage.setItem(storageKey, JSON.stringify(updatedPosts));
        setRecentPosts(updatedPosts);
      }
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full lg:w-64 bg-blue-500 text-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-bold mb-4">Navigation</h2>
            <ul className="space-y-2">
              <Link
                      to={`/`}
                      className="raleFont flex items-center p-2 hover:bg-blue-600 rounded cursor-pointer"
                    >
                      🏠 Home
              </Link>
              <li className="raleFont flex items-center p-2 hover:bg-blue-600 rounded cursor-pointer">
                <span className="mr-2">⏳</span> History (soon...)
              </li>
              <li className="raleFont flex items-center p-2 hover:bg-blue-600 rounded cursor-pointer">
                <span className="mr-2">⭐</span> Subscriptions (soon...)
              </li>
              <li className="raleFont flex items-center p-2 hover:bg-blue-600 rounded cursor-pointer">
                <span className="mr-2">📂</span> Interests (soon...)
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>

          {/* Right Sidebar */}
          <div className="w-full lg:w-64 bg-white rounded-lg shadow-lg p-4">
            <h2 className="raleFont text-xl font-bold mb-4 text-gray-900">Recently Viewed</h2>
            <ul className="space-y-2">
              {user ? (
                recentPosts.map(post => (
                  <li key={post._id}>
                    <Link
                      to={`/post/${post._id}`}
                      className="raleFont block p-2 bg-indigo-50 rounded hover:bg-indigo-100 transition cursor-pointer"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm italic">Please log in to see recently viewed posts</li>
              )}
              {user && recentPosts.length === 0 && (
                <li className="text-gray-500 text-sm italic">No recently viewed posts</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router basename="/redditclone">
      <AuthProvider>
        <PostTracker>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<SinglePost />} />
            <Route path="/post/:id/edit" element={<EditPost />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </PostTracker>
      </AuthProvider>
    </Router>
  );
}

export default App;
