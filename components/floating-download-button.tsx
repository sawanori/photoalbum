"use client";

import { useState } from 'react';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePhotoStore } from '@/hooks/use-photos';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

export function FloatingDownloadButton() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { photos, likedPhotos } = usePhotoStore();
  const { toast } = useToast();

  const handleBulkDownload = async () => {
    if (likedPhotos.size === 0) {
      toast({
        title: "No photos selected",
        description: "Please like some photos before downloading.",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);
    try {
      const likedPhotosList = photos.filter(photo => likedPhotos.has(photo.id));
      await api.bulkDownload(likedPhotosList);

      toast({
        title: "Success",
        description: `Downloaded ${likedPhotosList.length} photos successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download photos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (likedPhotos.size === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        size="lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
          "bg-[#011B6A] hover:bg-[#011B6A]/90",
          isDownloading ? "opacity-70" : "hover:scale-105",
          "relative"
        )}
        onClick={handleBulkDownload}
        disabled={isDownloading}
      >
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
          {likedPhotos.size}
        </span>
        <FileDown className="h-8 w-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </Button>
    </div>
  );
}