export interface UserStats {
  summary: string;
  artStyle: string;
}

export enum ArtStyle {
  CYBERPUNK = 'Cyberpunk / Neon',
  PIXEL_ART = 'Pixel Art',
  WATERCOLOR = 'Watercolor / Soft',
  CLAY_3D = '3D Clay Render',
  ANIME = 'Modern Anime',
  RETRO_SYNTHWAVE = 'Retro Synthwave',
  OIL_PAINTING = 'Classic Oil Painting',
  VECTOR_FLAT = 'Flat Vector Illustration'
}

export enum GenerationMode {
  AVATAR = 'Avatar (1:1)',
  SCENE = 'Story Scene (4:3)'
}

export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
  resultImage: string | null;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
