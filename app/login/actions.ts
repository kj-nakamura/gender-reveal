// app/login/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const signup = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  if (!email || !password) {
    redirect("/login?message=required");
  }
  
  console.log("Signup attempt:", { email, password: "***" });
  
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  console.log("Signup result:", { data, error });

  if (error) {
    console.error('Signup error:', error);
    
    // 既存ユーザーの場合は特別な処理
    if (error.message === 'User already registered') {
      redirect("/login?message=already_registered");
    }
    
    // その他のエラー
    redirect("/login?message=signup_error");
  }

  if (data.user && !data.user.email_confirmed_at) {
    redirect("/login?message=check_email");
  }

  // 新規登録成功
  redirect("/login?message=signup_success");
};

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

  // ログイン成功後はメインページなどにリダイレクト
  redirect("/");
};
