// app/template/[templateId]/_components/CreateRevealButton.tsx
"use client";

import { createReveal, replaceReveal } from "@/app/reveal/actions";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

type Props = {
  templateId: string;
  gender: string;
};

export default function CreateRevealButton({ templateId, gender }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [existingReveal, setExistingReveal] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: reveal } = await supabase
          .from("reveals")
          .select("*")
          .eq("user_id", user.id)
          .single();
        setExistingReveal(reveal);
      }
    };

    checkUser();
  }, []);

  const handleCreateOrReplace = async () => {
    if (!user) {
      // 未ログインの場合はログインページにリダイレクト
      window.location.href = "/login";
      return;
    }

    setIsLoading(true);
    try {
      if (existingReveal) {
        await replaceReveal(templateId, gender);
      } else {
        await createReveal(templateId, gender);
      }
    } catch (error) {
      console.error('Error creating/replacing reveal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <button
        onClick={handleCreateOrReplace}
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg zen-maru-gothic shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        🔗 このテンプレートで共有URLを発行する
      </button>
    );
  }

  return (
    <button
      onClick={handleCreateOrReplace}
      disabled={isLoading}
      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-full font-bold text-lg zen-maru-gothic shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:transform-none"
    >
      {isLoading 
        ? '処理中...' 
        : existingReveal 
          ? '🔄 このテンプレートに差し替える' 
          : '🔗 このテンプレートで共有URLを発行する'
      }
    </button>
  );
}