"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Photo, usePhotoStore } from '@/hooks/use-photos';

interface PhotoCardProps {
  photo: Photo;
  onPhotoClick?: (photo: Photo) => void;
}

export function PhotoCard({ photo, onPhotoClick }: PhotoCardProps) {
  const { toggleLike, isLiked, isLikeProcessing } = usePhotoStore();
  const [mounted, setMounted] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLiked(isLiked(photo.id));
  }, [photo.id, isLiked]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleLike(photo.id);
      setLiked(!liked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (!mounted) return null;

  const isProcessing = isLikeProcessing.has(photo.id);

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden bg-card hover:shadow-lg transition-shadow">
        <CardContent className="p-0 cursor-pointer relative group" onClick={() => onPhotoClick?.(photo)}>
          <div className={`relative ${photo.aspectRatio === 'landscape' ? 'aspect-video' : 'aspect-[3/4]'}`}>
            <Image
              src={photo.url}
              alt={photo.title}
              fill
              className="object-cover transition-transform group-hover:scale-105 duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </CardContent>
        <CardFooter className="p-4 flex justify-between items-center">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-1">{photo.title}</h3>
            {photo.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">{photo.description}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLikeClick}
            disabled={isProcessing}
            className={liked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-600'}
          >
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Heart className={`h-5 w-5 transition-all duration-300 ${liked ? 'fill-current scale-110' : 'scale-100'}`} />
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}