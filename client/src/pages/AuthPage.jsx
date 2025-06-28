import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt, FaUserPlus, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { registerUser, loginUser } from "../utils/service";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const response = await loginUser({
          username: formData.username,
          password: formData.password,
        });
        navigate("/dashboard");
      } else {
        const response = await registerUser(formData);
        navigate("/");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err.message || "An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
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

      <div className="container mx-auto max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-xl"
        >
          <div className="flex flex-col items-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white text-2xl mb-4 shadow-lg"
            >
              <FaUser />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              SkillUp
            </h1>
            <p className="text-gray-400 mt-2">
              {isLogin ? "Sign in to continue" : "Create your account"}
            </p>
          </div>

          <div className="flex mb-6 bg-gray-700/50 rounded-xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg transition-all ${
                isLogin
                  ? "bg-blue-600/90 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg transition-all ${
                !isLogin
                  ? "bg-blue-600/90 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-500/10 border-l-4 border-red-500 text-red-400 p-3 rounded-lg"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <FaUser />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </motion.div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <FaLock />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                isLoading
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:from-blue-700 hover:to-teal-600 shadow-lg hover:shadow-blue-500/20"
              }`}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : isLogin ? (
                <>
                  <FaSignInAlt /> Sign In
                </>
              ) : (
                <>
                  <FaUserPlus /> Sign Up
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
            >
              {isLogin ? (
                <>Don't have an account? <span className="font-medium">Sign Up</span></>
              ) : (
                <>Already have an account? <span className="font-medium">Sign In</span></>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AuthPage;