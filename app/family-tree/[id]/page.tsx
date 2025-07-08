// app/family-tree/[id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CommonHeader from "@/app/_components/CommonHeader";
import CommonFooter from "@/app/_components/CommonFooter";
import FamilyTreeVisualization from "./FamilyTreeVisualization";
import ExportControls from "./ExportControls";
import TabNavigation from "./TabNavigation";

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
  const { data: persons } = await supabase.from("persons").select("id, tree_id, name, gender, date_of_birth, father_id, mother_id").eq("tree_id", id);

  // その家系図に属する婚姻関係を取得
  const { data: marriages } = await supabase.from("marriages").select("id, tree_id, partner1_id, partner2_id, start_date").eq("tree_id", id);

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
          <ExportControls treeName={tree.name} />
        </div>

        <div>
          <TabNavigation 
            treeId={id} 
            persons={persons || []} 
            marriages={marriages || []} 
          />
        </div>
      </main>
      <CommonFooter />
    </div>
  );
}
