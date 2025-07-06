// app/_components/TopPage.tsx
"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function TopPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleGetStarted = () => {
    if (user) {
      router.push('/mypage');
    } else {
      router.push('/login');
    }
  };

  // Hydration防止：マウント前は静的コンテンツのみ表示
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        {/* 静的ヘッダー */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-gray-900 zen-maru-gothic">
                性別発表カード
              </h1>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300">
                ログイン
              </button>
            </div>
          </div>
        </header>

        {/* 静的メインコンテンツ */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 zen-maru-gothic">
              特別な瞬間を
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                みんなで共有
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              大切な赤ちゃんの性別発表を、素敵なアニメーションと一緒に<br />
              家族や友人に共有できるサービスです
            </p>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg px-8 py-4 rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300 zen-maru-gothic font-bold">
              今すぐ始める
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900 zen-maru-gothic">
              性別発表カード
            </h1>
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300"
            >
              {user ? 'マイページ' : 'ログイン'}
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        {/* ヒーローセクション */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 zen-maru-gothic">
            特別な瞬間を
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              みんなで共有
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            大切な赤ちゃんの性別発表を、素敵なアニメーションと一緒に<br />
            家族や友人に共有できるサービスです
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg px-8 py-4 rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300 zen-maru-gothic font-bold"
          >
            {user ? 'マイページへ' : '今すぐ始める'}
          </button>
        </div>

        {/* 特徴セクション */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-5xl mb-4">🎀</div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 zen-maru-gothic">
              可愛いデザイン
            </h3>
            <p className="text-gray-600">
              シンプルからバルーンまで、複数のテンプレートから選べます
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 zen-maru-gothic">
              簡単シェア
            </h3>
            <p className="text-gray-600">
              作成したカードはURLで簡単にシェア。SNSでも共有できます
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 zen-maru-gothic">
              特別な演出
            </h3>
            <p className="text-gray-600">
              アニメーションで盛り上がる、忘れられない発表の瞬間を
            </p>
          </div>
        </div>

        {/* 使い方セクション */}
        <div className="text-center mb-20">
          <h3 className="text-3xl font-bold text-gray-800 mb-12 zen-maru-gothic">
            簡単3ステップ
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2 zen-maru-gothic">
                ログイン
              </h4>
              <p className="text-gray-600">
                Googleアカウントまたはメールで簡単ログイン
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-pink-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2 zen-maru-gothic">
                カード作成
              </h4>
              <p className="text-gray-600">
                お好みのテンプレートと性別を選択
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2 zen-maru-gothic">
                シェア
              </h4>
              <p className="text-gray-600">
                生成されたURLを家族や友人に共有
              </p>
            </div>
          </div>
        </div>

        {/* CTAセクション */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4 zen-maru-gothic">
            今すぐ始めましょう
          </h3>
          <p className="text-lg mb-8 opacity-90">
            無料で美しい性別発表カードを作成して、特別な瞬間をシェアしよう
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-purple-600 text-lg px-8 py-4 rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold zen-maru-gothic"
          >
            {user ? 'マイページへ' : '無料で始める'}
          </button>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 性別発表カード. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}