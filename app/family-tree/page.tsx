// app/family-tree/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CommonHeader from "@/app/_components/CommonHeader";
import CommonFooter from "@/app/_components/CommonFooter";
import FamilyTreeVisualization from "./FamilyTreeVisualization";
import ActionButtons from "./ActionButtons";

export default async function FamilyTreePage() {
  const supabase = await createClient();

  // ユーザー認証チェック
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

  // 家系図が見つからない場合の処理
  if (!existingTree) {
    redirect("/login");
  }

  // その家系図に属する人物を取得
  const { data: persons } = await supabase
    .from("persons")
    .select("id, tree_id, name, gender, date_of_birth, father_id, mother_id")
    .eq("tree_id", existingTree.id);

  // その家系図に属する婚姻関係を取得
  const { data: marriages } = await supabase
    .from("marriages")
    .select("id, tree_id, partner1_id, partner2_id, start_date")
    .eq("tree_id", existingTree.id);

  return (
    <div className="min-h-screen flex flex-col">
      <CommonHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{existingTree.name}</h1>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">家系図</h2>
          <FamilyTreeVisualization persons={persons || []} marriages={marriages || []} treeId={existingTree.id} />
        </div>

        <div>
          <ActionButtons treeId={existingTree.id} persons={persons || []} marriages={marriages || []} />
        </div>
      </main>
      <CommonFooter />
    </div>
  );
}