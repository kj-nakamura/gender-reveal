// app/verify-email/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ResendEmailButton from "./_components/ResendEmailButton";

export default async function VerifyEmailPage() {
  const supabase = await createClient();
  
  // ユーザー情報を取得
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }

  // 既に認証済みの場合はマイページにリダイレクト
  if (user.email_confirmed_at) {
    redirect('/mypage');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            メール認証が必要です
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            サービスをご利用いただくには、メール認証が必要です
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              認証メールを送信しました
            </h3>
            
            <p className="text-sm text-gray-600 mb-6">
              <span className="font-semibold">{user.email}</span> に認証リンクを送信しました。
              <br />
              メール内のリンクをクリックして認証を完了してください。
            </p>
            
            <div className="space-y-4">
              <ResendEmailButton />
              
              <div className="text-xs text-gray-500">
                <p>メールが届かない場合は、迷惑メールフォルダをご確認ください</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            ログインページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}