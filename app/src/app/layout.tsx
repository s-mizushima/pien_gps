import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "不倫チェック | 写真から撮影場所と日時を確認",
  description:
    "写真の EXIF から GPS 位置情報と撮影日時を抽出して、本当にその場所にいたかを確認できるツール。画像はブラウザ内だけで処理され、サーバーには送信されません。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="flex min-h-full flex-col bg-zinc-50 text-zinc-900"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
