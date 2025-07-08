# 開発環境セットアップ

## 開発サーバー起動方法

### 通常の開発モード
```bash
npm run dev
```

### 高速開発モード（型チェック無効）
```bash
npm run dev:fast
```

### クリーン開発モード（キャッシュクリア）
```bash
npm run dev:clean
```

## ビルドコマンド

### プロダクションビルド（型チェック有効）
```bash
npm run build
```

### 開発用ビルド（型チェック緩和）
```bash
npm run build:dev
```

## その他のコマンド

### キャッシュクリア
```bash
npm run clean
```

### 型チェックのみ
```bash
npm run type-check
```

### テスト実行
```bash
npm test
```

## 開発時の注意事項

- `npm run dev:fast` は型チェックを無効化し、開発時のパフォーマンスを向上させます
- プロダクションビルド時は厳密な型チェックが実行されます
- React Flowなどの大きなライブラリが含まれる場合、初回ビルドに時間がかかる場合があります

## トラブルシューティング

### ポート使用中エラー
```bash
lsof -ti:3001 | xargs kill -9
```

### 型エラーで開発が止まる場合
```bash
npm run dev:fast
```

### ビルドキャッシュの問題
```bash
npm run clean
npm run dev:clean
```