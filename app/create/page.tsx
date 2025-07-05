// app/create/page.tsx
"use client";

import { createReveal } from "@/app/reveal/actions"; // 実際のパスに合わせてください
import "./page.css"; // ← この行を追加

// // createReveal関数のダミー（動作確認用）
// const createReveal = (templateId: string, gender: "boy" | "girl") => {
//   console.log(`Creating reveal with: ${templateId}, ${gender}`);
//   alert(`リンク作成： ${templateId}, ${gender}`);
// };

export default function CreateRevealPage() {
  return (
    <main className="create-page-container">
      <h1>デザインを選んで作成</h1>

      {/* --- デザインテンプレートA --- */}
      <div className="template-card">
        <h2>シンプルデザイン</h2>
        <p>一番ベーシックなデザインです。</p>
        <div className="button-group">
          <button className="create-button boy" onClick={() => createReveal("template_A", "boy")}>
            男の子で作成
          </button>
          <button className="create-button girl" onClick={() => createReveal("template_A", "girl")}>
            女の子で作成
          </button>
        </div>
      </div>

      {/* --- デザインテンプレートB --- */}
      <div className="template-card">
        <h2>バルーンデザイン</h2>
        <p>風船が飛び出すアニメーション付きのデザインです。</p>
        <div className="button-group">
          <button className="create-button boy" onClick={() => createReveal("template_B", "boy")}>
            男の子で作成
          </button>
          <button className="create-button girl" onClick={() => createReveal("template_B", "girl")}>
            女の子で作成
          </button>
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
  );
}
