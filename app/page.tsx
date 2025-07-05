import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  
  // ユーザー認証チェック
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    // 未ログインの場合はログインページにリダイレクト
    redirect('/login');
  }

  // ログイン済みの場合はマイページにリダイレクト
  redirect('/mypage');
}
