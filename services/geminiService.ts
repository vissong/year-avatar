
import { GoogleGenAI } from "@google/genai";
import { UserStats, GenerationMode } from "../types";

// Helper to remove data URL prefix
const stripBase64Prefix = (base64: string) => {
  return base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

export const generateProgrammerImage = async (
  base64Image: string,
  stats: UserStats,
  mode: GenerationMode
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  let prompt = "";
  let aspectRatio = "1:1";

  if (mode === GenerationMode.SCENE) {
    aspectRatio = "4:3";
    prompt = `
    Transform the attached image into a cinematic, narrative-driven scene depicting a programmer's year in review.
    
    **User's Annual Summary Data:**
    """
    ${stats.summary}
    """
    
    **Instructions:**
    1. **Scene Construction:** Create a wider shot (4:3 aspect ratio) showing the subject in a detailed environment that tells a story based on the summary data.
    2. **Context:** If they mention coffee and late nights, show a cozy, dimly lit desk cluttered with mugs. If they mention high-speed coding or heavy achievements, create a dynamic, high-tech command center.
    3. **Identity Preservation:** Keep the character from the source image recognizable but stylized.
    4. **Style Application:** Render the entire scene in the **${stats.artStyle}** style.
    5. **Atmosphere:** Focus on lighting, background details, and mood to convey the "story" of their year.
    `;
  } else {
    // Default to AVATAR
    aspectRatio = "1:1";
    prompt = `
    Transform the attached image into a high-quality, stylized 'Year in Review' avatar for a programmer.
    
    **User's Annual Summary Data:**
    """
    ${stats.summary}
    """
    
    **Instructions:**
    1. **Analyze the Summary:** Extract key elements from the text above and visualize them abstractly or symbolically in the avatar's outfit, accessories, or immediate background.
    2. **Identity Preservation:** Maintain the facial structure, pose, and identity of the person in the source image.
    3. **Style Application:** Completely re-render the image in the **${stats.artStyle}** style.
    4. **Composition:** The result should be a cohesive, professional illustration suitable for a social media profile picture (Head & Shoulders focus).
    5. **Details:** High resolution, detailed textures, expressive lighting.
    `;
  }

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
          imageSize: "1K", 
          aspectRatio: aspectRatio, 
        },
      },
    });

    // Extract image from response
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
