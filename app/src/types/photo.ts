export type ExifData = {
  latitude: number | null;
  longitude: number | null;
  takenAt: Date | null;
};

export type PhotoStatus = "loading" | "ready" | "error";

export type Photo = {
  id: string;
  file: File;
  previewUrl: string;
  fileName: string;
  status: PhotoStatus;
  error?: string;
  exif?: ExifData;
  isHeic: boolean;
};
