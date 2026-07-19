# にゃいんスイーパー 🐾

猫テーマのマインスイーパー。Goの学習を兼ねた作品。

## 技術スタック

- フロント：Next.js / TypeScript / Tailwind CSS
- バック：Go / Gin
- 状態管理：サーバーのメモリ上（DBなし）

## 機能

- レベル1〜10（5×5〜14×14）
- さがすモード（🐾マーク）
- タイムアタック
- 負け時に地雷（猫）を全公開

## ローカル起動

### バックエンド

cd server
go run main.go

### フロントエンド

cd client
npm run dev
