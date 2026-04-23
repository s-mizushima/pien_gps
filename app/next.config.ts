import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ngrok など別 origin から dev server にアクセスする場合の許可設定
  // 必要に応じてドメインを追加
  allowedDevOrigins: ["erss.ngrok.io", "*.ngrok.io", "*.ngrok-free.app"],
};

export default nextConfig;
