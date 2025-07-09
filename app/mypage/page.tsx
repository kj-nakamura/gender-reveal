// app/mypage/page.tsx
"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import RevealCard from "./_components/RevealCard";
import LogoutButton from "./_components/LogoutButton";
import DeleteUserButton from "./_components/DeleteUserButton";
import CommonHeader from "@/app/_components/CommonHeader";
import CommonFooter from "@/app/_components/CommonFooter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faHeart, faGift, faPalette, faTree, faCircle } from "@fortawesome/free-solid-svg-icons";

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [reveals, setReveals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      // ユーザー認証チェック
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/login");
        return;
      }

      setUser(user);

      // ユーザーの作成したリビールデータを取得
      const { data: reveals } = await supabase
        .from("reveals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setReveals(reveals || []);
      setLoading(false);
    };

    getUser();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex flex-col">
      <CommonHeader />
      <div className="container mx-auto p-6 pt-8 flex-grow flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-bold zen-maru-gothic text-center">マイページ</h1>
          <p className="text-center text-gray-600 mt-2">{user?.email}</p>
        </div>

        <div className="flex-1">
          {reveals && reveals.length > 0 ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-3xl p-8 mb-8 border-2 border-pink-200 shadow-xl">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold zen-maru-gothic text-pink-700 mb-3">
                    <FontAwesomeIcon icon={faStar} className="text-3lx" /> リビール{" "}
                    <FontAwesomeIcon icon={faStar} className="text-3lx" />
                  </h2>
                  <div className="flex justify-center items-center mt-4 space-x-2">
                    <FontAwesomeIcon icon={faHeart} className="text-2xl text-pink-500" />
                    <p className="text-sm text-purple-600 zen-maru-gothic">
                      アカウントごとに作成できるリビールは1つまでです
                    </p>
                    <FontAwesomeIcon icon={faHeart} className="text-2xl text-pink-500" />
                  </div>
                </div>
              </div>
              <RevealCard reveal={reveals[0]} />
              <div className="text-center mt-6">
                <Link
                  href="/create"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-full font-bold zen-maru-gothic shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faPalette} className="text-sm" /> テンプレートを見る
                </Link>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 rounded-3xl p-12 text-center border-2 border-yellow-200 shadow-xl">
                <h2 className="text-3xl font-bold zen-maru-gothic text-purple-700 mb-4">
                  <FontAwesomeIcon icon={faGift} className="text-3lx" /> まだリビールを作成していません{" "}
                  <FontAwesomeIcon icon={faGift} className="text-3lx" />
                </h2>
                <p className="text-lg text-pink-600 mb-8 zen-maru-gothic">
                  特別な瞬間を素敵なアニメーションで発表しましょう <FontAwesomeIcon icon={faStar} className="text-lg" />
                </p>
                <div className="flex justify-center items-center mb-8 space-x-3">
                  <FontAwesomeIcon icon={faStar} className="text-3xl text-yellow-500" />
                  <FontAwesomeIcon icon={faHeart} className="text-3xl text-pink-500" />
                  <FontAwesomeIcon icon={faCircle} className="text-3xl text-blue-500" />
                </div>
                <Link
                  href="/create"
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg zen-maru-gothic shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faGift} className="text-lg" /> リビールを作成する{" "}
                  <FontAwesomeIcon icon={faGift} className="text-lg" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 家系図セクション */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-green-50 via-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg">
              <div className="text-center">
                <div className="text-4xl mb-3">
                  <FontAwesomeIcon icon={faTree} className="text-4xl text-green-600" />
                </div>
                <h3 className="text-xl font-bold zen-maru-gothic text-green-700 mb-3">家系図を作成・編集</h3>
                <Link
                  href="/family-tree"
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-full font-bold zen-maru-gothic shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-block"
                >
                  <FontAwesomeIcon icon={faTree} /> 家系図を開く
                </Link>
              </div>
            </div>
          </div>
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
