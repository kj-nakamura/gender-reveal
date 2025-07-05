# パスワードリセット デバッグガイド

## パスワード更新失敗の原因調査

### 1. **よくある原因**

#### A. セッション/トークンの問題
- **リンクの有効期限切れ**: パスワードリセットリンクは通常1時間で無効
- **トークンの不一致**: URLパラメータが不完全

#### B. 認証状態の問題  
- **ユーザーが認証されていない**: リセットプロセス中の認証失効
- **セッション不一致**: 異なるブラウザ/デバイスでの実行

#### C. Supabase設定の問題
- **Redirect URL未登録**: reset-passwordページのURLが許可リストにない
- **メール送信制限**: 本番環境での制限に達している

### 2. **デバッグ手順**

#### ステップ1: ブラウザコンソール確認
```javascript
// パスワードリセット送信時
console.log("Password reset email sent")

// パスワード更新時  
console.log("Attempting to update password for user:", user.id)
console.log("Password updated successfully")
```

#### ステップ2: ネットワークタブ確認
- `/forgot-password` API呼び出しの結果
- `/reset-password` API呼び出しの結果
- Supabase API のエラーレスポンス

#### ステップ3: URL確認
パスワードリセットリンクの形式確認:
```
https://your-domain.com/reset-password?access_token=xxx&refresh_token=xxx&type=recovery
```

### 3. **Supabase Dashboard 確認項目**

#### Authentication > Settings
- **Site URL**: `https://your-domain.com`
- **Redirect URLs**: 
  - `https://your-domain.com/reset-password`
  - `https://your-domain.com/auth/callback`

#### Authentication > Templates  
- **Recovery (Password Reset)** テンプレートが有効
- カスタムテンプレートの構文エラーなし

#### Authentication > Rate Limits
- **Email sent per hour**: 制限に達していないか確認

### 4. **解決策の優先順位**

#### 即座に試すべきこと
1. **新しいリセットリンク要求**: 有効期限切れの場合
2. **シークレットモードでテスト**: ブラウザキャッシュの除外
3. **URLパラメータ確認**: access_token等が含まれているか

#### 根本的解決
1. **Supabase設定更新**: Redirect URLsの追加/修正
2. **カスタムSMTP設定**: メール送信制限の回避
3. **エラーハンドリング改善**: より詳細なエラー情報表示

### 5. **緊急回避策**

#### パスワード認証の代替手段
- 一時的にOTP認証のみを使用
- 管理者によるパスワードリセット
- アカウント再作成の案内

### 6. **本番環境特有の問題**

#### Vercel環境変数確認
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=https://your-actual-domain.com
```

#### Supabase本番プロジェクト確認
- プロジェクトの一時停止状態
- 請求書の支払い状況
- APIキーの有効性

## トラブルシューティング checklist

- [ ] パスワードリセットメールが送信される
- [ ] メール内のリンクが正しいドメインを指している  
- [ ] リンククリック後、reset-passwordページに遷移する
- [ ] URLにaccess_tokenが含まれている
- [ ] ブラウザコンソールにエラーが表示されない
- [ ] Supabase Dashboardでユーザー状態を確認
- [ ] 新しいパスワードでログインできる