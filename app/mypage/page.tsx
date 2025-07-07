// app/mypage/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import RevealCard from "./_components/RevealCard";
import LogoutButton from "./_components/LogoutButton";
import DeleteUserButton from "./_components/DeleteUserButton";
import CommonHeader from "@/app/_components/CommonHeader";
import CommonFooter from "@/app/_components/CommonFooter";

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex flex-col">
      <CommonHeader />
      <div className="container mx-auto p-6 pt-8 flex-grow flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-bold zen-maru-gothic text-center">マイページ</h1>
          <p className="text-center text-gray-600 mt-2">{user.email}</p>
        </div>

        <div className="flex-1">
        {reveals && reveals.length > 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-3xl p-8 mb-8 border-2 border-pink-200 shadow-xl">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🤱</div>
                <h2 className="text-3xl font-bold zen-maru-gothic text-pink-700 mb-3">
                  ✨ あなたの特別なリビール ✨
                </h2>
                <p className="text-pink-600 text-lg zen-maru-gothic">
                  大切な瞬間をみんなとシェアしましょう 💕
                </p>
                <div className="flex justify-center items-center mt-4 space-x-2">
                  <span className="text-2xl">🌸</span>
                  <p className="text-sm text-purple-600 zen-maru-gothic">
                    アカウントごとに作成できるリビールは1つまでです
                  </p>
                  <span className="text-2xl">🌸</span>
                </div>
              </div>
            </div>
            <RevealCard reveal={reveals[0]} />
            <div className="text-center mt-6">
              <Link 
                href="/create"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-full font-bold zen-maru-gothic shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                🎨 テンプレートを見る
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 rounded-3xl p-12 text-center border-2 border-yellow-200 shadow-xl">
              <div className="text-8xl mb-6">👶</div>
              <h2 className="text-3xl font-bold zen-maru-gothic text-purple-700 mb-4">
                🎉 まだリビールを作成していません 🎉
              </h2>
              <p className="text-lg text-pink-600 mb-8 zen-maru-gothic">
                特別な瞬間を素敵なアニメーションで発表しましょう ✨
              </p>
              <div className="flex justify-center items-center mb-8 space-x-3">
                <span className="text-3xl">🌟</span>
                <span className="text-3xl">💕</span>
                <span className="text-3xl">🎈</span>
              </div>
              <Link 
                href="/create" 
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg zen-maru-gothic shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                🎀 リビールを作成する 🎀
              </Link>
            </div>
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
      <CommonFooter />
    </div>
  );
}
