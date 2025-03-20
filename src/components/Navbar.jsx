import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-700 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/" className="lg:text-8xl md:text-7xl text-5xl roboFont font-semibold text-white">
          RedditClone
        </Link>
      </div>
      <div className="space-x-[-20px]">
        {user ? (
          <>
            <div className="flex flex-col justify-end text-right px-4 py-2 ">
              <p className="text-3xl md:text-5xl font-semibold roboFont">{user.username}</p>
              <div>
                <Link to="/create" className="text-sm sm:text-lg text-white raleFont hover:bg-indigo-700 px-3 py-2 rounded transition">
                  New Post
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-white sm:text-lg raleFont hover:bg-indigo-700 px-3 py-2 rounded transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link to="/register" className="raleFont text-sm xs:text-xl sm:text-3xl text-white hover:bg-indigo-700 px-3 py-2 mr-3 xs:mr-6 transition">
              Sign Up
            </Link>
            <Link to="/login" className="raleFont text-sm xs:text-xl sm:text-3xl text-white hover:bg-indigo-700 px-3 py-2 transition">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 