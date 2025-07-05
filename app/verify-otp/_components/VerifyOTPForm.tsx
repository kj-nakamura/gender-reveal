"use client";

import { useState, useEffect } from "react";
import { verifyOTPCode, sendOTPCode } from "@/app/login/actions";
import { useRouter, useSearchParams } from "next/navigation";

interface VerifyOTPFormProps {
  email: string;
}

export default function VerifyOTPForm({ email }: VerifyOTPFormProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<'success' | 'error'>('error');
  const router = useRouter();
  const searchParams = useSearchParams();

  // URLからトークンを取得して自動入力
  useEffect(() => {
    const token = searchParams.get('token');
    if (token && token.length === 6) {
      setCode(token);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (code.length !== 6) {
      setMessage("6桁のコードを入力してください");
      setMessageType('error');
      setIsLoading(false);
      return;
    }

    try {
      const result = await verifyOTPCode(email, code);
      
      if (result.success) {
        setMessage("ログインしました！リダイレクトしています...");
        setMessageType('success');
        setTimeout(() => {
          router.push('/mypage');
        }, 1000);
      } else {
        setMessage(result.error || "認証に失敗しました");
        setMessageType('error');
      }
    } catch (error) {
      setMessage("エラーが発生しました");
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append('email', email);
      
      // Note: sendOTPCodeはリダイレクトするので、ここでは新しい関数が必要
      // 簡単のため、ページリロードで対応
      window.location.href = `/login?email=${encodeURIComponent(email)}`;
    } catch (error) {
      setMessage("再送信に失敗しました");
      setMessageType('error');
      setIsResending(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
          認証コード（6桁）
        </label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={handleCodeChange}
          maxLength={6}
          placeholder="123456"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          required
        />
      </div>

      {message && (
        <div className={`text-sm p-2 rounded ${
          messageType === 'error' 
            ? 'text-red-600 bg-red-50' 
            : 'text-green-600 bg-green-50'
        }`}>
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

      <div className="text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="text-sm text-blue-600 hover:text-blue-500 underline disabled:opacity-50"
        >
          {isResending ? "再送信中..." : "認証コードを再送信"}
        </button>
      </div>

      <div className="text-center text-xs text-gray-500">
        <p>認証コードの有効期限は10分です</p>
        <p>メールが届かない場合は迷惑メールフォルダをご確認ください</p>
      </div>
    </form>
  );
}