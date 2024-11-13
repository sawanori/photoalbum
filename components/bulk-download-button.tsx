"use client";

import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { usePhotoStore } from '@/hooks/use-photos';
import { api } from '@/lib/api';

export function BulkDownloadButton() {
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

  return (
    <Button
      onClick={handleBulkDownload}
      disabled={isDownloading || likedPhotos.size === 0}
      className="w-full sm:w-auto"
    >
      <Download className="mr-2 h-4 w-4" />
      {isDownloading ? "Downloading..." : `Download ${likedPhotos.size} liked photos`}
    </Button>
  );
}