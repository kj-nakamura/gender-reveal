// app/_components/CommonHeader.tsx
"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { siteConfig } from "@/config/site";

type Props = {
  showAuthButton?: boolean;
};

export default function CommonHeader({ showAuthButton = true }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
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

  const handleAuthButton = () => {
    if (user) {
      router.push('/mypage');
    } else {
      router.push('/login');
    }
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  // メールアドレスからランダムカラーを生成
  const getAvatarColor = (email: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500', 
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500',
      'bg-teal-500',
      'bg-cyan-500'
    ];
    
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={handleLogoClick}
            className="text-2xl font-bold text-gray-900 zen-maru-gothic hover:text-purple-600 transition-colors"
          >
            {siteConfig.name}
          </button>
          
          {showAuthButton && (
            <div className="flex items-center gap-4">
              {user && (
                <div className={`w-10 h-10 ${getAvatarColor(user.email || '')} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              {!loading && (
                <button
                  onClick={handleAuthButton}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300"
                >
                  {user ? 'マイページ' : 'ログイン'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}