# カート機能 - フロントエンド

React + TypeScript + Vite で構築したECサイトのフロントエンドです。

## デモ

https://cart-front.onrender.com

## 技術スタック

- React 19
- TypeScript
- Vite
- react-router-dom
- Render（デプロイ）

## 機能

- ログイン・新規登録
- 商品一覧・詳細表示
- カートへの商品追加・削除
- 注文・Stripe決済
- 注文完了画面

## 画面構成

| パス | 画面 | 認証 |
|---|---|---|
| / | 商品一覧 | 不要 |
| /products/:id | 商品詳細 | 不要 |
| /login | ログイン | 不要 |
| /register | 新規登録 | 不要 |
| /cart | カート・注文・決済 | 必要 |
| /orders/complete | 注文完了 | 必要 |

## ローカル起動

```bash
# パッケージインストール
npm install

# 環境変数設定
cp .env.example .env

# 起動
npm run dev
```

## 環境変数

| 変数名 | 説明 |
|---|---|
| VITE_API_BASE_URL | バックエンドのURL |
