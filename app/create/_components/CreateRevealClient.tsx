// app/create/_components/CreateRevealClient.tsx
"use client";

import { createReveal, replaceReveal } from "@/app/reveal/actions";
import CommonHeader from "@/app/_components/CommonHeader";
import Link from "next/link";
import "../page.css";
import { useState } from "react";

type Props = {
  existingReveal: any;
};

export default function CreateRevealClient({ existingReveal }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateOrReplace = async (templateId: string, gender: string) => {
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
  return (
    <div>
      <CommonHeader />
      <main className="create-page-container">
        <div className="mb-8">
          <h1>{existingReveal ? 'テンプレートを差し替え' : 'デザインを選んで作成'}</h1>
          {existingReveal && (
            <p className="text-orange-600 font-medium mt-2">
              ⚠️ 新しいテンプレートを選ぶと、新しいURLが発行され、既存のURLは無効になります
            </p>
          )}
        </div>

      {existingReveal && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-bold text-blue-800 mb-2">現在のリビール情報</h3>
          <p className="text-blue-700">
            テンプレート: {existingReveal.template_id === 'template_A' ? 'シンプルデザイン' : 'バルーンデザイン'} | 
            性別: {existingReveal.gender === 'boy' ? '男の子' : '女の子'}
          </p>
        </div>
      )}

      {/* --- デザインテンプレートA --- */}
      <div className="template-card">
        <h2>シンプルデザイン</h2>
        <p>一番ベーシックなデザインです。</p>
        <div className="button-group">
          <Link
            href="/template/template_A?gender=boy"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-bold zen-maru-gothic shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-block"
          >
            👦 男の子のサンプル
          </Link>
          <Link
            href="/template/template_A?gender=girl"
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full font-bold zen-maru-gothic shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-block"
          >
            👧 女の子のサンプル
          </Link>
        </div>
      </div>

      {/* --- デザインテンプレートB --- */}
      <div className="template-card">
        <h2>バルーンデザイン</h2>
        <p>風船が飛び出すアニメーション付きのデザインです。</p>
        <div className="button-group">
          <Link
            href="/template/template_B?gender=boy"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-bold zen-maru-gothic shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-block"
          >
            👦 男の子のサンプル
          </Link>
          <Link
            href="/template/template_B?gender=girl"
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full font-bold zen-maru-gothic shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-block"
          >
            👧 女の子のサンプル
          </Link>
        </div>
      </div>

      {/* 将来的に有料テンプレートを追加するなら... */}
      <div className="template-card premium-card">
        <h2>✨ プレミアムデザイン（有料）</h2>
        <p>特別な日のための、豪華なエフェクト付きデザインです。</p>
        <div className="button-group">
          <button className="create-button premium-button">男の子で作成（購入へ）</button>
          <button className="create-button premium-button">女の子で作成（購入へ）</button>
        </div>
      </div>
      </main>
    </div>
  );
}