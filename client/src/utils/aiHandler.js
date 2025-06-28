import { fetchGeminiResponse } from "./api.js"; 


export const getInterviewStart = async (trainerName, jobDescription, resumeText) => {
  const prompt = `
  Role: You are ${trainerName}, a professional interview coach conducting a mock interview.
  
  Job Position: ${jobDescription || "Not specified"}
  Candidate Resume: ${resumeText || "Not provided"}
  
  Instructions:
  1. Begin with a professional greeting
  2. Ask your first question based on:
     - The job requirements
     - The candidate's resume (if provided)
  3. Keep the question clear and relevant
  4. Limit to 1-2 sentences maximum
  
  Example Structure:
  "Hello [Candidate], thank you for joining. [Specific question based on job/resume]"
  
  Current Task: Provide your opening question/statement:`;
  
  return await getAIResponse(prompt);
};
export const getInterviewResponse = async (trainerName, jobDescription, resumeText, context, userResponse) => {
  const prompt = `
  Role: Continue as ${trainerName}, the interview coach.
  
  Job Position: ${jobDescription}
  Candidate Resume: ${resumeText || "Not provided"}
  
  Previous Conversation:
  ${context}
  
  Candidate's Latest Response:
  ${userResponse}
  
  Your Task:
  1. Analyze the response for:
     - Relevance to job requirements
     - Technical accuracy (if technical question)
     - Behavioral indicators
  2. Choose ONE of these actions:
     a) Ask a follow-up question to dig deeper
     b) Move to next relevant topic
     c) Provide brief constructive feedback
  3. Keep response concise (2-3 sentences max)
  
  Guidelines:
  - For technical roles: Focus on skills verification
  - For behavioral questions: Look for STAR pattern
  - Always maintain professional tone
  
  Provide your next interview response:`;
  
  return await getAIResponse(prompt);
};

export const getSpeechScript = async (topic) => {
  const prompt = `
  give a two three easy english paragraph on this topic- ${topic}`;
  
  return await getAIResponse(prompt);
};



export const getInterviewFeedback = async (jobDescription, resumeText, conversation) => {
  const context = conversation.map(msg => `${msg.speaker}: ${msg.text}`).join("\n");
  
  const prompt = `Generate comprehensive interview feedback in this EXACT JSON format:
{
  "summary": "Brief 2-sentence overall performance summary",
  "stats": {
    "technical_skills": {"score": 1-5, "comment": "analysis"},
    "communication": {"score": 1-5, "comment": "analysis"},
    "confidence": {"score": 1-5, "comment": "analysis"},
    "problem_solving": {"score": 1-5, "comment": "analysis"}
  },
  "highlights": ["3 specific strong points with timestamps"],
  "improvements": ["3 specific areas needing work with suggestions"],
  "tips": ["3 actionable tips for next interview"],
  "quote": "Motivational quote about professional growth",
  "next_steps": ["1 skill to practice", "1 mock interview focus area"]
}

Job Description: "${jobDescription}"
Resume: ${resumeText || "Not provided"}
Transcript:
${context}
DONT INCLUDE ANY BACKTICKS IN THE RESPONSE AT THE STARTING OR ENDING, JUST PLAIN TEXT.
`;

  return await getAIResponse(prompt);
};




export const getAIResponse = async (prompt) => {
  try {
    const response = await fetchGeminiResponse(prompt);
    return response;
  } catch (error) {
    console.error("[AI] Error:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
};

export const getDebateResponse = async (trainerName, topic, areaOfInterest, context, userResponse) => {
  const prompt = `As ${trainerName}, a debate trainer, continue this debate about "${topic}" (area: ${areaOfInterest}).
  
  Previous context:
  ${context}

  Student's response:
  ${userResponse}

  Provide a concise response (2-3 sentences) that either counters arguments, asks probing questions, or moves the debate forward.`;
  
  return await getAIResponse(prompt);
};

export const getDebateFeedback = async (topic, conversation) => {
  const context = conversation.map(msg => `${msg.speaker}: ${msg.text}`).join("\n");
  
  const prompt = `Generate comprehensive debate feedback in this EXACT JSON format:
{
  "summary": "Brief 2-sentence overall performance summary",
  "stats": {
    "argument_strength": {"score": 1-5, "comment": "analysis"},
    "clarity": {"score": 1-5, "comment": "analysis"},
    "rebuttals": {"score": 1-5, "comment": "analysis"},
    "time_management": {"score": 1-5, "comment": "analysis"}
  },
  "highlights": ["3 specific strong points with timestamps"],
  "improvements": ["3 specific areas needing work with suggestions"],
  "tips": ["3 actionable tips for next practice"],
  "quote": "Motivational quote about public speaking",
  "next_steps": ["2 recommended exercises", "1 resource to study"]
}

Debate Topic: "${topic}"
Transcript:
${context} 
DONT INCLUDE ANY BACKTICKS IN THE RESPONSE AT THE STARTING OR ENDING, JUST PLAIN TEXT.
`;

  return await getAIResponse(prompt);
};

export const getSpeechFeedback = async (topic, transcript, duration) => {
  const prompt = `Generate comprehensive speech feedback in this EXACT JSON format:
{
  "summary": "Brief 2-sentence overall performance summary",
  "stats": {
    "clarity": {"score": 1-5, "comment": "analysis"},
    "pacing": {"score": 1-5, "comment": "analysis"},
    "structure": {"score": 1-5, "comment": "analysis"},
    "vocabulary": {"score": 1-5, "comment": "analysis"}
  },
  "highlights": ["3 specific strong points"],
  "improvements": ["3 specific areas needing work with suggestions"],
  "tips": ["3 actionable tips for next practice"],
  "quote": "Motivational quote about public speaking",
  "next_steps": ["1 exercise to practice", "1 focus area"]
}

Speech Topic: "${topic}"
Practice Duration: ${duration} minutes
Transcript:
${transcript}
DONT INCLUDE ANY BACKTICKS IN THE RESPONSE AT THE STARTING OR ENDING, JUST PLAIN TEXT.
`;

  return await getAIResponse(prompt);
};

