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
  } catch (error) {
    console.error("Unexpected logout error:", error);
    return { success: false, error: "予期しないエラーが発生しました" };
  }

  // ログアウト成功後はトップページにリダイレクト
  redirect('/');
}

export async function deleteUser() {
  const supabase = await createClient();

  try {
    // 1. ログインしているユーザー情報を取得
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "ユーザーが見つかりません" };
    }

    // 2. 関連するリビールデータを先に削除
    const { error: revealsError } = await supabase
      .from('reveals')
      .delete()
      .eq('user_id', user.id);

    if (revealsError) {
      console.error("Error deleting reveals:", revealsError);
      return { success: false, error: "関連データの削除に失敗しました" };
    }

    // 3. ユーザーアカウントを削除
    const { error: deleteError } = await supabase.rpc('delete_user');

    if (deleteError) {
      console.error("User delete error:", deleteError);
      return { success: false, error: "アカウントの削除に失敗しました" };
    }

    // 削除成功後はログインページにリダイレクト
    redirect('/login');
  } catch (error) {
    console.error("Unexpected delete error:", error);
    return { success: false, error: "予期しないエラーが発生しました" };
  }
}