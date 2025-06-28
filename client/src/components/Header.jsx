import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaMicrophone, FaChartBar, FaComments, FaMicrophoneAlt, FaBriefcase, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "../utils/service";
import Cookies from 'js-cookie';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fetchUser = async () => {
    const token = Cookies.get('accessToken');
    setIsLoading(true);
    if (token) {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('Header - Failed to fetch user:', err.message);
        Cookies.remove('accessToken');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener('authChange', fetchUser);
    fetchUser();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('authChange', fetchUser);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setIsMenuOpen(false);
      navigate('/auth');
    } catch (err) {
      console.error('Header - Logout error:', err.message);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { path: "/dashboard", name: "Dashboard", icon: FaChartBar },
    { path: "/debate", name: "Debate", icon: FaComments },
    { path: "/speech", name: "Speech", icon: FaMicrophoneAlt },
    { path: "/interview", name: "Interview", icon: FaBriefcase },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-dark-800/95 backdrop-blur-md border-b border-dark-700 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-primary-600 group-hover:bg-accent-500 p-2 rounded-lg transition-colors">
            <FaMicrophone className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">
            <span className="text-primary-400">Speak</span>Up
          </h1>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-8">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`relative px-3 py-2 font-medium transition-all duration-300 flex items-center gap-2 ${
                    location.pathname === link.path
                      ? "text-[#FFD700] bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                      : "text-light-300 hover:text-white hover:bg-gray-700/50 rounded-md"
                  }`}
                >
                  <link.icon
                    className={`text-lg ${
                      location.pathname === link.path && link.name === "Dashboard"
                        ? "text-[#FFD700] animate-pulse"
                        : location.pathname === link.path
                        ? "text-[#FFD700]"
                        : "text-gray-400 group-hover:text-white"
                    }`}
                  />
                  {link.name}
                  {location.pathname === link.path && (
                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {isLoading ? (
            <div className="text-light-300 text-sm animate-pulse">Loading...</div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <span className="text-light-300 font-medium text-sm">{user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow hover:shadow-purple-500/30"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/auth"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow hover:shadow-purple-500/30"
              >
                Login
              </Link>
              <Link
                to="/auth"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow hover:shadow-purple-500/30"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <button className="md:hidden text-white" onClick={toggleMenu}>
          {isMenuOpen ? (
            <FaTimes className="h-6 w-6" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-dark-800/95 backdrop-blur-md border-t border-dark-700 px-4 py-6 animate-fade-in">
          <nav className="flex flex-col space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#FFD700] scrollbar-track-[#1C2526]">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-lg font-medium transition-all duration-300 rounded-lg ${
                  location.pathname === link.path
                    ? "text-[#FFD700] bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent bg-gray-700/50"
                    : "text-light-300 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <link.icon
                  className={`text-lg ${
                    location.pathname === link.path && link.name === "Dashboard"
                      ? "text-[#FFD700] animate-pulse"
                      : location.pathname === link.path
                      ? "text-[#FFD700]"
                      : "text-gray-400"
                  }`}
                />
                {link.name}
              </Link>
            ))}
            {isLoading ? (
              <div className="text-light-300 text-center py-3 animate-pulse">Loading...</div>
            ) : user ? (
              <div className="flex flex-col space-y-4 pt-4 border-t border-gray-600">
                <span className="px-4 py-3 text-light-300 font-medium text-lg">{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow hover:shadow-purple-500/30 text-center"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-4 pt-4 border-t border-gray-600">
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow hover:shadow-purple-500/30 text-center"
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow hover:shadow-purple-500/30 text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;