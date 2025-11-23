import { GoogleGenAI, Type } from "@google/genai";
import { CharacterData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchCharacterMetadata = async (character: string): Promise<CharacterData> => {
  if (!character || character.length === 0) {
    throw new Error("Character is required");
  }

  const model = "gemini-2.5-flash";
  const prompt = `Analyze the single Chinese character: "${character}". 
  Provide its Pinyin (with tone marks), a concise English definition, a simple Chinese example sentence using this character, and the English translation of that sentence.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pinyin: { type: Type.STRING, description: "Pinyin with tone marks, e.g., māo" },
            definition: { type: Type.STRING, description: "Concise English definition" },
            exampleSentence: { type: Type.STRING, description: "A simple Chinese example sentence containing the character" },
            exampleSentenceMeaning: { type: Type.STRING, description: "English translation of the example sentence" },
          },
          required: ["pinyin", "definition", "exampleSentence", "exampleSentenceMeaning"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    const data = JSON.parse(text);

    return {
      char: character,
      pinyin: data.pinyin,
      definition: data.definition,
      exampleSentence: data.exampleSentence,
      exampleSentenceMeaning: data.exampleSentenceMeaning,
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback data in case of error (or graceful failure)
    return {
      char: character,
      pinyin: "Unknown",
      definition: "Could not retrieve definition.",
      exampleSentence: "",
      exampleSentenceMeaning: "",
    };
  }
};