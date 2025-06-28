import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaMicrophone, FaBrain, FaChartLine, FaArrowRight, FaUserTie, FaStar, FaTrophy, FaGraduationCap } from "react-icons/fa";
import { motion, useInView, useAnimation } from "framer-motion";
import AITrainerAvatar from "../components/AITrainerAvatar";
import { aiTrainers } from "../config/aiTrainers";

const LandingPage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();
  const [showSpeakingAnimation, setShowSpeakingAnimation] = useState(true);

  useEffect(() => {
    if (!isInView) {
      controls.start("visible");
    }
  }, [isInView]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpeakingAnimation(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const featuredTrainers = aiTrainers.slice(0, 3);

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen overflow-x-hidden">
      {showSpeakingAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900/80 to-blue-900/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="relative w-40 h-40 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-20 animate-pulse"></div>
              <div className="absolute inset-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-xl">
                <FaMicrophone className="text-5xl text-white animate-bounce" />
              </div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
              Speak with Confidence
            </h2>
            <p className="mt-4 text-gray-300 max-w-md mx-auto">
              Your journey to mastering professional communication starts here
            </p>
          </div>
        </div>
      )}

      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center opacity-10"></div>
        <div className="container mx-auto px-4 py-32 relative z-10">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 space-y-8">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-gray-800 rounded-full border border-gray-700 shadow-lg">
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium">AI-Powered Communication Training</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                    Master The Art
                  </span><br />
                  <span>Of Professional Speaking</span>
                </h1>
                
                <p className="text-xl text-gray-300 max-w-2xl">
                  Develop elite communication skills with personalized AI coaching. Get real-time feedback on your delivery, content, and strategy for debates, interviews, and public speeches.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/30 flex items-center gap-2 hover:-translate-y-1"
                  >
                    Get Started <FaArrowRight />
                  </Link>
                  <Link
                    to="/login"
                    className="bg-gray-800 hover:bg-gray-700 border-2 border-gray-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center gap-2 hover:-translate-y-1"
                  >
                    Sign In
                  </Link>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <img 
                        key={i}
                        src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${30+i}.jpg`}
                        alt="User"
                        className="w-10 h-10 rounded-full border-2 border-gray-800"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <FaStar key={i} className="text-yellow-400 text-sm" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-400">Trusted by 5,000+ professionals</p>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="relative"
                >
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl opacity-20 blur-xl"></div>
                  <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="aspect-video bg-gray-700 flex items-center justify-center">
                      <img
                        
                        className="w-full h-full object-cover"
                        src={aiTrainers[2].profileImage}
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                      <div className="flex items-center gap-4">
                        <AITrainerAvatar trainer={aiTrainers[2]} size="large" />
                        <div>
                          <h3 className="text-xl font-bold">{aiTrainers[2].name}</h3>
                          <p className="text-blue-400">{aiTrainers[2].role}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-gray-300">
                        "Let's work on structuring compelling arguments for your next debate session."
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "95%", label: "User Satisfaction" },
              { value: "10K+", label: "Sessions Completed" },
              { value: "4.9/5", label: "Average Rating" },
              { value: "2.5×", label: "Improvement Rate" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="text-center"
              >
                <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }}
            transition={{ delay: 0.4 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transform your communication skills in just three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "1. Choose Your Trainer",
                description: "Select from our expert AI coaches specialized in different communication styles and domains.",
                icon: <FaUserTie className="text-4xl text-purple-400" />,
                features: [
                  "Debate specialists",
                  "Interview coaches",
                  "Public speaking experts"
                ]
              },
              {
                title: "2. Practice Speaking",
                description: "Engage in realistic, interactive sessions with immediate AI feedback on your performance.",
                icon: <FaMicrophone className="text-4xl text-blue-400" />,
                features: [
                  "Real-time analysis",
                  "Personalized scenarios",
                  "Adaptive difficulty"
                ]
              },
              {
                title: "3. Track & Improve",
                description: "Monitor your progress with detailed analytics and receive customized improvement plans.",
                icon: <FaChartLine className="text-4xl text-teal-400" />,
                features: [
                  "Performance metrics",
                  "Skill progression",
                  "Weekly reports"
                ]
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate={controls}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-${index === 0 ? 'purple' : index === 1 ? 'blue' : 'teal'}-500/30 transition-all duration-300 hover:-translate-y-2 shadow-lg`}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-${index === 0 ? 'purple' : index === 1 ? 'blue' : 'teal'}-900/30 to-${index === 0 ? 'purple' : index === 1 ? 'blue' : 'teal'}-600/30 border border-${index === 0 ? 'purple' : index === 1 ? 'blue' : 'teal'}-500/30 flex items-center justify-center mb-6`}>
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-300 mb-4">{step.description}</p>
                <ul className="space-y-2">
                  {step.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-400">
                      <span className={`w-2 h-2 rounded-full bg-${index === 0 ? 'purple' : index === 1 ? 'blue' : 'teal'}-500`}></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900" ref={ref}>
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }}
            transition={{ delay: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold mb-6">
              Meet Your <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">AI Coaches</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our specialized AI trainers are experts in different communication domains, ready to help you excel.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-12">
            {featuredTrainers.map((trainer, index) => (
              <motion.div
                key={trainer.id}
                initial="hidden"
                animate={controls}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ delay: 0.4 + index * 0.15 }}
                className="group relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-500/30 transition-all duration-500 shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 p-8 bg-gradient-to-b from-gray-800/50 to-gray-900/50">
                    <div className="flex flex-col items-center text-center">
                      <AITrainerAvatar trainer={trainer} size="large" />
                      <h3 className="text-2xl font-bold mt-6">{trainer.name}</h3>
                      <p className="text-blue-400">{trainer.role}</p>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {trainer.specialties.map((specialty, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                            {specialty}
                          </span>
                        ))}
                      </div>
                      <div className="mt-6 w-full border-t border-gray-700 pt-6">
                        <div className="flex items-center justify-center gap-3 text-gray-400">
                          <FaGraduationCap />
                          <span>{trainer.education || trainer.certification || trainer.notableEvents}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3 p-8">
                    <div className="space-y-6">
                      <h3 className="text-3xl font-bold">About {trainer.name.split(" ")[0]}</h3>
                      <p className="text-gray-300">{trainer.bio}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-gray-700/50 p-5 rounded-xl">
                          <h4 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
                            <FaTrophy /> Experience
                          </h4>
                          <p className="text-gray-200">{trainer.experience}</p>
                        </div>
                        <div className="bg-gray-700/50 p-5 rounded-xl">
                          <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                            <FaStar /> Teaching Style
                          </h4>
                          <p className="text-gray-200">{trainer.voiceProfile.description}</p>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Link
                          to={`/signup?type=${trainer.id === 1 ? 'debate' : trainer.id === 2 ? 'interview' : 'speech'}`}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all hover:-translate-y-1 shadow-lg"
                        >
                          Practice with {trainer.name.split(" ")[0]}
                          <FaArrowRight />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }}
            transition={{ delay: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Success Stories
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Professionals who transformed their communication skills with our platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Corporate Lawyer",
                quote: "The debate practice helped me structure arguments more effectively for court. I won 3 cases in a row after just 2 weeks of training!",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Tech Entrepreneur",
                quote: "My investor pitches improved dramatically. We secured $2M in funding after I refined my delivery with the AI coach.",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                rating: 5
              },
              {
                name: "Priya Patel",
                role: "University Professor",
                quote: "My students are more engaged now that I've improved my lecture delivery. The feedback analytics were incredibly insightful.",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg",
                rating: 4
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate={controls}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ delay: 0.6 + index * 0.15 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-2 shadow-lg"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-purple-500/30"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{testimonial.name}</h3>
                    <p className="text-blue-400">{testimonial.role}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={`text-sm ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1 }
            }}
            transition={{ delay: 1 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">Transform</span> Your Communication?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join thousands of professionals who've elevated their speaking skills with our AI-powered platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/auth"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
              >
                Start Free Trial <FaArrowRight />
              </Link>
              <Link
                to="/auth"
                className="bg-gray-800 text-white px-10 py-4 rounded-full text-lg font-bold border border-gray-700 hover:bg-gray-700/50 transition-all duration-300 flex items-center gap-2"
              >
                Existing User? Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;