// app/page.tsx (または app/create/page.tsx)
"use client"; // ← ユーザー操作を含むため、クライアントコンポーネントとして宣言

import { createReveal } from "../reveal/actions"; // ← 前回作成したバックエンド処理をインポート

export default function CreateRevealPage() {
  return (
    <div>
      <h1>デザインを選んで作成</h1>

      {/* --- デザインテンプレートA --- */}
      <div style={{ border: "1px solid #ccc", padding: "16px", margin: "16px 0" }}>
        <h2>シンプルデザイン</h2>
        <p>一番ベーシックなデザインです。</p>
        <button onClick={() => createReveal("template_A", "boy")}>男の子で作成</button>
        <button onClick={() => createReveal("template_A", "girl")}>女の子で作成</button>
      </div>

      {/* --- デザインテンプレートB --- */}
      <div style={{ border: "1px solid #ccc", padding: "16px", margin: "16px 0" }}>
        <h2>バルーンデザイン</h2>
        <p>風船が飛び出すアニメーション付きのデザインです。</p>
        <button onClick={() => createReveal("template_B", "boy")}>男の子で作成</button>
        <button onClick={() => createReveal("template_B", "girl")}>女の子で作成</button>
      </div>

      {/* 将来的に有料テンプレートを追加するなら... */}
      {/* <div style={{ border: '1px solid gold', padding: '16px', margin: '16px 0' }}>
        <h2>プレミアムデザイン（有料）</h2>
        <button>男の子で作成（購入へ）</button>
        <button>女の子で作成（購入へ）</button>
      </div> */}
    </div>
  );
}
