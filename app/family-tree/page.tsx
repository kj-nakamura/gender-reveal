// app/family-tree/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function FamilyTreePage() {
  const supabase = await createClient();

  // ログインユーザーの情報を取得
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // ユーザーが作成した家系図を取得
  const { data: familyTrees } = await supabase.from("family_trees").select("id, name").eq("owner_id", user.id);
  let existingTree = familyTrees?.[0];

  // 家系図がない場合は自動作成
  if (!existingTree) {
    const { data: newTree, error: createError } = await supabase
      .from("family_trees")
      .insert({
        name: `${user.email?.split('@')[0] || 'ユーザー'}の家系図`,
        owner_id: user.id,
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating tree:", createError);
      // エラーが発生した場合はログインページにリダイレクト
      redirect("/login");
    }

    existingTree = newTree;
  }

  // 家系図の詳細ページにリダイレクト
  if (existingTree) {
    redirect(`/family-tree/${existingTree.id}`);
  }
  
  // ここに到達することはないが、TypeScriptエラー回避のため
  redirect("/login");
}
