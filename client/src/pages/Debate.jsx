import { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { getDebateResponse, getDebateFeedback } from "../utils/aiHandler";
import { convertTextToSpeech } from "../utils/speech";
import { aiTrainers } from "../config/aiTrainers";
import FeedbackModal from "../components/FeedbackModal";
import { submitFeedback } from "../utils/service";
import { FaMicrophone, FaStop, FaPlay, FaChartBar, FaUserTie, FaChevronDown } from "react-icons/fa";
import AITrainerDisplay from "../components/AITrainerDisplay";

const Debate = () => {
  const [selectedTrainer, setSelectedTrainer] = useState(aiTrainers[1]);
  const [topic, setTopic] = useState("");
  const [areaOfInterest, setAreaOfInterest] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);
  const [debateStarted, setDebateStarted] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [fullTranscript, setFullTranscript] = useState("");
  const [lastTranscript, setLastTranscript] = useState("");
  const [isTrainerOpen, setIsTrainerOpen] = useState(false);
  const [error, setError] = useState(null);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

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

  const startDebate = async () => {
    if (!topic.trim()) {
      alert("Please enter a debate topic");
      return;
    }
    if (!isBrowserSupported) {
      alert("Browser doesn't support speech recognition");
      return;
    }

    setIsProcessing(true);
    setDebateStarted(true);

    try {
      const response = await getDebateResponse(selectedTrainer.name, topic, areaOfInterest, "", "");
      await handleAIResponse(response);
      setError(null);
    } catch (error) {
      handleError(error);
      setError(error);
    } finally {
      setIsProcessing(false);
    }
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

  const handleError = (error) => {
    console.error("Error:", error);
    setCurrentSubtitle("An error occurred. Please try again.");
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
        const response = await getDebateResponse(
          selectedTrainer.name,
          topic,
          areaOfInterest,
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

  const endDebate = async () => {
    setIsProcessing(true);
    try {
       
      const feedback = await getDebateFeedback(topic, conversation);
      await submitFeedback({
        type: 'debate',
        topic: topic || 'General Debate Practice',
        trainerName: selectedTrainer.name||'SKILLUP AI',
        feedback: feedback,
      });
      setFeedback(feedback);
      setShowFeedback(true);
      setError(null);
    } catch (error) {
      setFeedback("Failed to generate feedback. Please try again.");
      setError(error);
      setShowFeedback(true);
    } finally {
      setIsProcessing(false);
      setDebateStarted(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 mt-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Debate Arena
          </h1>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto">
            Engage in a lively debate with {selectedTrainer.name}, our expert {selectedTrainer.role.toLowerCase()}.
          </p>
        </div>

        {!isBrowserSupported && (
          <div className="bg-red-600/20 border-l-4 border-red-600 text-red-300 p-4 mb-8 rounded-lg text-center">
            <p>Your browser doesn't support speech recognition. Please use Chrome or Edge for the best experience.</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">



          <div className="lg:w-1/3 bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-8 text-purple-400 flex items-center justify-center gap-3">
              <FaMicrophone className="text-2xl" />
              Debate Setup
            </h2>

            <div className="space-y-8">



              <div className="relative">
                <label className="block text-gray-300 mb-3 text-lg font-medium">AI Debater</label>
                <div
                  className="bg-gray-700 border border-gray-600 rounded-xl px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-650 transition duration-300"
                  onClick={() => setIsTrainerOpen(!isTrainerOpen)}
                >
                  <div className="flex items-center gap-4">
                    <FaUserTie className="text-purple-400 text-2xl" />
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
                        <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                        <div>
                          <p className="font-medium text-white text-lg">{trainer.name}</p>
                          <p className="text-xs text-gray-400">{trainer.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>



              <div>
                <label className="block text-gray-300 mb-3 text-lg font-medium">Debate Topic</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-transparent transition text-lg"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="E.g., Should social media be regulated?"
                  disabled={debateStarted}
                />
              </div>



              <div>
                <label className="block text-gray-300 mb-3 text-lg font-medium">Area of Interest</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-transparent transition text-lg"
                  value={areaOfInterest}
                  onChange={(e) => setAreaOfInterest(e.target.value)}
                  placeholder="E.g., Technology, Politics"
                  disabled={debateStarted}
                />
              </div>


              {!debateStarted ? (
                <button
                  onClick={startDebate}
                  disabled={isProcessing || !topic.trim()}
                  className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 text-xl ${
                    isProcessing || !topic.trim()
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/30 transform hover:scale-105'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Preparing Debate...
                    </>
                  ) : (
                    <>
                      <FaPlay className="text-xl" /> Start Debate
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={endDebate}
                  className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-bold hover:from-red-700 hover:to-orange-700 shadow-lg hover:shadow-red-500/30 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 text-xl"
                  disabled={isProcessing}
                >
                  <FaChartBar className="text-xl" /> End Debate & Get Feedback
                </button>
              )}
            </div>
          </div>

          <div className="lg:w-2/3 bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col items-center space-y-8">
              <div className="w-full max-w-3xl">
                <AITrainerDisplay
                  trainer={selectedTrainer}
                  isSpeaking={isAISpeaking}
                  isListening={isUserSpeaking}
                  hasError={!!error}
                  subtitle={currentSubtitle || `${selectedTrainer.name} is ready for the debate`}
                />
              </div>

              {debateStarted && (
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
                        <FaMicrophone className="text-2xl" /> Record Your Argument
                      </>
                    )}
                  </button>

                  <div className="bg-gray-700 rounded-xl p-8">
                    <p className="font-medium text-gray-300 mb-4 text-xl">Your Argument:</p>
                    <div className="min-h-32 p-6 bg-gray-800 rounded-lg border border-gray-600">
                      <p className="text-white text-lg">
                        {listening
                          ? fullTranscript || "Speak now, your words will appear here..."
                          : fullTranscript || "Click the button above to record your argument"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {conversation.length > 0 && (
                <div className="w-full max-w-3xl bg-gray-700 border border-gray-600 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-6 text-purple-400 text-center">
                    Debate Transcript
                  </h3>
                  <div className="space-y-6 max-h-96 overflow-y-auto pr-4">
                    {conversation.map((msg, index) => (
                      <div
                        key={index}
                        className={`p-6 rounded-xl ${
                          msg.speaker === "ai"
                            ? "bg-purple-900/40 border-l-4 border-purple-500"
                            : "bg-blue-900/40 border-l-4 border-blue-500"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-3 h-3 rounded-full mt-2 ${
                            msg.speaker === "ai" ? "bg-purple-500" : "bg-blue-500"
                          }`}></div>
                          <div className="flex-1">
                            <strong className={`block mb-2 ${
                              msg.speaker === "ai" ? "text-purple-300" : "text-blue-300"
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
            type="debate"
            topic={topic}
            trainerName={selectedTrainer.name}
          />
        )}
      </div>
    </div>
  );
};

export default Debate;
