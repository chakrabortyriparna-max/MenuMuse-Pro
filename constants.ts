import { ImageStyle } from './types';

export const IMAGE_STYLES: { id: ImageStyle; name: string; description: string }[] = [
  { 
    id: ImageStyle.BRIGHT_MODERN, 
    name: 'Bright & Modern', 
    description: 'Soft daylight from the side, on a clean white or light grey marble surface. Minimalist, elegant plating on modern ceramic plates. Include minimal, sophisticated props like a single linen napkin or a sleek fork. Crisp focus, clean aesthetic.' 
  },
  { 
    id: ImageStyle.RUSTIC_DARK, 
    name: 'Rustic & Dark', 
    description: 'Moody, dramatic, Rembrandt-style lighting. Shot on a dark wood or slate background. Use rustic props like cast iron pans, wooden boards, or antique silverware. Deep shadows, warm tones, highlighting textures.' 
  },
  { 
    id: ImageStyle.SOCIAL_MEDIA, 
    name: 'Social Media', 
    description: 'A vibrant, top-down flat lay composition. Bright, even lighting. The dish is placed on a stylish surface with lifestyle props like a phone, sunglasses, or a magazine to create a story. Colorful, eye-catching, and ready for an Instagram post.' 
  },
];

export const MENU_PARSER_MODEL = 'gemini-2.5-flash';
export const IMAGE_GENERATION_MODEL = 'imagen-4.0-generate-001';
export const IMAGE_EDITING_MODEL = 'gemini-2.5-flash-image';