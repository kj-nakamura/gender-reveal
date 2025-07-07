// app/reveal/[slug]/_components/TemplateA.tsx
"use client";

import { useState } from "react";
import MobileLayout from "@/app/_components/MobileLayout";
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
      <MobileLayout>
        <div className="template-a-container">
          <div className="video-container">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/reveal-girl.gif"
              alt="Gender Reveal Animation"
              className="reveal-gif"
              onError={() => setGifError(true)}
            />
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (!isRevealed) {
    return (
      <MobileLayout>
        <div className="template-a-container">
          <div className="initial-view-a">
            <h2>性別を発表するよ！</h2>
            {gifError && (
              <div className="error-message">
                アニメーションの読み込みに失敗しました。
                <br />
                再度お試しください。
              </div>
            )}
            <button className="reveal-button-a" onClick={handleReveal}>
              タップしてね
            </button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="template-a-container">
        <div className="revealed-view-a">
          <h1>It&apos;s a ...</h1>
          <h2 className={`result-text-a ${gender}`}>{gender === "boy" ? "Boy! ♂" : "Girl! ♀"}</h2>
        </div>
      </div>
    </MobileLayout>
  );
}
