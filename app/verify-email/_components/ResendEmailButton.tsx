"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ResendEmailButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.email) {
        setMessage("メールアドレスが見つかりません");
        return;
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      });

      if (error) {
        setMessage("再送信に失敗しました: " + error.message);
      } else {
        setMessage("認証メールを再送信しました");
      }
    } catch {
      setMessage("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleResend}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "送信中..." : "認証メールを再送信"}
      </button>
      
      {message && (
        <p className={`text-sm ${message.includes("失敗") || message.includes("エラー") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}