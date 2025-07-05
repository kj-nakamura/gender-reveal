// app/forgot-password/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { getBaseUrl } from "@/utils/get-base-url";

export async function resetPassword(email: string) {
  const supabase = await createClient();

  const baseUrl = getBaseUrl();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/reset-password`,
    });

    if (error) {
      console.error("Password reset error:", error);
      return { success: false, error: "パスワードリセットメールの送信に失敗しました" };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "予期しないエラーが発生しました" };
  }
}