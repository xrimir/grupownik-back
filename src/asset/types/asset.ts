export interface ImageTransformOptions {
  width?: number;
  height?: number;
  format?: 'jpg' | 'png' | 'webp';
}

export interface SavedAssetData {
  path: string;
  filename: string;
  mimeType: string;
  size: number;
  metadata: Record<string, any>;
}
