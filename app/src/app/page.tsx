"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PhotoUploader } from "@/components/PhotoUploader";
import { PhotoGrid } from "@/components/PhotoGrid";
import { extractExif, isHeicFile } from "@/lib/exif";
import type { Photo } from "@/types/photo";

export default function HomePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  // アンマウント時にすべての ObjectURL を解放するため、最新の配列を ref で保持
  const photosRef = useRef<Photo[]>([]);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      for (const p of photosRef.current) {
        URL.revokeObjectURL(p.previewUrl);
      }
    };
  }, []);

  const handleFilesSelected = useCallback((files: File[]) => {
    const newPhotos: Photo[] = files.map((file) => ({
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      fileName: file.name,
      status: "loading",
      isHeic: isHeicFile(file),
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);

    for (const photo of newPhotos) {
      extractExif(photo.file)
        .then((exif) => {
          setPhotos((prev) =>
            prev.map((p) =>
              p.id === photo.id ? { ...p, status: "ready", exif } : p,
            ),
          );
        })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : "unknown error";
          setPhotos((prev) =>
            prev.map((p) =>
              p.id === photo.id ? { ...p, status: "error", error: message } : p,
            ),
          );
        });
    }
  }, []);

  const handleRemove = useCallback((id: string) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 md:px-8 md:py-14">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Photo GPS Viewer
        </h1>
        <p className="text-sm text-zinc-600 md:text-base">
          写真をアップロードすると、EXIF から GPS の緯度経度と撮影日時を抽出して表示します。
          画像はブラウザ内だけで処理され、サーバーには送信されません。
        </p>
      </header>

      <PhotoUploader onFilesSelected={handleFilesSelected} />

      {photos.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-medium">
              アップロード済み{" "}
              <span className="text-zinc-500">({photos.length})</span>
            </h2>
          </div>
          <PhotoGrid photos={photos} onRemove={handleRemove} />
        </section>
      )}
    </main>
  );
}
