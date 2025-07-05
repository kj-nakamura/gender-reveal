// app/verify-otp/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import VerifyOTPForm from "./_components/VerifyOTPForm";
import Link from "next/link";

function VerifyOTPContent({ searchParams }: { searchParams: { email?: string } }) {
  const email = searchParams.email;

  if (!email) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          認証コードを入力
        </h1>
        <p className="text-gray-600 text-center mb-6">
          <span className="font-semibold">{email}</span> に送信された6桁のコードを入力してください
        </p>

        <VerifyOTPForm email={email} />

        <div className="mt-6 text-center">
          <Link 
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-500 underline"
          >
            別のメールアドレスでログイン
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function VerifyOTPPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ email?: string }> 
}) {
  const supabase = await createClient();
  
  // 既にログインしている場合はマイページにリダイレクト
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect('/mypage');
  }

  const params = await searchParams;

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyOTPContent searchParams={params} />
    </Suspense>
  );
}