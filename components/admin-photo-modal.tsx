"use client";

import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, ChevronRight, Trash2, Loader2 } from "lucide-react";
import { Photo, usePhotoStore } from "@/hooks/use-photos";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useToast } from "@/components/ui/use-toast";

interface AdminPhotoModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function AdminPhotoModal({
  photo,
  isOpen,
  onClose,
  onPrevious,
  onNext,
}: AdminPhotoModalProps) {
  const { removePhoto, isDeleting } = usePhotoStore();
  const { toast } = useToast();

  if (!photo) return null;

  const isProcessingDelete = isDeleting.has(photo.id);

  const handleDelete = async () => {
    try {
      await removePhoto(photo.id);
      toast({
        title: "Success",
        description: "Photo has been deleted successfully.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background">
        <VisuallyHidden>
          <DialogTitle>Photo Details: {photo.title}</DialogTitle>
        </VisuallyHidden>
        <div className="grid md:grid-cols-[2fr,1fr] gap-0">
          <div className="relative group">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={photo.url}
                alt={photo.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onPrevious();
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{photo.title}</h2>
            <p className="text-muted-foreground mb-4">{photo.description}</p>
            <div className="flex gap-2 mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
              >
                <Download className="h-5 w-5" />
                {photo.downloadCount} downloads
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="gap-2"
                onClick={handleDelete}
                disabled={isProcessingDelete}
              >
                {isProcessingDelete ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
                Delete
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Uploaded: {photo.uploadedAt}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}