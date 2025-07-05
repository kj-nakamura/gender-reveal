# Gender Reveal App

ジェンダーリビール用のWebアプリケーションです。

## 技術構成

- **フロントエンド・バックエンド**: Next.js 15
- **データベース・認証**: Supabase
- **スタイリング**: Tailwind CSS
- **ホスティング**: Vercel

## 環境設定

### 1. 環境変数の設定

`.env.local`ファイルを作成して以下の環境変数を設定してください：

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# サイトURL設定
NEXT_PUBLIC_SITE_URL=http://localhost:3001  # ローカル開発用
SUPABASE_SITE_URL=http://localhost:3001     # Supabaseローカル用

# 本番環境用（例）
# NEXT_PUBLIC_SITE_URL=https://your-domain.com
# SUPABASE_SITE_URL=https://your-domain.com
```

### 2. Supabaseプロジェクトの設定

#### ローカル開発環境

```bash
# Supabaseローカル環境の起動
supabase start

# データベースマイグレーション
supabase db reset
```

#### 本番環境

Supabaseの本番プロジェクトで以下の設定を行ってください：

1. **Site URL設定**: 
   - Authentication > Settings > Site URL に本番ドメインを設定
   - 例: `https://your-domain.com`

2. **リダイレクトURL設定**:
   - Authentication > Settings > Redirect URLs に以下を追加：
   - `https://your-domain.com/verify-otp`

3. **メールテンプレート設定**:
   - Authentication > Templates > Magic Link
   - カスタムテンプレートをアップロード（`supabase/templates/magic_link.html`）

### 3. 開発サーバーの起動

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3001` を開きます。

## デプロイ

### Vercelへのデプロイ

1. GitHubリポジトリをVercelに接続
2. 環境変数を設定：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
   - `NEXT_PUBLIC_SITE_URL` （本番ドメイン）
   - `SUPABASE_SITE_URL` （本番ドメイン）
3. デプロイ実行

### 本番環境での認証設定

デプロイ後、Supabaseの本番プロジェクトで：

1. Site URLをデプロイ先のドメインに更新
2. Redirect URLsにデプロイ先のドメインを追加
3. メールテンプレートが正しく適用されているか確認

## 機能

- **認証**: メールOTP認証
- **リビール作成**: テンプレート選択 + 性別選択
- **共有**: 一意のURL生成
- **ユーザー管理**: アカウント削除、ログアウト
- **制限**: 1アカウント1リビール

## 注意事項

- 本番環境では必ず実際のドメインを`NEXT_PUBLIC_SITE_URL`に設定してください
- Supabaseの本番プロジェクトでも同様の設定を行う必要があります
- メール認証が正しく動作するためには、リダイレクトURLが正確に設定されている必要があります