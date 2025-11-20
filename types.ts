export interface ImageItem {
  id: string;
  url: string;
  isUploaded?: boolean; // If true, url is base64 data uri
  description?: string;
}

export interface GenerationHistoryItem {
  id: string;
  timestamp: number;
  personImage: string;
  clothesImage: string;
  resultImage: string;
}

export enum AppStep {
  SELECT_PERSON = 1,
  SELECT_CLOTHES = 2,
  GENERATE_RESULT = 3,
}
