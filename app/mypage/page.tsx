// app/mypage/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import RevealCard from "./_components/RevealCard";
import LogoutButton from "./_components/LogoutButton";
import DeleteUserButton from "./_components/DeleteUserButton";
import CommonHeader from "@/app/_components/CommonHeader";

export default async function MyPage() {
  const supabase = await createClient();

  // ユーザー認証チェック
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // ユーザーの作成したリビールデータを取得
  const { data: reveals } = await supabase
    .from("reveals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <CommonHeader />
      <div className="container mx-auto p-6 pt-8 min-h-screen flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-bold zen-maru-gothic text-center">マイページ</h1>
          <p className="text-center text-gray-600 mt-2">{user.email}</p>
        </div>

        <div className="flex-1">
        {reveals && reveals.length > 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">あなたのリビール</h2>
              <p className="text-gray-600 mb-4">アカウントごとに作成できるリビールは1つまでです。</p>
            </div>
            <RevealCard reveal={reveals[0]} />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">まだリビールを作成していません</p>
            <Link href="/create" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
              リビールを作成
            </Link>
          </div>
        )}
        </div>

        {/* アカウント管理セクション */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">アカウント管理</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LogoutButton />
              <DeleteUserButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
