"use client";

import type { Photo } from "@/types/photo";

type Props = {
  photo: Photo;
  onRemove: (id: string) => void;
};

const formatDateTime = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}`;
};

const buildMapsUrl = (lat: number, lng: number): string =>
  `https://www.google.com/maps?q=${lat},${lng}`;

export const PhotoCard = ({ photo, onRemove }: Props) => {
  const { status, exif, isHeic, previewUrl, fileName, error } = photo;
  const hasGps =
    status === "ready" &&
    exif != null &&
    exif.latitude != null &&
    exif.longitude != null;

  return (
    <article className="relative flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={() => onRemove(photo.id)}
        aria-label="削除"
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
      >
        ×
      </button>

      <div className="relative aspect-square w-full bg-zinc-100">
        {isHeic ? (
          <div className="flex h-full w-full flex-col items-center justify-center px-3 text-center text-xs text-zinc-500">
            <span className="mb-1 text-2xl" aria-hidden>
              🖼️
            </span>
            HEIC プレビュー非対応
            <span className="text-[10px] text-zinc-400">
              (Safari 以外では表示不可)
            </span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={fileName}
            className="h-full w-full object-cover"
          />
        )}

        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4 text-sm">
        <p
          className="truncate font-medium text-zinc-900"
          title={fileName}
        >
          {fileName}
        </p>

        {status === "error" && (
          <p className="text-red-600">
            EXIF 読み取り失敗{error ? `: ${error}` : ""}
          </p>
        )}

        {status === "loading" && (
          <p className="text-zinc-500">EXIF 解析中...</p>
        )}

        {status === "ready" && exif != null && (
          <>
            {hasGps ? (
              <>
                <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 font-mono text-xs text-zinc-700">
                  <dt className="text-zinc-500">緯度</dt>
                  <dd>{exif.latitude!.toFixed(6)}</dd>
                  <dt className="text-zinc-500">経度</dt>
                  <dd>{exif.longitude!.toFixed(6)}</dd>
                </dl>
                <a
                  href={buildMapsUrl(exif.latitude!, exif.longitude!)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Google Maps で開く
                  <span aria-hidden>↗</span>
                </a>
              </>
            ) : (
              <p className="font-medium text-red-600">位置情報なし</p>
            )}

            {exif.takenAt && (
              <p className="text-xs text-zinc-500">
                撮影日時: {formatDateTime(exif.takenAt)}
              </p>
            )}
          </>
        )}
      </div>
    </article>
  );
};
