// app/verify-otp-simple/page.tsx
"use client";

import { useState } from "react";
import { verifyOTPCode } from "@/app/login/actions";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOTPSimplePage() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const email = searchParams.get('email') || 'test@example.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const result = await verifyOTPCode(email, code);
      
      if (result.success) {
        setMessage("ログインしました！");
        setTimeout(() => {
          router.push('/mypage');
        }, 1000);
      } else {
        setMessage(result.error || "認証に失敗しました");
      }
    } catch (error) {
      setMessage("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          認証コードを入力（シンプル版）
        </h1>
        <p className="text-gray-600 text-center mb-6">
          <span className="font-semibold">{email}</span> に送信された6桁のコードを入力してください
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              認証コード（6桁）
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              placeholder="123456"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          {message && (
            <div className="text-sm p-2 rounded bg-blue-50 text-blue-600">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || code.length !== 6}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-md hover:from-pink-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "認証中..." : "ログイン"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a 
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-500 underline"
          >
            別のメールアドレスでログイン
          </a>
        </div>
      </div>
    </div>
  );
}