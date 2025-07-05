// app/login/page.tsx
"use client";

import { sendOTPCode } from "./actions";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const messageKey = searchParams.get('message');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');

  const getMessageText = (key: string) => {
    const messages: { [key: string]: { text: string; type: 'error' | 'success' } } = {
      'required': { text: 'メールアドレスは必須です', type: 'error' },
      'otp_send_error': { text: '認証コードの送信に失敗しました', type: 'error' },
      'otp_sent': { text: '認証コードをメールに送信しました', type: 'success' },
      'unexpected_error': { text: '予期しないエラーが発生しました', type: 'error' }
    };
    return messages[key] || { text: key, type: 'error' };
  };

  const urlMessage = messageKey ? getMessageText(messageKey) : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await sendOTPCode(formData);
      
      if (result.success && result.email) {
        setMessage('認証コードをメールに送信しました');
        setMessageType('success');
        // 成功時は認証コード入力画面にリダイレクト
        setTimeout(() => {
          router.push(`/verify-otp?email=${encodeURIComponent(result.email)}`);
        }, 1500);
      } else {
        setMessage(result.error || '認証コードの送信に失敗しました');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Client-side login error:', error);
      setMessage('エラーが発生しました。コンソールログを確認してください。');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const displayMessage = message || (urlMessage ? urlMessage.text : '');
  const displayMessageType = message ? messageType : (urlMessage ? urlMessage.type : 'error');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          ログイン
        </h1>
        <p className="text-gray-600 text-center mb-6">
          メールアドレスに認証コードを送信します
        </p>
        
        {displayMessage && (
          <div className={`p-3 rounded-md mb-4 ${
            displayMessageType === 'error'
              ? 'bg-red-100 border border-red-400 text-red-700' 
              : 'bg-green-100 border border-green-400 text-green-700'
          }`}>
            {displayMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50"
              placeholder="example@email.com"
            />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-md hover:from-pink-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '送信中...' : '認証コードを送信'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>メールアドレスに6桁の認証コードが送信されます</p>
          <p>初回利用時は自動的にアカウントが作成されます</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
