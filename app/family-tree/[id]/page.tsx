// app/family-tree/[id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CommonHeader from "@/app/_components/CommonHeader";
import CommonFooter from "@/app/_components/CommonFooter";
import AddPersonForm from "./AddPersonForm";

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
          <h2 className="text-xl font-semibold mb-4">人物を追加</h2>
          <AddPersonForm treeId={id} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">登録されている人物</h2>
          {persons && persons.length > 0 ? (
            <ul className="space-y-3">
              {persons.map((person) => (
                <li key={person.id} className="p-4 border rounded-lg">
                  <div className="font-semibold">{person.name}</div>
                  <div className="text-sm text-gray-600">
                    性別: {person.gender === 'male' ? '男性' : person.gender === 'female' ? '女性' : 'その他'}
                    {person.date_of_birth && ` | 生年月日: ${person.date_of_birth}`}
                    {person.date_of_death && ` | 没年月日: ${person.date_of_death}`}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">まだ人物が登録されていません。上のフォームから追加してください。</p>
          )}
        </div>
      </main>
      <CommonFooter />
    </div>
  );
}
