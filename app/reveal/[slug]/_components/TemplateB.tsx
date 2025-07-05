// app/reveal/[slug]/_components/TemplateB.tsx
"use client";

import { useState } from "react";
import "./TemplateB.css"; // あとで作成するCSSファイルをインポート

type Props = {
  gender: string;
};

export default function TemplateB({ gender }: Props) {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    setIsRevealed(true);
  };

  return (
    <div className="template-b-container">
      {!isRevealed ? (
        <div className="initial-view">
          <h1>Ready to pop?</h1>
          <button className="reveal-button" onClick={handleReveal}>
            風船をわる！
          </button>
        </div>
      ) : (
        <div className="revealed-view">
          <div className="balloon-animation">
            <div className="balloon">🎈</div>
            <div className="balloon">🎈</div>
            <div className="balloon">🎈</div>
          </div>
          <h1>It&apos;s a ...</h1>
          <h2 className={`result-text ${gender}`}>{gender === "boy" ? "Boy! ♂" : "Girl! ♀"}</h2>
        </div>
      )}
    </div>
  );
}
