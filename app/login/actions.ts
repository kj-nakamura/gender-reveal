// app/login/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signup = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    // エラー処理（例: エラーページにリダイレクト）
    return redirect("/login?message=Could not authenticate user");
  }

  // 新規登録後はメール確認を促すページにリダイレクトするのが親切
  return redirect("/login?message=Check email to continue sign in process");
};

export const login = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect("/login?message=Could not authenticate user");
  }

  // ログイン成功後はメインページなどにリダイレクト
  return redirect("/");
};
