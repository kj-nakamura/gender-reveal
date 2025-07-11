// app/reset-password/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ResetPasswordForm from "./_components/ResetPasswordForm";
import Link from "next/link";

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  
  // ユーザーがパスワードリセットのセッションを持っているかチェック
  const { data: { user } } = await supabase.auth.getUser();
  
  // ユーザーが存在しない場合はログインページにリダイレクト
  if (!user) {
    redirect('/login?message=reset_session_expired');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            新しいパスワードを設定
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            新しいパスワードを入力してください
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <ResetPasswordForm />
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