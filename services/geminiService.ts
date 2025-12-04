import { GoogleGenAI } from "@google/genai";
import { UserStats } from "../types";

// Helper to remove data URL prefix
const stripBase64Prefix = (base64: string) => {
  return base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

export const generateProgrammerAvatar = async (
  base64Image: string,
  stats: UserStats
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Construct a rich prompt based on user stats
  const prompt = `
    Transform the attached image into a high-quality, stylized 'Year in Review' avatar for a programmer.
    
    **User's Annual Summary Data:**
    """
    ${stats.summary}
    """
    
    **Instructions:**
    1. **Analyze the Summary:** Extract key elements from the text above (Role, Languages, Mood, Achievements, Intensity) and visualize them abstractly or symbolically in the avatar's outfit, accessories, or background.
    2. **Identity Preservation:** Maintain the facial structure, pose, and identity of the person in the source image.
    3. **Style Application:** Completely re-render the image in the **${stats.artStyle}** style.
    4. **Composition:** The result should be a cohesive, professional illustration suitable for a social media profile picture.
    5. **Details:** High resolution, detailed textures, expressive lighting.
  `;

  try {
    const cleanBase64 = stripBase64Prefix(base64Image);

    // Using gemini-3-pro-image-preview (NanoBanana Pro) for high quality image-to-image generation
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: 'image/png', // Assuming PNG or JPEG, API is flexible with mime if data is valid
              data: cleanBase64,
            },
          },
        ],
      },
      config: {
        imageConfig: {
          imageSize: "1K", // Good balance for avatar generation
          aspectRatio: "1:1", // Perfect for avatars
        },
      },
    });

    // Extract image from response
    // The response might contain text (rarely for this model if strictly image gen) or inlineData
    // We iterate to find the image part.
    let generatedImageBase64 = '';
    
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                generatedImageBase64 = part.inlineData.data;
                break;
            }
        }
    }

    if (!generatedImageBase64) {
      throw new Error("No image data returned from the model.");
    }

    return `data:image/png;base64,${generatedImageBase64}`;

  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};