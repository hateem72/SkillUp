import { useState, useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { getSpeechScript, getSpeechFeedback } from "../utils/aiHandler";
import { convertTextToSpeech } from "../utils/speech";
import { submitFeedback } from "../utils/service";
import { 
  FaMicrophone, 
  FaStop, 
  FaPlay, 
  FaPause , 
  FaVolumeUp,
  FaChartBar, 
  FaFastForward, 
  FaFastBackward, 
  FaUserTie, 
  FaChevronDown,
  FaVolumeMute,
  FaFont,
  FaTachometerAlt
} from "react-icons/fa";
import FeedbackModal from "../components/FeedbackModal";
import { aiTrainers } from "../config/aiTrainers";

const Speech = () => {
  const [selectedTrainer, setSelectedTrainer] = useState(aiTrainers[2]);
  const [topic, setTopic] = useState("");
  const [script, setScript] = useState("");
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const [fontSize, setFontSize] = useState(24);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const [feedback, setFeedback] = useState(null);
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);
  const [speechStarted, setSpeechStarted] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isAIPaused, setIsAIPaused] = useState(false);
  const [error, setError] = useState(null);
  const [isTrainerOpen, setIsTrainerOpen] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);
  const prompterRef = useRef(null);
  const scriptRef = useRef(null);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    let scrollInterval;
    if (isScrolling && prompterRef.current) {
      scrollInterval = setInterval(() => {
        if (prompterRef.current) {
          prompterRef.current.scrollTop += scrollSpeed;
          if (prompterRef.current.scrollTop >= prompterRef.current.scrollHeight - prompterRef.current.clientHeight) {
            setIsScrolling(false);
          }
        }
      }, 100);
    }
    return () => clearInterval(scrollInterval);
  }, [isScrolling, scrollSpeed]);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setIsBrowserSupported(false);
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    setIsUserSpeaking(listening);
  }, [listening]);

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const stopAISpeech = async () => {
    try {
      await stopSpeech(); 
      setIsAISpeaking(false);
      setIsAIPaused(false);
    } catch (error) {
      console.error("Error stopping speech:", error);
      setError(error);
    }
  };

  const generateScript = async () => {
    if (!topic.trim()) {
      alert("Please enter a speech topic");
      return;
    }
    if (!isBrowserSupported) {
      alert("Browser doesn't support speech recognition");
      return;
    }

    setIsProcessing(true);
    setSpeechStarted(true);

    try {
      const generatedScript = await getSpeechScript(topic);
      setScript(generatedScript);
      setError(null);
    } catch (error) {
      console.error("Script generation error:", error);
      setError(error);
      setScript("Failed to generate script. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Listen to script
  const listenToScript = async () => {
    if (!script || isProcessing) return;

    setIsProcessing(true);
    setIsAISpeaking(true);
    setIsAIPaused(false);

    try {
      await convertTextToSpeech(script, selectedTrainer.name);
      setError(null);
    } catch (error) {
      console.error("Text-to-speech error:", error);
      setError(error);
    } finally {
      setIsAISpeaking(false);
      setIsAIPaused(false);
      setIsProcessing(false);
    }
  };

  const pauseAISpeech = async () => {
    try {
      await pauseSpeech(); // Call your TTS pause function
      setIsAIPaused(true);
    } catch (error) {
      console.error("Error pausing speech:", error);
      setError(error);
    }
  };

  const resumeAISpeech = async () => {
    try {
      await resumeSpeech(); // Call your TTS resume function
      setIsAIPaused(false);
    } catch (error) {
      console.error("Error resuming speech:", error);
      setError(error);
    }
  };

  const recordSpeech = async () => {
    if (isProcessing) return;

    if (!listening) {
      return startListening();
    }

    setIsProcessing(true);
    stopListening();
    await new Promise(resolve => setTimeout(resolve, 800));

    if (transcript.trim()) {
      try {
        const feedbackData = await getSpeechFeedback(topic, transcript);
        await submitFeedback({
          type: 'speech',
          topic: topic || 'General Speech Practice',
          trainerName: selectedTrainer.name,
          feedback: feedbackData,
        });
        setFeedback(feedbackData);
        setShowFeedback(true);
        setError(null);
      } catch (error) {
        console.error("Feedback error:", error);
        setFeedback("Failed to generate feedback. Please try again.");
        setError(error);
        setShowFeedback(true);
      }
    }

    setIsProcessing(false);
    resetTranscript();
  };

  const endSpeech = async () => {
    setIsEndingSession(true);
    if (isAISpeaking) stopAISpeech();
    if (listening) stopListening();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setSpeechStarted(false);
    setScript("");
    setIsScrolling(false);
    resetTranscript();
    setIsEndingSession(false);
  };

  const adjustSpeed = (delta) => {
    setScrollSpeed(prev => Math.max(1, Math.min(prev + delta, 10)));
  };

  const adjustFontSize = (delta) => {
    setFontSize(prev => Math.max(12, Math.min(prev + delta, 48)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 mt-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Speech Practice Arena
          </h1>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto">
            Practice your English stage speaking with a dynamic teleprompter and AI feedback.
          </p>
        </div>

        {!isBrowserSupported && (
          <div className="bg-red-600/20 border-l-4 border-red-600 text-red-300 p-4 mb-8 rounded-lg text-center">
            <p>Your browser doesn't support speech recognition. Please use Chrome or Edge for the best experience.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-600/20 border-l-4 border-red-600 text-red-300 p-4 mb-8 rounded-lg text-center">
            <p>{error.message || "An error occurred. Please try again."}</p>
          </div>
        )}

        {/* Controller Section */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col w-full md:w-1/3">
              <label className="block text-gray-300 mb-2 text-lg font-medium">AI Trainer</label>
              <div className="relative">
                <div
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-650 transition"
                  onClick={() => setIsTrainerOpen(!isTrainerOpen)}
                >
                  <div className="flex items-center gap-3">
                    <FaUserTie className="text-purple-400" />
                    <div>
                      <p className="font-medium text-white">{selectedTrainer.name}</p>
                      <p className="text-xs text-gray-400">{selectedTrainer.role}</p>
                    </div>
                  </div>
                  <FaChevronDown className={`text-gray-400 transition-transform ${isTrainerOpen ? 'transform rotate-180' : ''}`} />
                </div>
                {isTrainerOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg overflow-hidden">
                    {aiTrainers.map(trainer => (
                      <div
                        key={trainer.id}
                        className={`px-4 py-3 hover:bg-gray-600 cursor-pointer flex items-center gap-3 ${
                          selectedTrainer.id === trainer.id ? 'bg-gray-600' : ''
                        }`}
                        onClick={() => {
                          setSelectedTrainer(trainer);
                          setIsTrainerOpen(false);
                        }}
                      >
                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                        <div>
                          <p className="font-medium text-white">{trainer.name}</p>
                          <p className="text-xs text-gray-400">{trainer.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col w-full md:w-1/3">
              <label className="block text-gray-300 mb-2 text-lg font-medium">Speech Topic</label>
              <input
                type="text"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="E.g., The Importance of Education"
                disabled={speechStarted}
              />
            </div>

            <div className="flex flex-col w-full md:w-1/3">
              {!speechStarted ? (
                <button
                  onClick={generateScript}
                  disabled={isProcessing || !topic.trim()}
                  className={`w-full py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                    isProcessing || !topic.trim()
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/20'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Script...
                    </>
                  ) : (
                    <>
                      <FaPlay className="text-sm" /> Generate Script
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={endSpeech}
                  disabled={isProcessing}
                  className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-bold hover:from-red-700 hover:to-orange-700 shadow-lg hover:shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {isEndingSession ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Ending Session...
                    </>
                  ) : (
                    <>
                      <FaChartBar className="text-sm" /> End Session
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Teleprompter Section */}
          <div className="lg:w-1/2 bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-2xl">
             <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-purple-400">Teleprompter</h2>
          <div className="flex gap-2">
            {isAISpeaking && !isAIPaused && (
              <button
                onClick={pauseAISpeech}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <FaPause /> Pause AI
              </button>
            )}
            {isAISpeaking && isAIPaused && (
              <button
                onClick={resumeAISpeech}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <FaPlay /> Resume AI
              </button>
            )}
            {isAISpeaking && (
              <button
                onClick={stopAISpeech}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <FaVolumeMute /> Stop AI
              </button>
            )}
          </div>
        </div>
            
            {speechStarted && (
              <div className="relative">
                <div
                  ref={prompterRef}
                  className="bg-gray-700 rounded-xl p-8 h-[500px] overflow-y-auto border border-gray-600"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  <p
                    ref={scriptRef}
                    className="text-white"
                    style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
                  >
                    {script || "Your script will appear here..."}
                  </p>
                </div>
                
                {/* Compact Teleprompter Controls */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="bg-gray-700 rounded-lg p-3 flex flex-col items-center">
                    <span className="text-gray-300 text-sm mb-1 flex items-center gap-1">
                      <FaTachometerAlt /> Speed
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => adjustSpeed(-1)}
                        disabled={scrollSpeed <= 1}
                        className="p-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg disabled:opacity-50"
                      >
                        <FaFastBackward size={14} />
                      </button>
                      <span className="text-white font-medium w-8 text-center">{scrollSpeed}</span>
                      <button
                        onClick={() => adjustSpeed(1)}
                        disabled={scrollSpeed >= 10}
                        className="p-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg disabled:opacity-50"
                      >
                        <FaFastForward size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-3 flex flex-col items-center">
                    <span className="text-gray-300 text-sm mb-1 flex items-center gap-1">
                      <FaFont /> Font
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => adjustFontSize(-2)}
                        disabled={fontSize <= 12}
                        className="p-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg disabled:opacity-50"
                      >
                        <FaFastBackward size={14} />
                      </button>
                      <span className="text-white font-medium w-8 text-center">{fontSize}</span>
                      <button
                        onClick={() => adjustFontSize(2)}
                        disabled={fontSize >= 48}
                        className="p-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg disabled:opacity-50"
                      >
                        <FaFastForward size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsScrolling(!isScrolling)}
                    className={`p-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                      isScrolling 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isScrolling ? "Pause" : "Start"} Scroll
                  </button>
                </div>
                
                <button
                  onClick={listenToScript}
                  disabled={isProcessing || isAISpeaking}
                  className={`w-full mt-3 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    isProcessing || isAISpeaking ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FaPlay /> Listen to Script
                </button>
              </div>
            )}
            
            {/* Trainer Profile Section */}
            {speechStarted && (
              <div className="mt-6 bg-gray-700 border border-gray-600 rounded-xl p-6">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/3">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/30 to-blue-900/30">
                      <img
                        src={selectedTrainer.profileImage}
                        alt={selectedTrainer.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <h3 className="text-2xl font-bold text-white">{selectedTrainer.name}</h3>
                        <p className="text-purple-300 text-lg">{selectedTrainer.role}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-2/3">
                    <div className="space-y-6">
                      <h3 className="text-3xl font-bold text-white">About Your Coach</h3>
                      <p className="text-gray-200 text-lg">{selectedTrainer.bio}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-600/50 p-4 rounded-xl">
                          <p className="text-purple-400 font-bold text-lg">Experience</p>
                          <p className="text-gray-200">{selectedTrainer.experience}</p>
                        </div>
                        <div className="bg-gray-600/50 p-4 rounded-xl">
                          <p className="text-purple-400 font-bold text-lg">Specialties</p>
                          <p className="text-gray-200">{selectedTrainer.specialties.join(", ")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Transcript Section */}
          <div className="lg:w-1/2 bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-purple-400">Your Speech Transcript</h2>
              {listening && (
                <button
                  onClick={stopListening}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <FaStop /> Stop
                </button>
              )}
            </div>
            
            {speechStarted && (
              <div className="relative">
                <div className="bg-gray-700 rounded-xl p-8 h-[500px] overflow-y-auto border border-gray-600">
                  <p className="text-white">
                    {transcript || (listening ? "Speak now, your words will appear here..." : "Click the button below to record your speech")}
                  </p>
                </div>
                
                <button
                  onClick={recordSpeech}
                  disabled={isProcessing}
                  className={`w-full mt-4 py-4 rounded-xl text-white flex items-center justify-center gap-4 text-xl font-medium ${
                    listening
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  } transition-all duration-300 shadow-lg`}
                >
                  {listening ? (
                    <>
                      <FaMicrophone className="animate-pulse" /> Recording...
                    </>
                  ) : (
                    <>
                      <FaMicrophone /> Record Your Speech
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showFeedback && (
        <FeedbackModal
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
          feedback={feedback}
          type="speech"
          topic={topic}
          trainerName={selectedTrainer.name}
        />
      )}
    </div>
  );
};

export default Speech;