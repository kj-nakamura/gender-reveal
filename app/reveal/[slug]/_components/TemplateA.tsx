// app/reveal/[slug]/_components/TemplateA.tsx
"use client";

import { useState, useRef } from "react";
import "./TemplateA.css";

type Props = {
  gender: string;
};

export default function TemplateA({ gender }: Props) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gifError, setGifError] = useState(false);

  const handleReveal = () => {
    if (gender === "girl") {
      setIsPlaying(true);
      setGifError(false);
      // GIFアニメーション終了後に初期画面に戻る
      setTimeout(() => {
        setIsPlaying(false);
      }, 21000); // 3秒後に初期画面に戻る（GIFの長さに応じて調整）
    } else {
      setIsRevealed(true);
    }
  };

  if (isPlaying && gender === "girl") {
    return (
      <div className="template-a-container">
        <div className="video-container">
          <img
            src="/reveal-girl.gif"
            alt="Gender Reveal Animation"
            className="reveal-gif"
            onError={() => setGifError(true)}
          />
        </div>
      </div>
    );
  }

  if (!isRevealed) {
    return (
      <div className="template-a-container">
        <div className="initial-view-a">
          <h1>性別が決まったよ！</h1>
          {gifError && (
            <div className="error-message">
              アニメーションの読み込みに失敗しました。
              <br />
              再度お試しください。
            </div>
          )}
          <button className="reveal-button-a" onClick={handleReveal}>
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
