import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Use the mapped model name for "nano banana" / flash image
const MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * Helper to convert a URL to Base64 string.
 * Handles CORS by assuming the backend/host allows it, or falls back for data URLs.
 */
export const urlToBase64 = async (url: string): Promise<string> => {
  // If it's already a data URL, strip the prefix
  if (url.startsWith('data:')) {
    return url.split(',')[1];
  }

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Return just the base64 data, not the prefix
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting URL to Base64:", error);
    throw new Error("无法加载图片，请尝试上传本地图片或检查网络连接。");
  }
};

/**
 * Generates a clothing item image based on a text description.
 */
export const generateClothingImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            text: `Professional product photography of ${prompt}, flat lay on a clean neutral background, soft lighting, high fashion quality cloth, isolated.`,
          },
        ],
      },
      config: {
        imageConfig: {
            aspectRatio: "1:1",
        }
      }
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Generate Clothing Error:", error);
    throw error;
  }
};

/**
 * Generates a try-on result using the person image and clothes image.
 * Since we don't have a dedicated VTON model, we use the multimodal editing capabilities
 * by passing both images and a strong instruction.
 */
export const generateTryOnResult = async (personUrl: string, clothesUrl: string): Promise<string> => {
  try {
    const personBase64 = await urlToBase64(personUrl);
    const clothesBase64 = await urlToBase64(clothesUrl);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
            // Order matters: Text instruction first or last is fine, but context is key.
          {
            text: "A high-quality photo realistic image generation task. " +
                  "Reference Image 1 is a person. Reference Image 2 is a piece of clothing. " +
                  "Generate a new full-body image of the person from Image 1 wearing the clothing from Image 2. " +
                  "Preserve the person's identity, facial features, body shape, and pose as much as possible. " +
                  "Fit the clothing naturally onto the body. High fashion photography style, realistic lighting and textures.",
          },
          {
            inlineData: {
              mimeType: 'image/png',
              data: personBase64,
            },
          },
          {
            inlineData: {
              mimeType: 'image/png',
              data: clothesBase64,
            },
          },
        ],
      },
      config: {
        imageConfig: {
            aspectRatio: "3:4", // Portrait for full body
        }
      }
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");

  } catch (error) {
    console.error("Generate Try-On Error:", error);
    throw error;
  }
};
