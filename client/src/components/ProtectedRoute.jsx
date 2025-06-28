import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getCurrentUser } from '../utils/service';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSignInAlt, FaUserPlus, FaLock } from 'react-icons/fa';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('accessToken');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const interval = setInterval(() => {
        setLoadingProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      try {
        await getCurrentUser();
        setLoadingProgress(100);
        setTimeout(() => setIsAuthenticated(true), 500);
      } catch (err) {
        console.error('Auth check failed:', err);
        Cookies.remove('accessToken');
        setLoadingProgress(100);
        setTimeout(() => setIsAuthenticated(false), 500);
      } finally {
        clearInterval(interval);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full text-center"
        >
          <div className="relative w-32 h-32 mx-auto mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full"
            />
            <div className="absolute inset-4 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white text-4xl">
              <FaLock />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-4">
            Securing Your Session
          </h2>
          
          <div className="w-full bg-gray-800/50 rounded-full h-2.5 mb-6 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"
            />
          </div>
          
          <p className="text-gray-400">
            {loadingProgress < 50 
              ? "Checking credentials..." 
              : loadingProgress < 90 
              ? "Verifying session..." 
              : "Finalizing..."}
          </p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10"
              style={{
                width: Math.random() * 300 + 100,
                height: Math.random() * 300 + 100,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 100],
                y: [0, (Math.random() - 0.5) * 100],
                rotate: [0, Math.random() * 360],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-xl max-w-md w-full relative z-10"
        >
          <div className="flex justify-center mb-8">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white text-3xl shadow-lg"
            >
              <FaLock />
            </motion.div>
          </div>

          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-4">
            Access Required
          </h2>
          
          <p className="text-gray-400 text-center mb-8">
            Sign in to access your personalized practice sessions for debate, interview, and speech training.
          </p>

          <div className="grid gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/auth')}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-medium flex items-center justify-center gap-3 hover:from-blue-700 hover:to-teal-600 transition-all"
            >
              <FaSignInAlt /> Sign In
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/auth?mode=signup')}
              className="w-full py-3 px-4 bg-gray-700/50 hover:bg-gray-700 text-white rounded-xl font-medium flex items-center justify-center gap-3 border border-gray-600 transition-all"
            >
              <FaUserPlus /> Create Account
            </motion.button>
          </div>

          <div className="mt-6 text-center">
            <button 
              onClick={() => navigate('/')}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default ProtectedRoute;