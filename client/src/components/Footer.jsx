import { Link } from "react-router-dom";
import { FaTwitter, FaLinkedin, FaGithub, FaMicrophone, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8 animate-fade-in">
          {/* Logo and Description */}
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-4 group">
              <div className="bg-primary-600 group-hover:bg-accent-500 p-2 rounded-lg transition-colors">
                <FaMicrophone className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-bold font-heading">
                <span className="text-primary-400">Speak</span>Up
              </h3>
            </Link>
            <p className="text-light-300 text-base sm:text-lg max-w-xs">
              Master your communication skills with AI-powered debate, speech, and interview practice.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.linkedin.com/in/hateem-ansari-3377b72a3/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light-400 hover:text-[#FFD700] transition-all duration-300 transform hover:scale-110"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a
                href="https://www.linkedin.com/in/hateem-ansari-3377b72a3/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light-400 hover:text-[#FFD700] transition-all duration-300 transform hover:scale-110"
              >
                <FaLinkedin className="text-xl" />
              </a>
              <a
                href="https://www.instagram.com/hateem_ansari_/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light-400 hover:text-[#FFD700] transition-all duration-300 transform hover:scale-110"
              >
                <FaInstagram className="text-xl" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-purple-400 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Features
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/debate"
                  className="text-light-300 hover:text-[#FFD700] transition-all duration-300 text-base sm:text-lg transform hover:scale-105"
                >
                  Debate Practice
                </Link>
              </li>
              <li>
                <Link
                  to="/speech"
                  className="text-light-300 hover:text-[#FFD700] transition-all duration-300 text-base sm:text-lg transform hover:scale-105"
                >
                  Speech Training
                </Link>
              </li>
              <li>
                <Link
                  to="/interview"
                  className="text-light-300 hover:text-[#FFD700] transition-all duration-300 text-base sm:text-lg transform hover:scale-105"
                >
                  Mock Interviews
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-light-300 hover:text-[#FFD700] transition-all duration-300 text-base sm:text-lg transform hover:scale-105"
                >
                  AI Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-purple-400 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="https://www.linkedin.com/in/hateem-ansari-3377b72a3/"
                  className="text-light-300 hover:text-[#FFD700] transition-all duration-300 text-base sm:text-lg transform hover:scale-105"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="https://www.linkedin.com/in/hateem-ansari-3377b72a3/"
                  className="text-light-300 hover:text-[#FFD700] transition-all duration-300 text-base sm:text-lg transform hover:scale-105"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="https://www.linkedin.com/in/hateem-ansari-3377b72a3/"
                  className="text-light-300 hover:text-[#FFD700] transition-all duration-300 text-base sm:text-lg transform hover:scale-105"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="https://www.linkedin.com/in/hateem-ansari-3377b72a3/"
                  className="text-light-300 hover:text-[#FFD700] transition-all duration-300 text-base sm:text-lg transform hover:scale-105"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-dark-700 flex flex-col md:flex-row justify-between items-center text-light-400 text-sm">
          <p className="mb-4 md:mb-0">
            © {new Date().getFullYear()} SpeakUp. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              to="/privacy"
              className="hover:text-[#FFD700] transition-all duration-300 transform hover:scale-105"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-[#FFD700] transition-all duration-300 transform hover:scale-105"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="hover:text-[#FFD700] transition-all duration-300 transform hover:scale-105"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;