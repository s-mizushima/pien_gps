# photo-gps-app

Next.js (App Router) + TypeScript + Tailwind CSS v4 を Docker 上で動かす開発環境テンプレート。

## 技術スタック

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS v4**
- **Node.js 20** (Alpine)
- **pnpm** (パッケージマネージャ)
- **Docker / Docker Compose**

## ディレクトリ構成

```
photo-gps-app/
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

## 起動方法

### 1. 環境変数の準備

```bash
cp .env.local.example .env.local
# 必要に応じて .env.local を編集
```

### 2. Docker でビルド & 起動

```bash
docker compose up --build
```

初回はイメージのビルドと依存関係のインストールに数分かかります。
2 回目以降は以下で OK です。

```bash
docker compose up
```

### 3. ブラウザでアクセス

[http://localhost:3000](http://localhost:3000) を開きます。

## 開発メモ

### ホットリロード

- `./app` をコンテナの `/app` にボリュームマウントしているため、ソース変更は即反映されます。
- macOS + Docker Desktop のファイル変更検知が不安定な場合に備え、`WATCHPACK_POLLING=true` と `CHOKIDAR_USEPOLLING=true` を有効化済みです。

### node_modules / .next の扱い

- ホスト側と分離するため **名前付きボリューム** を使用しています (`node_modules`, `next_cache`)。
- ホスト側には `app/node_modules` を作らない運用です。

### 依存関係の追加

コンテナ内で `pnpm add` を実行してください。

```bash
docker compose exec app pnpm add <package-name>
docker compose exec app pnpm add -D <package-name>   # devDependencies
```

`package.json` / `pnpm-lock.yaml` はマウント経由でホストにも反映されます。

### コンテナ内でシェルを開く

```bash
docker compose exec app sh
```

### 停止 / 後片付け

```bash
docker compose down              # コンテナ停止
docker compose down -v           # ボリュームも含めて削除 (依存関係を作り直したいとき)
```

### ホストで lint などを動かしたい場合

ホスト側に pnpm / node が入っていれば `cd app && pnpm install` で別途セットアップ可能ですが、
基本はコンテナ内での実行を推奨します。

## ポート

| サービス | ポート | 用途 |
|----------|--------|------|
| app      | 3000   | Next.js 開発サーバー |
