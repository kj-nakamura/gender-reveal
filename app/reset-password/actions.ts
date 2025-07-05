// app/reset-password/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";

export async function updatePassword(password: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      console.error("Password update error:", error);
      return { success: false, error: "パスワードの更新に失敗しました" };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "予期しないエラーが発生しました" };
  }
}