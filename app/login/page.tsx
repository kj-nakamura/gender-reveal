// app/login/page.tsx
"use client";

import { sendOTPCode, login, signup } from "./actions";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [messageKey, setMessageKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [authMode, setAuthMode] = useState<'otp' | 'password'>('otp');

  // クライアントサイドでのみ searchParams を読み取り
  useEffect(() => {
    setMessageKey(searchParams.get('message'));
  }, [searchParams]);

  const getMessageText = (key: string) => {
    const messages: { [key: string]: { text: string; type: 'error' | 'success' } } = {
      'required': { text: 'メールアドレスとパスワードは必須です', type: 'error' },
      'otp_send_error': { text: '認証コードの送信に失敗しました', type: 'error' },
      'otp_sent': { text: '認証コードをメールに送信しました', type: 'success' },
      'login_error': { text: 'ログインに失敗しました', type: 'error' },
      'signup_error': { text: '新規登録に失敗しました', type: 'error' },
      'signup_success': { text: '新規登録が完了しました', type: 'success' },
      'check_email': { text: 'メールアドレスの確認を行ってください', type: 'success' },
      'already_registered': { text: '既に登録済みのメールアドレスです', type: 'error' },
      'reset_session_expired': { text: 'パスワードリセットセッションが無効です。再度リセットを行ってください。', type: 'error' },
      'auth_error': { text: '認証に失敗しました', type: 'error' },
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
      if (authMode === 'otp') {
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
      } else {
        // パスワード認証の場合
        console.log('Attempting password login...');
        const result = await login(formData);
        console.log('Password login result:', result);
        
        if (result.success) {
          setMessage('ログインしました');
          setMessageType('success');
          // 成功時はマイページにリダイレクト
          setTimeout(() => {
            router.push('/mypage');
          }, 1000);
        } else {
          setMessage(result.error || 'ログインに失敗しました');
          setMessageType('error');
        }
      }
    } catch (error) {
      console.error('Client-side login error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      });
      setMessage(`エラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    
    try {
      console.log('Attempting signup...');
      const result = await signup(formData);
      console.log('Signup result:', result);
      
      if (result.success) {
        setMessage(result.message || '新規登録が完了しました');
        setMessageType('success');
        // 成功時はマイページにリダイレクト
        setTimeout(() => {
          router.push('/mypage');
        }, 1500);
      } else {
        setMessage(result.error || '新規登録に失敗しました');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Client-side signup error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      });
      setMessage(`エラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
        
        {/* 認証方式選択タブ */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setAuthMode('otp')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              authMode === 'otp'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            メール認証
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('password')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              authMode === 'password'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            パスワード
          </button>
        </div>

        <p className="text-gray-600 text-center mb-6">
          {authMode === 'otp' 
            ? 'メールアドレスに認証コードを送信します' 
            : 'メールアドレスとパスワードでログインします'}
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
        
        <form onSubmit={authMode === 'password' ? handleSubmit : handleSubmit} className="space-y-6">
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
          
          {authMode === 'password' && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                パスワード
              </label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50"
                placeholder="パスワードを入力"
              />
            </div>
          )}
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-md hover:from-pink-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '処理中...' : (authMode === 'otp' ? '認証コードを送信' : 'ログイン')}
          </button>
          
          {authMode === 'password' && (
            <>
              <button 
                type="button"
                onClick={async (e) => {
                  const form = e.currentTarget.closest('form') as HTMLFormElement;
                  const event = {
                    preventDefault: () => {},
                    currentTarget: form
                  } as React.FormEvent<HTMLFormElement>;
                  await handleSignup(event);
                }}
                disabled={isLoading}
                className="w-full bg-gray-500 text-white font-semibold py-3 px-6 rounded-md hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '処理中...' : '新規登録'}
              </button>
              
              <button 
                type="button"
                onClick={() => router.push('/forgot-password')}
                className="w-full text-pink-600 hover:text-pink-800 font-medium py-2 transition-colors"
              >
                既存アカウントにパスワードを設定
              </button>
            </>
          )}
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {authMode === 'otp' ? (
            <>
              <p>メールアドレスに6桁の認証コードが送信されます</p>
              <p>初回利用時は自動的にアカウントが作成されます</p>
            </>
          ) : (
            <>
              <p>既存のアカウントでログインするか、新規登録を行ってください</p>
              <p className="mt-2 text-xs">
                ※ メール認証で作成されたアカウントは、<br/>
                「既存アカウントにパスワードを設定」からパスワードを設定してください
              </p>
            </>
          )}
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
