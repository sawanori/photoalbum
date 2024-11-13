import { Photo } from '@/types/photo';
import JSZip from 'jszip';

// モックの非同期遅延を追加
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ローカルストレージのキー
const STORAGE_KEY = 'photo-gallery-photos';

// 初期モックデータ
const initialMockPhotos: Photo[] = [
  {
    id: 'photo-1',
    url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
    title: 'Mountain Landscape',
    description: 'Beautiful mountain landscape at sunset',
    downloadCount: 156,
    likes: 423,
    uploadedAt: '2024-03-20',
    aspectRatio: 'landscape'
  },
  {
    id: 'photo-2',
    url: 'https://images.unsplash.com/photo-1682687221038-404670f01d03',
    title: 'Ocean Waves',
    description: 'Dramatic ocean waves during storm',
    downloadCount: 89,
    likes: 267,
    uploadedAt: '2024-03-19',
    aspectRatio: 'portrait'
  }
];

// ローカルストレージから写真を取得
const getStoredPhotos = (): Photo[] => {
  if (typeof window === 'undefined') return initialMockPhotos;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockPhotos));
    return initialMockPhotos;
  }
  
  return JSON.parse(stored);
};

// ローカルストレージに写真を保存
const savePhotos = (photos: Photo[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
};

export const api = {
  // 写真の取得
  fetchPhotos: async (): Promise<Photo[]> => {
    await delay(1000);
    return getStoredPhotos();
  },

  // 写真の追加
  addPhoto: async (photo: Photo): Promise<Photo> => {
    await delay(1000);
    const photos = getStoredPhotos();
    const updatedPhotos = [photo, ...photos];
    savePhotos(updatedPhotos);
    return photo;
  },

  // 写真の削除
  removePhoto: async (photoId: string): Promise<void> => {
    await delay(1000);
    const photos = getStoredPhotos();
    const updatedPhotos = photos.filter(p => p.id !== photoId);
    savePhotos(updatedPhotos);
  },

  // いいね状態の切り替え
  toggleLike: async (photoId: string): Promise<void> => {
    await delay(500);
    const photos = getStoredPhotos();
    const updatedPhotos = photos.map(photo => 
      photo.id === photoId 
        ? { ...photo, likes: photo.likes + 1 }
        : photo
    );
    savePhotos(updatedPhotos);
  },

  // 写真のダウンロード
  downloadPhoto: async (photo: Photo): Promise<void> => {
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${photo.title}.jpg`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      // ダウンロード数を更新
      const photos = getStoredPhotos();
      const updatedPhotos = photos.map(p => 
        p.id === photo.id 
          ? { ...p, downloadCount: p.downloadCount + 1 }
          : p
      );
      savePhotos(updatedPhotos);
    } catch (error) {
      console.error('Error downloading photo:', error);
      throw error;
    }
  },

  // 複数写真のダウンロード
  bulkDownload: async (photos: Photo[]): Promise<void> => {
    const zip = new JSZip();

    try {
      const downloadPromises = photos.map(async (photo) => {
        const response = await fetch(photo.url);
        const blob = await response.blob();
        const fileName = `${photo.title}.jpg`;
        zip.file(fileName, blob);

        // ダウンロード数を更新
        const allPhotos = getStoredPhotos();
        const updatedPhotos = allPhotos.map(p => 
          p.id === photo.id 
            ? { ...p, downloadCount: p.downloadCount + 1 }
            : p
        );
        savePhotos(updatedPhotos);
      });

      await Promise.all(downloadPromises);

      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = "photos.zip";
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error creating zip file:', error);
      throw error;
    }
  }
};