// app/auth/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      return { success: false, error: "ログアウトに失敗しました" };
    }

    // ログアウト成功後はログインページにリダイレクト
    redirect('/login');
  } catch (error) {
    console.error("Unexpected logout error:", error);
    return { success: false, error: "予期しないエラーが発生しました" };
  }
}