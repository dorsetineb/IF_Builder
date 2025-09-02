
import { GoogleGenAI, Modality } from "@google/genai";

// We won't initialize the client at the module level to prevent crashes on load
// if the API key environment variable isn't set up correctly.
let ai: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
    // Initialize on first use
    if (!ai) {
        const API_KEY = process.env.API_KEY;
        if (!API_KEY) {
            // This error will be caught by the calling function and displayed to the user.
            throw new Error("Chave de API do Google AI não configurada.");
        }
        ai = new GoogleGenAI({ apiKey: API_KEY });
    }
    return ai;
}

export const generateSceneDescription = async (prompt: string): Promise<string> => {
  try {
    const client = getAiClient();
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Aja como um mestre de RPG. Crie uma descrição de cena rica e imersiva para um jogo de aventura de texto com base no seguinte prompt. A descrição deve ter cerca de 2 a 3 parágrafos. Prompt: "${prompt}"`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating scene description:", error);
    if (error instanceof Error) {
        return `Não foi possível gerar a descrição: ${error.message}`;
    }
    return "Não foi possível gerar a descrição. Verifique o console para mais detalhes.";
  }
};

export const generateSceneImage = async (prompt: string): Promise<string> => {
    try {
        const client = getAiClient();
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        if (response.candidates && response.candidates.length > 0) {
            const imagePart = response.candidates[0].content.parts.find(part => part.inlineData);
            if (imagePart && imagePart.inlineData) {
                const base64ImageBytes: string = imagePart.inlineData.data;
                const mimeType = imagePart.inlineData.mimeType;
                return `data:${mimeType};base64,${base64ImageBytes}`;
            }
        }
        throw new Error("A API não retornou uma imagem.");

    } catch (error) {
        console.error("Error generating scene image:", error);
        if (error instanceof Error) {
            throw new Error(`Não foi possível gerar a imagem: ${error.message}`);
        }
        throw new Error("Não foi possível gerar a imagem. Verifique o console para mais detalhes.");
    }
};
