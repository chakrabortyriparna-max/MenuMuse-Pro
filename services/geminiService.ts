import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { Dish, ImageStyle } from '../types';
import { IMAGE_EDITING_MODEL, IMAGE_GENERATION_MODEL, MENU_PARSER_MODEL, IMAGE_STYLES } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const parseMenu = async (menuText: string): Promise<Dish[]> => {
  try {
    const response = await ai.models.generateContent({
      model: MENU_PARSER_MODEL,
      contents: `Parse the following restaurant menu text and extract a list of dishes with their names and descriptions. Ignore prices, categories, and any text that isn't a dish. Menu: "${menuText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: 'The name of the dish.',
              },
              description: {
                type: Type.STRING,
                description: 'A brief description of the dish.',
              },
            },
            required: ["name", "description"],
          },
        },
      },
    });

    const jsonString = response.text;
    const dishes = JSON.parse(jsonString);
    if (!Array.isArray(dishes)) {
        throw new Error("Parsed menu is not in the expected format.");
    }
    return dishes;
  } catch (error) {
    console.error("Error parsing menu:", error);
    throw new Error("Failed to parse the menu. Please check the format and try again.");
  }
};

export const generateImages = async (dish: Dish, style: ImageStyle): Promise<{ base64: string; mimeType: string }[]> => {
  const styleDetails = IMAGE_STYLES.find(s => s.id === style)?.description || 'professional food photography';
  const prompt = `Generate 3 unique, ultra-realistic, Michelin-level food photography shots for a dish named "${dish.name}". Description: "${dish.description}". 
  The style must be strictly: ${styleDetails}.
  
  General requirements for all shots:
  - **Quality**: Cinematic, 8k, high detail, DSLR quality with soft bokeh. Texture-rich and appetizing.
  - **Realism**: Natural lighting, realistic ingredients, no cartoonish or over-saturated elements.
  - **Plating**: Modern, chef-styled, premium restaurant presentation.
  
  For each of the 3 shots, provide a different camera angle, composition, or plating variation, while maintaining the core style.`;
  
  try {
    const response = await ai.models.generateImages({
      model: IMAGE_GENERATION_MODEL,
      prompt,
      config: {
        numberOfImages: 3,
        outputMimeType: 'image/jpeg',
        aspectRatio: '4:3',
      },
    });
    
    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages.map(image => ({
          base64: image.image.imageBytes,
          mimeType: 'image/jpeg'
      }));
    }
    throw new Error("Image generation returned no images.");
  } catch(error) {
    console.error(`Error generating images for ${dish.name}:`, error);
    throw new Error(`Failed to generate images for ${dish.name}.`);
  }
};


export const editImage = async (base64Image: string, mimeType: string, prompt: string): Promise<{ base64: string; mimeType: string }> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: IMAGE_EDITING_MODEL,
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return { base64: part.inlineData.data, mimeType: part.inlineData.mimeType };
            }
        }
        throw new Error("Image editing returned no image data.");

    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("Failed to apply edits to the image.");
    }
};