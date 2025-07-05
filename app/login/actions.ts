// app/login/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// メール認証コードを送信
export const sendOTPCode = async (formData: FormData) => {
  const email = formData.get("email") as string;
  
  console.log('sendOTPCode called with email:', email);
  
  if (!email) {
    console.log('No email provided');
    return { success: false, error: "メールアドレスは必須です" };
  }
  
  const supabase = await createClient();
  
  console.log('Sending OTP to:', email);
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      shouldCreateUser: true, // ユーザーが存在しない場合は自動作成
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/verify-otp?email=${encodeURIComponent(email)}`,
    }
  });

  if (error) {
    console.error('OTP send error:', error);
    return { success: false, error: "認証コードの送信に失敗しました" };
  }

  console.log('OTP sent successfully, data:', data);
  return { success: true, email };
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

// 従来のパスワードログイン（後方互換性のため残す）
export const login = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  if (!email || !password) {
    redirect("/login?message=required");
  }
  
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/login?message=login_error");
  }

  redirect("/");
};

// 従来のパスワード新規登録（後方互換性のため残す）
export const signup = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  if (!email || !password) {
    redirect("/login?message=required");
  }
  
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Signup error:', error);
    
    if (error.message === 'User already registered') {
      redirect("/login?message=already_registered");
    }
    
    redirect("/login?message=signup_error");
  }

  if (data.user && !data.user.email_confirmed_at) {
    redirect("/login?message=check_email");
  }

  redirect("/login?message=signup_success");
};
