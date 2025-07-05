// app/mypage/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import RevealCard from "./_components/RevealCard";

export default async function MyPage() {
  const supabase = await createClient();
  
  // ユーザー認証チェック
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }

  // ユーザーの作成したリビールデータを取得
  const { data: reveals } = await supabase
    .from('reveals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">マイページ</h1>
      
      <div className="mb-6">
        <Link 
          href="/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          新しいリビールを作成
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">作成したリビール</h2>
        
        {reveals && reveals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reveals.map((reveal) => (
              <RevealCard key={reveal.id} reveal={reveal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">まだリビールを作成していません</p>
            <Link 
              href="/create" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              最初のリビールを作成
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}