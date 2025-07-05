// utils/get-base-url.ts

/**
 * 環境に応じたベースURLを取得する関数
 * 優先順位:
 * 1. NEXT_PUBLIC_SITE_URL (明示的に設定された環境変数)
 * 2. VERCEL_URL (Vercelデプロイ時の自動設定)
 * 3. デフォルト値 (ローカル開発用)
 */
export function getBaseUrl(): string {
  // 明示的に設定された環境変数
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // Vercelデプロイ時の自動設定
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // ローカル開発用デフォルト
  return 'http://localhost:3001';
}

/**
 * クライアントサイド用のベースURL取得関数
 */
export function getClientBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return getBaseUrl();
}