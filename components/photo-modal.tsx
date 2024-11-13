"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Facebook, Twitter, Heart, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePhotoStore } from "@/hooks/use-photos";
import type { Photo } from "@/hooks/use-photos";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { LineIcon } from "@/components/icons/line-icon";

interface PhotoModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function PhotoModal({
  photo,
  isOpen,
  onClose,
  onPrevious,
  onNext,
}: PhotoModalProps) {
  const { toggleLike, isLiked, downloadPhoto, isDownloading, isLikeProcessing } = usePhotoStore();

  if (!photo) return null;

  const liked = isLiked(photo.id);
  const isProcessingLike = isLikeProcessing.has(photo.id);
  const isProcessingDownload = isDownloading.has(photo.id);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleLike(photo.id);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await downloadPhoto(photo.id);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this photo: ${photo.title}`;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}`
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`
        );
        break;
      case "line":
        window.open(
          `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`
        );
        break;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background/95 backdrop-blur-sm">
        <VisuallyHidden>
          <DialogTitle>Photo Details: {photo.title}</DialogTitle>
        </VisuallyHidden>
        <div className="relative flex items-center justify-center w-full">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 z-10 bg-background/50 hover:bg-background/70"
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div className="relative w-full">
            <div className="relative aspect-[4/3]">
              <Image
                src={photo.url}
                alt={photo.title || "Photo"}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                priority
              />
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 z-10 bg-background/50 hover:bg-background/70"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className={cn(
                "bg-background/50 hover:bg-background/70",
                liked && "text-red-500"
              )}
              onClick={handleLike}
              disabled={isProcessingLike}
            >
              {isProcessingLike ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Heart className={cn("h-5 w-5", liked && "fill-current")} />
              )}
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-background/50 hover:bg-background/70"
              onClick={handleDownload}
              disabled={isProcessingDownload}
            >
              {isProcessingDownload ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Download className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-background/50 hover:bg-background/70"
              onClick={() => handleShare("twitter")}
            >
              <Twitter className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-background/50 hover:bg-background/70"
              onClick={() => handleShare("facebook")}
            >
              <Facebook className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-background/50 hover:bg-background/70"
              onClick={() => handleShare("line")}
            >
              <LineIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}