// app/login/page.tsx
"use client";

import { sendOTPCode, login, signup, signInWithGoogle } from "./actions";
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
  
  // パスワードタブの表示フラグ
  const showPasswordTab = false;

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
        {showPasswordTab && (
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
        )}

        <p className="text-gray-600 text-center mb-6">
          {!showPasswordTab || authMode === 'otp' 
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
        
        <form onSubmit={(!showPasswordTab || authMode === 'otp') ? handleSubmit : handleSubmit} className="space-y-6">
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
          
          {showPasswordTab && authMode === 'password' && (
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
            {isLoading ? '処理中...' : ((!showPasswordTab || authMode === 'otp') ? '認証コードを送信' : 'ログイン')}
          </button>
          
          {showPasswordTab && authMode === 'password' && (
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

        {/* Googleログインボタン */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">または</span>
            </div>
          </div>
          
          <form action={async () => {
            const result = await signInWithGoogle();
            if (result.success && result.url) {
              window.location.href = result.url;
            }
          }}>
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Googleアカウントでログイン
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          {!showPasswordTab || authMode === 'otp' ? (
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
