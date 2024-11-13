"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Photo } from '@/types/photo';
import { api } from '@/lib/api';

interface PhotoStore {
  photos: Photo[];
  likedPhotos: Set<string>;
  isLoading: boolean;
  isLikeProcessing: Set<string>;
  isDownloading: Set<string>;
  isDeleting: Set<string>;
  setPhotos: (photos: Photo[]) => void;
  addPhoto: (photo: Photo) => Promise<void>;
  removePhoto: (photoId: string) => Promise<void>;
  toggleLike: (photoId: string) => Promise<void>;
  isLiked: (photoId: string) => boolean;
  downloadPhoto: (photoId: string) => Promise<void>;
  fetchPhotos: () => Promise<void>;
}

export const usePhotoStore = create<PhotoStore>()(
  persist(
    (set, get) => ({
      photos: [],
      likedPhotos: new Set<string>(),
      isLoading: false,
      isLikeProcessing: new Set<string>(),
      isDownloading: new Set<string>(),
      isDeleting: new Set<string>(),

      setPhotos: (photos) => set({ photos }),

      fetchPhotos: async () => {
        set({ isLoading: true });
        try {
          const photos = await api.fetchPhotos();
          set({ photos });
        } catch (error) {
          console.error('Error fetching photos:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      addPhoto: async (photo) => {
        try {
          await api.addPhoto(photo);
          set((state) => ({
            photos: [photo, ...state.photos]
          }));
        } catch (error) {
          console.error('Error adding photo:', error);
          throw error;
        }
      },

      removePhoto: async (photoId) => {
        set((state) => ({
          isDeleting: new Set(state.isDeleting).add(photoId)
        }));
        try {
          await api.removePhoto(photoId);
          set((state) => ({
            photos: state.photos.filter((photo) => photo.id !== photoId),
            likedPhotos: new Set([...state.likedPhotos].filter(id => id !== photoId))
          }));
        } catch (error) {
          console.error('Error removing photo:', error);
          throw error;
        } finally {
          set((state) => {
            const newIsDeleting = new Set(state.isDeleting);
            newIsDeleting.delete(photoId);
            return { isDeleting: newIsDeleting };
          });
        }
      },

      toggleLike: async (photoId) => {
        set((state) => ({
          isLikeProcessing: new Set(state.isLikeProcessing).add(photoId)
        }));
        try {
          await api.toggleLike(photoId);
          set((state) => {
            const newLikedPhotos = new Set(state.likedPhotos);
            if (newLikedPhotos.has(photoId)) {
              newLikedPhotos.delete(photoId);
            } else {
              newLikedPhotos.add(photoId);
            }
            return { likedPhotos: newLikedPhotos };
          });
        } catch (error) {
          console.error('Error toggling like:', error);
          throw error;
        } finally {
          set((state) => {
            const newIsLikeProcessing = new Set(state.isLikeProcessing);
            newIsLikeProcessing.delete(photoId);
            return { isLikeProcessing: newIsLikeProcessing };
          });
        }
      },

      downloadPhoto: async (photoId) => {
        set((state) => ({
          isDownloading: new Set(state.isDownloading).add(photoId)
        }));
        try {
          const photo = get().photos.find(p => p.id === photoId);
          if (!photo) throw new Error('Photo not found');
          await api.downloadPhoto(photo);
        } catch (error) {
          console.error('Error downloading photo:', error);
          throw error;
        } finally {
          set((state) => {
            const newIsDownloading = new Set(state.isDownloading);
            newIsDownloading.delete(photoId);
            return { isDownloading: newIsDownloading };
          });
        }
      },

      isLiked: (photoId) => get().likedPhotos.has(photoId),
    }),
    {
      name: 'photo-storage',
      partialize: (state) => ({
        photos: state.photos,
        likedPhotos: Array.from(state.likedPhotos),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.photos.length === 0) {
            state.fetchPhotos();
          }
          state.likedPhotos = new Set(state.likedPhotos);
        }
      },
    }
  )
);