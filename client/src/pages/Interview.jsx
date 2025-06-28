import { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { aiTrainers } from "../config/aiTrainers";
import { convertTextToSpeech } from "../utils/speech";
import { getInterviewStart, getInterviewResponse, getInterviewFeedback } from "../utils/aiHandler";
import FeedbackModal from "../components/FeedbackModal";
import AITrainerDisplay from "../components/AITrainerDisplay";
import { submitFeedback } from "../utils/service";
import { FaMicrophone, FaStop, FaPlay, FaFileUpload, FaUserTie, FaChevronDown, FaChartBar } from "react-icons/fa";

const Interview = () => {
  const [selectedTrainer, setSelectedTrainer] = useState(aiTrainers[0]);
  const [resume, setResume] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [fullTranscript, setFullTranscript] = useState("");
  const [lastTranscript, setLastTranscript] = useState("");
  const [isTrainerOpen, setIsTrainerOpen] = useState(false);
  const [error, setError] = useState(null);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setIsBrowserSupported(false);
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    setIsUserSpeaking(listening);
  }, [listening]);

  useEffect(() => {
    if (listening && transcript) {
      const newWords = transcript.slice(lastTranscript.length).trim();
      if (newWords) {
        setFullTranscript(prev => (prev ? `${prev} ${newWords}` : newWords).trim());
      }
      setLastTranscript(transcript);
    }
  }, [transcript, listening]);

  useEffect(() => {
    if (!listening) {
      setLastTranscript("");
    }
  }, [listening]);

  const startListening = () => {
    setFullTranscript("");
    setLastTranscript("");
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleAIResponse = async (response) => {
    const aiResponse = { speaker: "ai", text: response };
    setConversation(prev => [...prev, aiResponse]);
    setCurrentSubtitle(response);
    setIsAISpeaking(true);

    try {
      await convertTextToSpeech(response, selectedTrainer.name);
    } catch (error) {
      console.error("Text-to-speech error:", error);
    } finally {
      setIsAISpeaking(false);
    }
  };

  const startInterview = async () => {
    if (!resume && !resumeText.trim()) {
      alert("Please upload a resume or enter details");
      return;
    }
    if (!isBrowserSupported) return;

    setIsProcessing(true);
    setInterviewStarted(true);

    try {
      const response = await getInterviewStart(
        selectedTrainer.name,
        jobDescription,
        resumeText
      );
      await handleAIResponse(response);
      setError(null);
    } catch (error) {
      console.error("Error:", error);
      setError(error);
      setCurrentSubtitle("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const recordResponse = async () => {
    if (isProcessing) return;

    if (!listening) {
      return startListening();
    }

    setIsProcessing(true);
    stopListening();
    await new Promise(resolve => setTimeout(resolve, 800));

    if (fullTranscript.trim()) {
      const userMessage = { speaker: "user", text: fullTranscript };
      setConversation(prev => [...prev, userMessage]);

      try {
        const context = conversation.map(msg => `${msg.speaker}: ${msg.text}`).join("\n");
        const response = await getInterviewResponse(
          selectedTrainer.name,
          jobDescription,
          resumeText,
          context,
          fullTranscript
        );
        await handleAIResponse(response);
        setError(null);
      } catch (error) {
        console.error("Error:", error);
        setError(error);
      }
    }

    setIsProcessing(false);
    resetTranscript();
    setFullTranscript("");
    setLastTranscript("");
  };

  const endInterview = async () => {
    setIsProcessing(true);
    try {
      const feedback = await getInterviewFeedback(
        jobDescription,
        resumeText,
        conversation
      );
       await submitFeedback({
        type: 'interview',
        topic: 'General Interview Practice',
        trainerName: selectedTrainer.name||'SKILLUP AI',
        feedback: feedback,
      });

      setFeedback(feedback);
      setShowFeedback(true);
      setError(null);
    } catch (error) {
      console.error("Error generating feedback:", error);
      setError(error);
      setFeedback({
        summary: "Failed to generate feedback. Please try again.",
        stats: {},
        highlights: [],
        improvements: [],
        tips: [],
        quote: "",
        next_steps: []
      });
      setShowFeedback(true);
    } finally {
      setIsProcessing(false);
      setInterviewStarted(false);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResume(file);
    setResumeText(`[Resume: ${file.name}]`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 mt-6 bg-gradient-to-r from-blue-400 to-teal-500 bg-clip-text text-transparent">
            Mock Interview
          </h1>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto">
            Practice with {selectedTrainer.name}, our {selectedTrainer.role.toLowerCase()}.
          </p>
        </div>

        {!isBrowserSupported && (
          <div className="bg-red-600/20 border-l-4 border-red-600 text-red-300 p-4 mb-8 rounded-lg text-center">
            <p>Your browser doesn't support speech recognition. Please use Chrome or Edge for the best experience.</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row-reverse gap-8">
          {/* Setup Panel - Now on the right */}
          <div className="lg:w-1/3 bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-8 text-blue-400 flex items-center justify-center gap-3">
              <FaUserTie className="text-2xl" />
              Interview Setup
            </h2>

            <div className="space-y-8">
              {/* Trainer Selection */}
              <div className="relative">
                <label className="block text-gray-300 mb-3 text-lg font-medium">AI Trainer</label>
                <div
                  className="bg-gray-700 border border-gray-600 rounded-xl px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-650 transition duration-300"
                  onClick={() => setIsTrainerOpen(!isTrainerOpen)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <div>
                      <p className="font-medium text-white text-xl">{selectedTrainer.name}</p>
                      <p className="text-xs text-gray-400">{selectedTrainer.role}</p>
                    </div>
                  </div>
                  <FaChevronDown className={`text-gray-400 transition-transform ${isTrainerOpen ? 'transform rotate-180' : ''}`} />
                </div>

                {isTrainerOpen && (
                  <div className="absolute z-10 mt-2 w-full bg-gray-700 border border-gray-600 rounded-xl shadow-xl overflow-hidden">
                    {aiTrainers.map(trainer => (
                      <div
                        key={trainer.id}
                        className={`px-6 py-4 hover:bg-gray-600 cursor-pointer flex items-center gap-4 ${
                          selectedTrainer.id === trainer.id ? 'bg-gray-600' : ''
                        }`}
                        onClick={() => {
                          setSelectedTrainer(trainer);
                          setIsTrainerOpen(false);
                        }}
                      >
                        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                        <div>
                          <p className="font-medium text-white text-lg">{trainer.name}</p>
                          <p className="text-xs text-gray-400">{trainer.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-gray-300 mb-3 text-lg font-medium">Job Description</label>
                <textarea
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition text-lg min-h-[120px]"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Enter job description or role you're preparing for"
                  disabled={interviewStarted}
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-gray-300 mb-3 text-lg font-medium">Upload Resume</label>
                <label className={`flex flex-col items-center justify-center w-full h-40 border-2 ${interviewStarted ? 'border-gray-700' : 'border-gray-600'} border-dashed rounded-xl cursor-pointer bg-gray-700 hover:bg-gray-650 transition`}>
                  <div className="flex flex-col items-center justify-center pt-8 pb-10">
                    <FaFileUpload className={`${interviewStarted ? 'text-gray-600' : 'text-blue-400'} text-4xl mb-4`} />
                    <p className={`text-lg ${interviewStarted ? 'text-gray-600' : 'text-gray-400'}`}>
                      {resume ? resume.name : "Click to upload PDF"}
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    className="hidden"
                    disabled={interviewStarted}
                  />
                </label>
              </div>

              {/* Resume Details */}
              <div>
                <label className="block text-gray-300 mb-3 text-lg font-medium">Or Enter Resume Details</label>
                <textarea
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition text-lg min-h-[120px]"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume details here..."
                  disabled={interviewStarted}
                />
              </div>

              {/* Start/End Interview Button */}
              {!interviewStarted ? (
                <button
                  onClick={startInterview}
                  disabled={isProcessing || (!resume && !resumeText.trim())}
                  className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 text-xl ${
                    isProcessing || (!resume && !resumeText.trim())
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:from-blue-700 hover:to-teal-600 shadow-lg hover:shadow-blue-500/30 transform hover:scale-105'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Preparing Interview...
                    </>
                  ) : (
                    <>
                      <FaPlay className="text-xl" /> Start Interview
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={endInterview}
                  className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-pink-500 text-white rounded-xl font-bold hover:from-red-700 hover:to-pink-600 shadow-lg hover:shadow-red-500/30 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 text-xl"
                  disabled={isProcessing}
                >
                  <FaChartBar className="text-xl" /> End Interview & Get Feedback
                </button>
              )}
            </div>
          </div>

          {/* Interview Area - Now on the left */}
          <div className="lg:w-2/3 bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col items-center space-y-8">
              {/* AI Trainer Display */}
              <div className="w-full max-w-3xl">
                <AITrainerDisplay
                  trainer={selectedTrainer}
                  isSpeaking={isAISpeaking}
                  isListening={isUserSpeaking}
                  hasError={!!error}
                  subtitle={currentSubtitle || `${selectedTrainer.name} is ready to interview you`}
                />
              </div>

              {/* Response Controls */}
              {interviewStarted && (
                <div className="w-full max-w-3xl space-y-8">
                  <button
                    onClick={recordResponse}
                    className={`px-10 py-5 rounded-xl text-white w-full flex items-center justify-center gap-4 text-2xl font-medium ${
                      listening
                        ? "bg-red-600 hover:bg-red-700 transform hover:scale-105"
                        : "bg-green-600 hover:bg-green-700 transform hover:scale-105"
                    } transition-all duration-300 shadow-lg`}
                    disabled={isProcessing}
                  >
                    {listening ? (
                      <>
                        <FaStop className="text-2xl" /> Stop Recording
                      </>
                    ) : (
                      <>
                        <FaMicrophone className="text-2xl" /> Record Response
                      </>
                    )}
                  </button>

                  {/* Transcript Display */}
                  <div className="bg-gray-700 rounded-xl p-8">
                    <p className="font-medium text-gray-300 mb-4 text-xl">Your Response:</p>
                    <div className="min-h-32 p-6 bg-gray-800 rounded-lg border border-gray-600">
                      <p className="text-white text-lg">
                        {listening
                          ? fullTranscript || "Speak now, your words will appear here..."
                          : fullTranscript || "Press the button above to record your response"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Conversation History */}
              {conversation.length > 0 && (
                <div className="w-full max-w-3xl bg-gray-700 border border-gray-600 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-6 text-blue-400 text-center">
                    Interview Transcript
                  </h3>
                  <div className="space-y-6 max-h-96 overflow-y-auto pr-4">
                    {conversation.map((msg, index) => (
                      <div
                        key={index}
                        className={`p-6 rounded-xl ${
                          msg.speaker === "ai"
                            ? "bg-blue-900/40 border-l-4 border-blue-500"
                            : "bg-teal-900/40 border-l-4 border-teal-500"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-3 h-3 rounded-full mt-2 ${
                            msg.speaker === "ai" ? "bg-blue-500" : "bg-teal-500"
                          }`}></div>
                          <div className="flex-1">
                            <strong className={`block mb-2 ${
                              msg.speaker === "ai"
                                ? "text-blue-300"
                                : "text-teal-300"
                            }`}>
                              {msg.speaker === "ai" ? selectedTrainer.name : "You"}:
                            </strong>
                            <p className="text-white text-lg">{msg.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
            type="interview"
            topic={jobDescription}
            trainerName={selectedTrainer.name}
          />
        )}
      </div>
    </div>
  );
};

export default Interview;
