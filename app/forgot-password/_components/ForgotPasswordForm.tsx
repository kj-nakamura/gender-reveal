"use client";

import { useState } from "react";
import { resetPassword } from "../actions";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const result = await resetPassword(email);
      if (result.success) {
        setIsSuccess(true);
        setMessage("パスワードリセットリンクをメールにお送りしました。");
      } else {
        setMessage(result.error || "エラーが発生しました");
      }
    } catch {
      setMessage("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">メールを送信しました</h3>
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-semibold">{email}</span> にパスワードリセットリンクを送信しました。
          <br />
          メール内のリンクをクリックして新しいパスワードを設定してください。
        </p>
        <p className="text-xs text-gray-500">
          メールが届かない場合は、迷惑メールフォルダをご確認ください
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          メールアドレス
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="your-email@example.com"
        />
      </div>

      {message && (
        <div className={`text-sm ${message.includes("エラー") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !email}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "送信中..." : "パスワードリセットリンクを送信"}
      </button>
    </form>
  );
}