"use client";

import { Suspense } from 'react';
import { PhotoGrid } from '@/components/photo-grid';
import { usePhotoStore } from '@/hooks/use-photos';
import { FloatingDownloadButton } from '@/components/floating-download-button';
import { PhotoGridSkeleton } from '@/components/photo-grid-skeleton';

export default function Home() {
  const { photos, isLoading } = usePhotoStore();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Photo Gallery</h1>
        <Suspense fallback={<PhotoGridSkeleton />}>
          {isLoading ? (
            <PhotoGridSkeleton />
          ) : (
            <PhotoGrid photos={photos} />
          )}
        </Suspense>
      </main>
      <FloatingDownloadButton />
    </div>
  );
}