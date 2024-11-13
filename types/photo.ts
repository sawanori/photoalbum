export interface Photo {
  id: string;
  url: string;
  title: string;
  description?: string;
  downloadCount: number;
  likes: number;
  uploadedAt?: string;
  aspectRatio: 'portrait' | 'landscape';
}