"use client";

import { usePhotoStore } from "@/hooks/use-photos";
import { PhotoGrid } from "@/components/photo-grid";
import { LikedPhotosEmpty } from "@/components/liked-photos-empty";
import { BulkDownloadButton } from "@/components/bulk-download-button";

export default function LikedPage() {
  const { photos, likedPhotos } = usePhotoStore();
  const likedPhotosList = photos.filter(photo => likedPhotos.has(photo.id));

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Liked Photos</h1>
          <BulkDownloadButton />
        </div>
        
        {likedPhotosList.length > 0 ? (
          <PhotoGrid photos={likedPhotosList} />
        ) : (
          <LikedPhotosEmpty />
        )}
      </div>
    </main>
  );
}