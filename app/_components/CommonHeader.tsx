// app/_components/CommonHeader.tsx
"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

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

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={handleLogoClick}
            className="text-2xl font-bold text-gray-900 zen-maru-gothic hover:text-purple-600 transition-colors"
          >
            性別発表カード
          </button>
          
          {showAuthButton && (
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-gray-600 hidden sm:block">
                  {user.email}
                </span>
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