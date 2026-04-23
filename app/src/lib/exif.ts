import exifr from "exifr";
import type { ExifData } from "@/types/photo";

// exifr が返しうる部分的な形 (必要キーのみ宣言)
type ExifrResult = {
  latitude?: number;
  longitude?: number;
  DateTimeOriginal?: Date | string;
  CreateDate?: Date | string;
};

const toDate = (value: Date | string | undefined): Date | null => {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toFiniteNumber = (value: unknown): number | null => {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
};

export const extractExif = async (file: File): Promise<ExifData> => {
  const parsed = (await exifr.parse(file, {
    gps: true,
    exif: true,
    pick: ["latitude", "longitude", "DateTimeOriginal", "CreateDate"],
  })) as ExifrResult | undefined;

  if (!parsed) {
    return { latitude: null, longitude: null, takenAt: null };
  }

  return {
    latitude: toFiniteNumber(parsed.latitude),
    longitude: toFiniteNumber(parsed.longitude),
    takenAt: toDate(parsed.DateTimeOriginal) ?? toDate(parsed.CreateDate),
  };
};

// HEIC は一部ブラウザで <img> 表示不可なので別扱いにする
export const isHeicFile = (file: File): boolean => {
  const mime = file.type.toLowerCase();
  if (mime === "image/heic" || mime === "image/heif") return true;
  const name = file.name.toLowerCase();
  return name.endsWith(".heic") || name.endsWith(".heif");
};
