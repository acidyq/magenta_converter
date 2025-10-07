export interface ConversionJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  type: 'video' | 'audio' | 'image' | 'document';
  inputFile: string;
  outputFile?: string;
  targetFormat: string;
  progress: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversionRequest {
  type: 'video' | 'audio' | 'image' | 'document';
  targetFormat: string;
  options?: ConversionOptions;
}

export interface ConversionOptions {
  quality?: number;
  width?: number;
  height?: number;
  bitrate?: string;
  fps?: number;
  codec?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FileUploadResponse {
  jobId: string;
  filename: string;
  size: number;
  type: string;
}

export const SUPPORTED_FORMATS = {
  video: ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv'],
  audio: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'],
  image: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff', 'bmp', 'gif'],
  document: ['pdf', 'docx', 'xlsx', 'pptx', 'txt', 'rtf']
} as const;

export type VideoFormat = typeof SUPPORTED_FORMATS.video[number];
export type AudioFormat = typeof SUPPORTED_FORMATS.audio[number];
export type ImageFormat = typeof SUPPORTED_FORMATS.image[number];
export type DocumentFormat = typeof SUPPORTED_FORMATS.document[number];
export type SupportedFormat = VideoFormat | AudioFormat | ImageFormat | DocumentFormat;
