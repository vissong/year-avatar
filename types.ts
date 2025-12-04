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
  RETRO_SYNTHWAVE = 'Retro Synthwave'
}

export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
  resultImage: string | null;
}
