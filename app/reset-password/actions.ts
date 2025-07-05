// app/reset-password/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";

export async function updatePassword(password: string) {
  const supabase = await createClient();

  try {
    // まず現在のユーザーを確認
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("User verification error:", userError);
      return { success: false, error: `ユーザー確認に失敗しました: ${userError.message}` };
    }

    if (!user) {
      console.error("No authenticated user found");
      return { success: false, error: "認証されたユーザーが見つかりません。パスワードリセットリンクから再度アクセスしてください。" };
    }

    console.log("Attempting to update password for user:", user.id);

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      console.error("Password update error:", error);
      return { success: false, error: `パスワードの更新に失敗しました: ${error.message}` };
    }

    console.log("Password updated successfully");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: `予期しないエラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}