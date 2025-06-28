import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaHistory, FaMicrophone, FaComment, FaFileAlt, FaTrash, FaChartLine, FaTrophy, FaLightbulb, FaSpeakerDeck, FaArrowRight, FaStar, FaCalendarAlt, FaClock, FaSignOutAlt } from "react-icons/fa";
import { MdFeedback } from "react-icons/md";
import { getCurrentUser, getUserFeedback, deleteFeedback } from "../utils/service";
import Cookies from 'js-cookie';
import FeedbackDisplay from "../components/FeedbackModal";
import { motion, AnimatePresence } from "framer-motion";

function FeedbackCard({ feedback, onViewFeedback, onDeleteFeedback }) {
  const { type, topic, trainerName, feedback: feedbackData, createdAt } = feedback;
  let parsedFeedback = { summary: '', quote: '', stats: {}, highlights: [], improvements: [], tips: [], next_steps: [] };

  try {
    parsedFeedback = JSON.parse(feedbackData);
  } catch (error) {
    console.error('Failed to parse feedback JSON:', error);
  }

  const getTypeIcon = () => {
    switch(type) {
      case 'debate': return <FaTrophy className="text-2xl text-purple-400" />;
      case 'interview': return <FaUser className="text-2xl text-blue-400" />;
      case 'speech': return <FaSpeakerDeck className="text-2xl text-teal-400" />;
      default: return <MdFeedback className="text-2xl text-yellow-400" />;
    }
  };

  const getTypeColor = () => {
    switch(type) {
      case 'debate': return 'purple';
      case 'interview': return 'blue';
      case 'speech': return 'teal';
      default: return 'yellow';
    }
  };

  const color = getTypeColor();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-${color}-500/20 transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-${color}-500/20 text-${color}-400`}>
          {getTypeIcon()}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white capitalize">{type} Practice</h3>
              <p className="text-gray-400">Topic: {topic}</p>
            </div>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <FaCalendarAlt /> {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <FaUser className={`text-${color}-400`} />
              <span>Coach: {trainerName}</span>
            </div>

            <p className="text-gray-300 line-clamp-2 mb-4">
              {parsedFeedback.summary || "No summary available"}
            </p>

          

        
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => onViewFeedback(feedback)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-${color}-600 hover:bg-${color}-700 text-white rounded-lg transition-all duration-300`}
            >
              <FaArrowRight /> View Details
            </button>
            <button
              onClick={() => onDeleteFeedback(feedback._id)}
              className="w-12 h-12 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTip, setCurrentTip] = useState(0);
  const navigate = useNavigate();

  const motivationalTips = [
    "Practice makes perfect. Keep going!",
    "Every expert was once a beginner. Keep learning!",
    "Success is the sum of small efforts repeated day in and day out.",
    "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
    "The only way to do great work is to love what you do.",
    "Don't watch the clock; do what it does. Keep going.",
    "You are never too old to set another goal or to dream a new dream.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "Your time is limited, so don’t waste it living someone else’s life.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Strive not to be a success, but rather to be of value.",
    "You don’t have to be perfect, you just have to be willing to keep going.",
    "The harder you work for something, the greater you’ll feel when you achieve it.",
    "Dream big and dare to fail.",
    "Don’t be afraid to give up the good to go for the great.",
    "Success usually comes to those who are too busy to be looking for it.",
    "The only limit to our realization of tomorrow is our doubts of today.",
    "What you get by achieving your goals is not as important as what you become by achieving your goals.",
    "The secret of getting ahead is getting started.",
    "Your attitude, not your aptitude, will determine your altitude.",
    "You are capable of amazing things."
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = Cookies.get('accessToken');
        if (!token) {
          throw new Error('Please log in to view the dashboard');
        }
        const [userData, feedbackData] = await Promise.all([
          getCurrentUser(),
          getUserFeedback(),
        ]);
        setUser(userData);
        setFeedbackList(feedbackData);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.message || 'Failed to load dashboard data');
        if (err.message.includes('authenticated') || err.message.includes('token')) {
          Cookies.remove('accessToken');
          navigate('/auth');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prevTip) => (prevTip + 1) % motivationalTips.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleViewFeedback = (feedback) => {
    setSelectedFeedback(feedback);
  };

  const handleCloseFeedback = () => {
    setSelectedFeedback(null);
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      await deleteFeedback(feedbackId);
      setFeedbackList(feedbackList.filter(feedback => feedback._id !== feedbackId));
    } catch (err) {
      console.error('Delete feedback error:', err);
      setError(err.message || 'Failed to delete feedback');
      if (err.message.includes('authenticated') || err.message.includes('token')) {
        Cookies.remove('accessToken');
        navigate('/auth');
      }
    }
  };

  const handleLogout = () => {
    Cookies.remove('accessToken');
    navigate('/auth');
  };

  const totalSessions = feedbackList.length;
  const sessionTypes = feedbackList.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {});

  const latestSession = feedbackList[0];

  const practiceOptions = [
    {
      name: 'Debate',
      description: 'Sharpen your argumentation and critical thinking skills',
      icon: <FaTrophy className="text-4xl text-purple-400" />,
      link: '/debate',
      color: 'purple'
    },
    {
      name: 'Interview',
      description: 'Prepare for job interviews with AI-powered mock sessions',
      icon: <FaUser className="text-4xl text-blue-400" />,
      link: '/interview',
      color: 'blue'
    },
    {
      name: 'Speech',
      description: 'Improve your public speaking and presentation abilities',
      icon: <FaSpeakerDeck className="text-4xl text-teal-400" />,
      link: '/speech',
      color: 'teal'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100 py-12 px-4">
      <div className="max-w-7xl mt-12 mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent text-center mb-2">
            Your Learning Dashboard
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto text-center">
            Track your progress and continue improving your communication skills
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border-l-4 border-red-500 text-red-400 p-4 rounded-lg text-center mb-8">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* User Profile Card */}
            <div className="lg:col-span-1 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full opacity-20 blur-md"></div>
                  <div className="w-24 h-24 rounded-full bg-gray-700 border-2 border-blue-500/30 flex items-center justify-center text-4xl font-bold relative">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-[#FFD700] mb-2">{user?.username}</h2>
                <p className="text-gray-400 text-sm">{user?.email}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                  <h3 className="font-medium mb-2 flex items-center gap-2 justify-center">
                    <FaChartLine className="text-blue-400" /> Activity Summary
                  </h3>
                  <p className="text-sm text-gray-400 text-center">
                    <span className="text-white">{totalSessions}</span> practice sessions completed
                  </p>
                </div>

                <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                  <h3 className="font-medium mb-2 flex items-center gap-2 justify-center">
                    <FaLightbulb className="text-yellow-400" /> Motivation Tip
                  </h3>
                  <p className="text-sm text-gray-300 text-center">
                    {motivationalTips[currentTip]}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full block text-center py-3 px-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold hover:from-red-700 hover:to-pink-700 transition-all duration-300"
                >
                  <FaSignOutAlt className="inline mr-2" /> Logout
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-blue-500/20">
                      <FaChartLine className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-blue-400">{totalSessions}</div>
                      <h3 className="text-lg font-medium">Total Sessions</h3>
                      <p className="text-sm text-gray-400">All practice activities</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-purple-500/20">
                      <FaTrophy className="text-purple-400" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-400">{sessionTypes.debate || 0}</div>
                      <h3 className="text-lg font-medium">Debates</h3>
                      <p className="text-sm text-gray-400">Argument practice</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-teal-500/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-teal-500/20">
                      <FaUser className="text-teal-400" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-teal-400">{sessionTypes.interview || 0}</div>
                      <h3 className="text-lg font-medium">Interviews</h3>
                      <p className="text-sm text-gray-400">Job preparation</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Latest Session */}
              {latestSession && (
                <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 mb-8">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                    <FaLightbulb className="text-yellow-400" /> Latest Practice Session
                  </h2>
                  <FeedbackCard
                    feedback={latestSession}
                    onViewFeedback={handleViewFeedback}
                    onDeleteFeedback={handleDeleteFeedback}
                  />
                </div>
              )}

              {/* Practice History */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <FaHistory className="text-purple-400" /> Practice History
                  </h2>
                  {feedbackList.length > 0 && (
                    <div className="text-sm text-gray-400">
                      Showing {feedbackList.length} session{feedbackList.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                {feedbackList.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">No practice sessions yet</div>
                    <Link
                      to="/debate"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-full font-medium hover:from-blue-700 hover:to-teal-700 transition-all"
                    >
                      Start Practicing <FaArrowRight />
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    <AnimatePresence>
                      {feedbackList.map(feedback => (
                        <FeedbackCard
                          key={feedback._id}
                          feedback={feedback}
                          onViewFeedback={handleViewFeedback}
                          onDeleteFeedback={handleDeleteFeedback}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <FaMicrophone className="text-teal-400" /> Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {practiceOptions.map((option, index) => (
                    <Link
                      key={index}
                      to={option.link}
                      className={`group flex flex-col items-center p-6 bg-gray-700/50 hover:bg-${option.color}-500/10 border border-gray-700 hover:border-${option.color}-500/30 rounded-xl transition-all duration-300`}
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-${option.color}-500/20 group-hover:bg-${option.color}-500/30 transition-colors`}>
                        {option.icon}
                      </div>
                      <h3 className={`font-bold mb-2 text-${option.color}-400 group-hover:text-${option.color}-300 transition-colors`}>{option.name}</h3>
                      <p className="text-sm text-gray-400 text-center">{option.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        <AnimatePresence>
          {selectedFeedback && (
            <FeedbackDisplay
              isOpen={!!selectedFeedback}
              onClose={handleCloseFeedback}
              feedback={selectedFeedback.feedback}
              type={selectedFeedback.type}
              topic={selectedFeedback.topic}
              trainerName={selectedFeedback.trainerName}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default StudentDashboard;
