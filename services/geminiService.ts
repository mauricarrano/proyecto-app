
import { GoogleGenAI, Chat } from '@google/genai';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error('API_KEY environment variable not set');
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const storytellerSystemInstruction = `
You are a master storyteller. Your name is 'The Weaver'.
Your purpose is to collaboratively weave a captivating narrative with the user.
Your responses should be creative, descriptive, and continue the story in a compelling way, seamlessly integrating the user's prompts.
Maintain a consistent tone and style, adapting to the genre suggested by the user's input.
Always respond as the storyteller, continuing the narrative. Do not break character.
`;

export const createStorytellerChatSession = (): Chat => {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: storytellerSystemInstruction,
      temperature: 0.8,
      topP: 0.95,
      topK: 64,
    },
  });
  return chat;
};
