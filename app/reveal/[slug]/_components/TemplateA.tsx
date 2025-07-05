// app/reveal/[slug]/_components/TemplateA.tsx
"use client";

import { useState } from "react";
import "./TemplateA.css"; // ← この行を追加

type Props = {
  gender: string;
};

export default function TemplateA({ gender }: Props) {
  const [isRevealed, setIsRevealed] = useState(false);

  if (!isRevealed) {
    return (
      <div className="template-a-container">
        <div className="initial-view-a">
          <h1>ドキドキ...</h1>
          <button className="reveal-button-a" onClick={() => setIsRevealed(true)}>
            結果を見る！
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="template-a-container">
      <div className="revealed-view-a">
        <h1>It&apos;s a ...</h1>
        <h2 className={`result-text-a ${gender}`}>{gender === "boy" ? "Boy! ♂" : "Girl! ♀"}</h2>
      </div>
    </div>
  );
}
