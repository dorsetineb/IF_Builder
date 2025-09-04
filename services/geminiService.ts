

// FIX: Removed unused 'Modality' import as it is not needed for the updated image generation logic.
import { GoogleGenAI } from "@google/genai";

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

// FIX: Updated to use the recommended 'imagen-4.0-generate-001' model and 'generateImages' method for image generation. This aligns with current best practices and is more suitable for creating a new image from a text prompt.
export const generateSceneImage = async (prompt: string): Promise<string> => {
    try {
        const client = getAiClient();
        const response = await client.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: '9:16',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
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
