"use client";

import { useState } from "react";
import { updatePassword } from "../actions";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("パスワードが一致しません");
      return;
    }

    if (password.length < 6) {
      setMessage("パスワードは6文字以上で入力してください");
      return;
    }

    setIsLoading(true);

    try {
      const result = await updatePassword(password);
      if (result.success) {
        setIsSuccess(true);
        setMessage("パスワードが正常に更新されました。ログインページにリダイレクトします...");
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setMessage(result.error || "パスワードの更新に失敗しました");
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">パスワードを更新しました</h3>
        <p className="text-sm text-gray-600">
          パスワードが正常に更新されました。
          <br />
          ログインページにリダイレクトします...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          新しいパスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="6文字以上で入力してください"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          パスワード確認
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="もう一度同じパスワードを入力してください"
        />
      </div>

      {message && (
        <div className={`text-sm ${message.includes("エラー") || message.includes("失敗") || message.includes("一致") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !password || !confirmPassword}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "更新中..." : "パスワードを更新"}
      </button>
    </form>
  );
}