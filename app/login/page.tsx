// app/login/page.tsx
"use client";

import { login, signup } from "./actions";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function LoginForm() {
  const searchParams = useSearchParams();
  const messageKey = searchParams.get('message');

  const getMessageText = (key: string) => {
    const messages: { [key: string]: { text: string; type: 'error' | 'success' } } = {
      'required': { text: 'メールアドレスとパスワードは必須です', type: 'error' },
      'already_registered': { text: 'このメールアドレスは既に登録されています。ログインしてください。', type: 'error' },
      'signup_error': { text: '新規登録でエラーが発生しました', type: 'error' },
      'check_email': { text: 'メールアドレスを確認してログインを完了してください', type: 'success' },
      'signup_success': { text: '新規登録が完了しました！ログインしてください', type: 'success' },
      'login_error': { text: 'ログインに失敗しました。メールアドレスとパスワードを確認してください。', type: 'error' },
      'unexpected_error': { text: '予期しないエラーが発生しました', type: 'error' }
    };
    return messages[key] || { text: key, type: 'error' };
  };

  const message = messageKey ? getMessageText(messageKey) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          ログイン / 新規登録
        </h1>
        
        {message && (
          <div className={`p-3 rounded-md mb-4 ${
            message.type === 'error'
              ? 'bg-red-100 border border-red-400 text-red-700' 
              : 'bg-green-100 border border-green-400 text-green-700'
          }`}>
            {message.text}
          </div>
        )}
        
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="example@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              パスワード
            </label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="パスワードを入力"
            />
          </div>
          
          <div className="space-y-3 pt-4">
            <button 
              formAction={login}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            >
              ログイン
            </button>
            
            <button 
              formAction={signup}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
            >
              新規登録
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link 
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-500 underline"
          >
            パスワードをお忘れですか？
          </Link>
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
