// app/login/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { getBaseUrl } from "@/utils/get-base-url";

// Googleログイン
export const signInWithGoogle = async () => {
  const supabase = await createClient();
  const baseUrl = getBaseUrl();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${baseUrl}/auth/callback`,
    },
  });

  if (error) {
    console.error('Google login error:', error);
    return { success: false as const, error: 'Googleログインに失敗しました' };
  }

  return { success: true as const, url: data.url };
};

// メール認証コードを送信
export const sendOTPCode = async (formData: FormData) => {
  const email = formData.get("email") as string;
  
  console.log('sendOTPCode called with email:', email);
  
  if (!email) {
    console.log('No email provided');
    return { success: false as const, error: "メールアドレスは必須です" };
  }
  
  const supabase = await createClient();
  
  console.log('Sending OTP to:', email);
  
  const baseUrl = getBaseUrl();
  
  console.log('Attempting to send OTP with config:', {
    email,
    baseUrl,
    redirectTo: `${baseUrl}/verify-otp?email=${encodeURIComponent(email)}`,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    environment: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL
  });

  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      shouldCreateUser: true, // ユーザーが存在しない場合は自動作成
      // 一時的にemailRedirectToを削除してテスト
      // emailRedirectTo: `${baseUrl}/verify-otp?email=${encodeURIComponent(email)}`,
    }
  });

  if (error) {
    console.error('OTP send error details:', {
      message: error.message,
      status: error.status,
      name: error.name,
      stack: error.stack,
      fullError: error
    });
    return { success: false as const, error: `認証コードの送信に失敗しました: ${error.message}` };
  }

  console.log('OTP sent successfully, data:', data);
  return { success: true as const, email };
};

// 認証コードを検証してログイン
export const verifyOTPCode = async (email: string, token: string) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email'
  });

  if (error) {
    console.error('OTP verify error:', error);
    return { success: false, error: '認証コードが正しくありません' };
  }

  return { success: true };
};

// パスワードログイン
export const login = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  if (!email || !password) {
    return { success: false as const, error: "メールアドレスとパスワードは必須です" };
  }
  
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Password login error:', error);
    return { success: false as const, error: `ログインに失敗しました: ${error.message}` };
  }

  return { success: true as const };
};

// パスワード新規登録
export const signup = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  if (!email || !password) {
    return { success: false as const, error: "メールアドレスとパスワードは必須です" };
  }
  
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Signup error:', error);
    
    if (error.message === 'User already registered' || error.message.includes('already registered')) {
      return { success: false as const, error: "既に登録済みのメールアドレスです。パスワードリセットを使用してパスワードを設定してください。" };
    }
    
    if (error.message.includes('Email rate limit exceeded')) {
      return { success: false as const, error: "メール送信制限に達しています。しばらく待ってから再試行してください。" };
    }
    
    return { success: false as const, error: `新規登録に失敗しました: ${error.message}` };
  }

  if (data.user && !data.user.email_confirmed_at) {
    return { success: true as const, message: "メールアドレスの確認を行ってください" };
  }

  return { success: true as const, message: "新規登録が完了しました" };
};
