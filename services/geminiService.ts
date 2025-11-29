import { GoogleGenAI, Type } from "@google/genai";
import { ProfileSuggestion, ThemeMode, SoundMode } from "../types";

// Note: Using a dummy key if env is not present for safety in dev, but strictly following prompt rules for production code.
// The user prompt specifically says "The API key must be obtained exclusively from the environment variable process.env.API_KEY".
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

export const getSmartProfileSuggestion = async (wifiSsid: string): Promise<ProfileSuggestion> => {
  if (!apiKey) {
    console.warn("API Key missing, returning default suggestion.");
    return {
      theme: ThemeMode.LIGHT,
      sound: SoundMode.NORMAL,
      brightness: 50,
      bluetooth: true,
      reasoning: "Default configuration (API Key missing)."
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the Wi-Fi SSID "${wifiSsid}" and suggest optimal phone settings.
      
      Context clues:
      - "Gym", "Workout" -> High brightness, Do Not Disturb or Vibrate, Bluetooth ON.
      - "Library", "Study" -> Silent, Medium Brightness.
      - "Home" -> Normal Sound, Auto Brightness (50%).
      - "Work", "Office" -> Vibrate, Dark Theme.
      
      Return a JSON object with:
      - theme: "Light" or "Dark"
      - sound: "Normal", "Vibrate", or "Silent"
      - brightness: integer 0-100
      - bluetooth: boolean
      - reasoning: short explanation string
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            theme: { type: Type.STRING, enum: [ThemeMode.LIGHT, ThemeMode.DARK] },
            sound: { type: Type.STRING, enum: [SoundMode.NORMAL, SoundMode.VIBRATE, SoundMode.SILENT] },
            brightness: { type: Type.INTEGER },
            bluetooth: { type: Type.BOOLEAN },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as ProfileSuggestion;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback
    return {
      theme: ThemeMode.LIGHT,
      sound: SoundMode.NORMAL,
      brightness: 50,
      bluetooth: true,
      reasoning: "Could not analyze network. Using defaults."
    };
  }
};
