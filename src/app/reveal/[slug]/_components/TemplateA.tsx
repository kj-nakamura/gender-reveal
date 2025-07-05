// app/reveal/[slug]/_components/TemplateA.tsx
"use client";

import { useState } from "react";

type Props = {
  gender: string;
};

export default function TemplateA({ gender }: Props) {
  const [isRevealed, setIsRevealed] = useState(false);

  if (!isRevealed) {
    return (
      <div>
        <h1>ドキドキ...</h1>
        <button onClick={() => setIsRevealed(true)}>結果を見る！</button>
      </div>
    );
  }

  return (
    <div>
      <h1>It's a ...</h1>
      {/* ここにアニメーションなどを追加するとリッチになる */}
      <h2>{gender === "boy" ? "Boy! ♂" : "Girl! ♀"}</h2>
    </div>
  );
}
