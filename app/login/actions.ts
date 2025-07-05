// app/login/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const signup = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  console.log("Signup attempt:", { email, password: "***" });
  
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  console.log("Signup result:", { data, error });

  if (error) {
    console.error('Signup error:', error);
    return redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  // 新規登録後はメール確認を促すページにリダイレクトするのが親切
  return redirect("/login?message=Check email to continue sign in process");
};

export const login = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

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
