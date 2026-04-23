"use client";

import type { Photo } from "@/types/photo";
import { PhotoCard } from "./PhotoCard";

type Props = {
  photos: Photo[];
  onRemove: (id: string) => void;
};

export const PhotoGrid = ({ photos, onRemove }: Props) => {
  if (photos.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} onRemove={onRemove} />
      ))}
    </div>
  );
};
