// app/forgot-password/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { getBaseUrl } from "@/utils/get-base-url";

export async function resetPassword(email: string) {
  const supabase = await createClient();

  const baseUrl = getBaseUrl();

  try {
    console.log("Sending password reset email to:", email);
    console.log("Redirect URL:", `${baseUrl}/auth/callback?next=/reset-password&type=recovery`);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/auth/callback?next=/reset-password&type=recovery`,
    });

    if (error) {
      console.error("Password reset error:", error);
      return { success: false, error: `パスワードリセットメールの送信に失敗しました: ${error.message}` };
    }

    console.log("Password reset email sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: `予期しないエラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}