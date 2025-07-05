# 本番環境デバッグガイド

## 認証コード送信失敗の原因調査

### 1. 環境変数の確認

本番環境（Vercel）で以下の環境変数が正しく設定されているか確認：

```bash
# 本番環境の環境変数をチェック
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 2. Supabase本番プロジェクトの設定確認

#### Authentication Settings
- **Site URL**: `https://your-domain.com`
- **Additional Redirect URLs**: 
  - `https://your-domain.com/verify-otp`
  - `https://your-domain.com/auth/callback`

#### Email Settings
- **Enable email confirmations**: OFF (OTP認証を使用するため)
- **Enable email signup**: ON
- **Email rate limiting**: 適切に設定されているか

### 3. よくある問題

#### A. リダイレクトURL不一致
```
Error: Invalid redirect URL
```
- Supabaseの設定でリダイレクトURLが正確に登録されているか確認

#### B. 環境変数の設定ミス
```
Error: Invalid API key
```
- 本番用のSupabaseプロジェクトのAPIキーが正しく設定されているか

#### C. メール送信制限
```
Error: Too many requests
```
- Supabaseのメール送信制限（時間あたり）に達している可能性

#### D. ドメイン設定の問題
```
Error: Hostname/subdomain not allowed
```
- Site URLとRedirect URLsの設定が一致していない

### 4. デバッグ手順

1. **VercelのFunction Logs確認**
   ```bash
   vercel logs --function api
   ```

2. **Supabase Dashboard確認**
   - Authentication > Users でユーザー作成が試行されているか
   - Authentication > Logs でエラーログ確認

3. **ブラウザのNetwork Tab確認**
   - OTP送信APIリクエストの詳細
   - レスポンスの詳細なエラーメッセージ

### 5. 修正後の確認項目

- [ ] 環境変数が正しく設定されている
- [ ] Supabase本番プロジェクトの設定が完了している
- [ ] メール送信が正常に動作する
- [ ] リダイレクトURLが正しく動作する
- [ ] OTP認証フローが完全に動作する

### 6. 緊急対応

もし上記で解決しない場合：
1. 一時的にパスワード認証を併用する
2. Supabaseサポートに問い合わせる
3. メール送信プロバイダーの変更を検討する