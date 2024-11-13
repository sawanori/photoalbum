"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Masonry from 'react-masonry-css';
import { Photo } from '@/hooks/use-photos';
import { AdminPhotoCard } from '@/components/admin-photo-card';
import { AdminPhotoModal } from '@/components/admin-photo-modal';

interface AdminPhotoGridProps {
  photos: Photo[];
}

const breakpointColumns = {
  default: 4,
  1536: 4,
  1280: 3,
  1024: 3,
  768: 2,
  640: 1,
};

export function AdminPhotoGrid({ photos }: AdminPhotoGridProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handlePrevious = () => {
    setSelectedPhotoIndex((current) => 
      current !== null ? (current - 1 + photos.length) % photos.length : null
    );
  };

  const handleNext = () => {
    setSelectedPhotoIndex((current) => 
      current !== null ? (current + 1) % photos.length : null
    );
  };

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4 bg-background"
      >
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="mb-4"
          >
            <AdminPhotoCard
              photo={photo}
              onPhotoClick={() => handlePhotoClick(index)}
            />
          </motion.div>
        ))}
      </Masonry>

      <AdminPhotoModal
        photo={selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null}
        isOpen={selectedPhotoIndex !== null}
        onClose={() => setSelectedPhotoIndex(null)}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </>
  );
}