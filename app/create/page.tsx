// app/create/page.tsx
import { createClient } from "@/utils/supabase/server";
import CreateRevealClient from "./_components/CreateRevealClient";

export default async function CreateRevealPage() {
  const supabase = await createClient();

  // ユーザー認証チェック（ログインしていなくてもアクセス可能）
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let existingReveal = null;

  // ログインしている場合のみ既存のリビールをチェック
  if (user) {
    const { data } = await supabase.from("reveals").select("*").eq("user_id", user.id).single();
    existingReveal = data;
  }

  return <CreateRevealClient existingReveal={existingReveal} />;
}
