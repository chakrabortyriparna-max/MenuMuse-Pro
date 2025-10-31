
export enum ImageStyle {
  RUSTIC_DARK = 'Rustic/Dark',
  BRIGHT_MODERN = 'Bright/Modern',
  SOCIAL_MEDIA = 'Social Media',
}

export interface Dish {
  name: string;
  description: string;
}

export type GenerationStatus = 'pending' | 'loading' | 'success' | 'error';

export interface GeneratedImage {
  id: string;
  dishName: string;
  dishDescription: string;
  imageUrl: string;
  status: GenerationStatus;
  mimeType: string;
}
