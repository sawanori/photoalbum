"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Photo } from '@/hooks/use-photos';

interface AdminPhotoCardProps {
  photo: Photo;
  onPhotoClick?: (photo: Photo) => void;
}

export function AdminPhotoCard({ photo, onPhotoClick }: AdminPhotoCardProps) {
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
          <div className="flex items-center gap-1 text-muted-foreground">
            <Download className="h-4 w-4" />
            <span>{photo.downloadCount}</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}