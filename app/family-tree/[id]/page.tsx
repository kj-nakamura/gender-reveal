// app/family-tree/[id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CommonHeader from "@/app/_components/CommonHeader";
import CommonFooter from "@/app/_components/CommonFooter";
import AddPersonForm from "./AddPersonForm";
import PersonList from "./PersonList";
import AddMarriageForm from "./AddMarriageForm";
import MarriageList from "./MarriageList";
import FamilyTreeVisualization from "./FamilyTreeVisualization";

export default async function TreeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // ユーザー認証チェック
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // 家系図の情報を取得
  const { data: tree } = await supabase.from("family_trees").select("name").eq("id", id).single();

  // その家系図に属する人物を取得
  const { data: persons } = await supabase.from("persons").select("*").eq("tree_id", id);

  // その家系図に属する婚姻関係を取得
  const { data: marriages } = await supabase.from("marriages").select("*").eq("tree_id", id);

  // 家系図の所有者でない場合はアクセス拒否
  if (!tree) {
    redirect("/family-tree");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <CommonHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{tree.name}</h1>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">家系図</h2>
          <FamilyTreeVisualization persons={persons || []} marriages={marriages || []} />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">人物を追加</h2>
          <AddPersonForm treeId={id} existingPersons={persons || []} />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">婚姻関係を追加</h2>
          <AddMarriageForm treeId={id} existingPersons={persons || []} />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">登録されている人物</h2>
          <PersonList persons={persons || []} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">婚姻関係</h2>
          <MarriageList marriages={marriages || []} persons={persons || []} />
        </div>
      </main>
      <CommonFooter />
    </div>
  );
}
