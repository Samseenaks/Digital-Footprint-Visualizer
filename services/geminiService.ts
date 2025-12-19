
import { GoogleGenAI, Type } from "@google/genai";
import { ExposureLevel, FootprintData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const footprintSchema = {
  type: Type.OBJECT,
  properties: {
    identity: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Name found in text, 'Anonymous' if not found." },
        role: { type: Type.STRING, description: "Professional role or occupation." },
        location: { type: Type.STRING, description: "General location or 'Not specified'." }
      },
      required: ["name", "role", "location"]
    },
    capabilities: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Skills, interests, or tools mentioned."
    },
    activitySignals: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Patterns of behavior or active contributions mentioned."
    },
    detectedSources: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Probable sources or platforms detected in the text (e.g., LinkedIn, GitHub, X/Twitter, Personal Portfolio)."
    },
    exposureLevel: {
      type: Type.STRING,
      enum: ["Low", "Medium", "High"],
      description: "Overall privacy exposure level."
    },
    riskReasoning: {
      type: Type.STRING,
      description: "Clear explanation of why this exposure level was chosen."
    },
    tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Actionable privacy improvement tips."
    },
    metrics: {
      type: Type.OBJECT,
      properties: {
        professionalDensity: { type: Type.NUMBER, description: "How much career info is public (0-100)." },
        socialConnectivity: { type: Type.NUMBER, description: "How connected the person seems (0-100)." },
        activityFrequency: { type: Type.NUMBER, description: "How active the person appears (0-100)." },
        privacyResilience: { type: Type.NUMBER, description: "General estimate of data protection (0-100)." }
      },
      required: ["professionalDensity", "socialConnectivity", "activityFrequency", "privacyResilience"]
    }
  },
  required: ["identity", "capabilities", "activitySignals", "detectedSources", "exposureLevel", "riskReasoning", "tips", "metrics"]
};

export async function analyzeFootprint(userInput: string): Promise<FootprintData> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following public profile data or bio and extract a privacy footprint summary. 
    Focus only on publicly visible information. 
    Be objective and helpful.
    Identify likely platforms this text came from (e.g. if it mentions 'connections' or 'endorsements', it's LinkedIn-like).
    
    Data to analyze:
    ---
    ${userInput}
    ---`,
    config: {
      responseMimeType: "application/json",
      responseSchema: footprintSchema,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as FootprintData;
}
