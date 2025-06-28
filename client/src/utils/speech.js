import axios from "axios";
import { aiTrainers } from "../config/aiTrainers";

export const convertTextToSpeech = async (text, trainerName = "Aarav Sharma") => {
  try {
    
    const trainer = aiTrainers.find(t => t.name === trainerName);
    
    const voiceConfig = trainer?.voiceProfile || {
      voiceId: "en-US-terrell",
      style: "Conversational",
      rate: 0,
      pitch: 0
    };


    const response = await axios.post(
      "https://api.murf.ai/v1/speech/generate",
      {
        text: text,
        voiceId: voiceConfig.voiceId,
        format: "WAV",
        channelType: "STEREO",
        sampleRate: 44100,
        style: voiceConfig.style,
        rate: voiceConfig.rate,
        pitch: voiceConfig.pitch
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "api-key": import.meta.env.VITE_MURF_API_KEY,
         
        },
      }
    );

    const audioResponse = await axios.get(response.data.audioFile, {
      responseType: "arraybuffer",
    });
    const arrayBuffer = audioResponse.data;
    const blob = new Blob([arrayBuffer], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);

    const audio = new Audio(url);
    await audio.play();

    audio.onended = () => URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Error with Murf text-to-speech:", error.message);
    return false;
  }
};

export const convertSpeechToText = async (audioBlob) => {
  try {
    const transcription = await groq.audio.transcriptions.create({
      file: audioBlob,
      model: "whisper-large-v3-turbo",
      response_format: "text",
      language: "en"
    });
    
    return transcription.text;
  } catch (error) {
    console.error("Error with speech-to-text:", error);
    return "";
  }
};


