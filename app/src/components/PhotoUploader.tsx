"use client";

import { useCallback, useRef, useState } from "react";

type Props = {
  onFilesSelected: (files: File[]) => void;
};

const ACCEPTED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];
const ACCEPTED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"];

const isAcceptedFile = (file: File): boolean => {
  if (ACCEPTED_MIME.includes(file.type.toLowerCase())) return true;
  const name = file.name.toLowerCase();
  return ACCEPTED_EXT.some((ext) => name.endsWith(ext));
};

export const PhotoUploader = ({ onFilesSelected }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragDepthRef = useRef(0);

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list || list.length === 0) return;
      const files = Array.from(list).filter(isAcceptedFile);
      if (files.length > 0) onFilesSelected(files);
    },
    [onFilesSelected],
  );

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragDepthRef.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragDepthRef.current -= 1;
    if (dragDepthRef.current <= 0) {
      dragDepthRef.current = 0;
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragDepthRef.current = 0;
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={[
        "flex flex-col items-center justify-center gap-4",
        "w-full rounded-2xl border-2 border-dashed px-6 py-10 md:py-14",
        "transition-colors",
        isDragging
          ? "border-blue-500 bg-blue-50"
          : "border-zinc-300 bg-white",
      ].join(" ")}
    >
      <div className="text-4xl" aria-hidden>
        📸
      </div>

      <div className="text-center">
        <p className="text-base font-medium text-zinc-800">画像を選択</p>
        <p className="mt-1 text-sm text-zinc-500">
          JPEG / PNG / WebP / HEIC (複数選択可)
        </p>
        <p className="mt-1 hidden text-xs text-zinc-400 md:block">
          または画像をここにドラッグ&ドロップ
        </p>
      </div>

      <button
        type="button"
        onClick={openPicker}
        className={[
          "inline-flex min-h-11 w-full items-center justify-center rounded-lg",
          "bg-blue-600 px-6 text-sm font-medium text-white",
          "transition-colors hover:bg-blue-700 active:bg-blue-800",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          "sm:w-auto",
        ].join(" ")}
      >
        ファイルを選択
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_MIME.join(",")}
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
};
