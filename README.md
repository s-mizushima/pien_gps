# 不倫チェック

写真の EXIF から GPS 位置情報と撮影日時を抽出し、「本当にその場所にいたのか」「いつ撮られた写真なのか」を確認できる Web ツール。
画像はすべてブラウザ内だけで処理され、サーバーには送信されません。

## 技術スタック

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS v4**
- **Node.js 20** (Alpine)
- **pnpm**
- **Docker / Docker Compose** (ローカル開発用)

## ディレクトリ構成

```
furin-check/
├── docker-compose.yml       # 開発用サービス定義
├── Dockerfile.dev           # 開発用イメージ (Node 20 + pnpm)
├── .dockerignore
├── .env.local.example       # 環境変数テンプレート
├── .env.local               # 実環境変数 (gitignore 対象)
├── .gitignore
├── README.md
└── app/                     # Next.js プロジェクト
    ├── src/
    │   ├── app/             # App Router エントリ
    │   ├── components/      # 再利用 UI コンポーネント
    │   ├── lib/             # ユーティリティ・ロジック
    │   └── types/           # 型定義
    ├── public/
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    └── postcss.config.mjs
```

## ローカル起動 (Docker)

### 1. 環境変数の準備

```bash
cp .env.local.example .env.local
```

### 2. Docker でビルド & 起動

```bash
docker compose up --build
```

2 回目以降:

```bash
docker compose up
```

### 3. ブラウザでアクセス

[http://localhost:3000](http://localhost:3000)

## Vercel へデプロイ

Next.js を無料でデプロイするなら Vercel が最適です。

1. [https://vercel.com/new](https://vercel.com/new) を開き GitHub と連携
2. `s-mizushima/pien_gps` を Import
3. **Root Directory** を `app` に設定
4. Framework: `Next.js` (自動検出されるはず)
5. Build Command / Output Directory はデフォルトのまま
6. Deploy をクリック

`master` ブランチに push すると自動で本番デプロイされます。

## 開発メモ

### ホットリロード

- `./app` をコンテナの `/app` にボリュームマウントしているため、ソース変更は即反映されます。
- macOS + Docker Desktop のファイル変更検知が不安定な場合に備え、`WATCHPACK_POLLING=true` と `CHOKIDAR_USEPOLLING=true` を有効化済みです。

### 依存関係の追加

```bash
docker compose exec app pnpm add <package-name>
docker compose exec app pnpm add -D <package-name>
```

### コンテナ内でシェルを開く

```bash
docker compose exec app sh
```

### 停止 / 後片付け

```bash
docker compose down              # コンテナ停止
docker compose down -v           # ボリュームも含めて削除
```

## ポート

| サービス | ポート | 用途 |
|----------|--------|------|
| app      | 3000   | Next.js 開発サーバー |
