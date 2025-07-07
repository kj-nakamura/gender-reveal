// app/create/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreateRevealClient from "./_components/CreateRevealClient";

export default async function CreateRevealPage() {
  const supabase = await createClient();

  // ユーザー認証チェック
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // 既存のリビールがあるかチェック
  const { data: existingReveal } = await supabase.from("reveals").select("*").eq("user_id", user.id).single();

  return <CreateRevealClient existingReveal={existingReveal} />;
}
