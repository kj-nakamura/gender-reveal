// app/reveal/[slug]/_components/TemplateB.tsx
"use client";

import { useState, useEffect } from "react";
import MobileLayout from "@/app/_components/MobileLayout";
import "./TemplateB.css"; // あとで作成するCSSファイルをインポート

type Props = {
  gender: string;
};

export default function TemplateB({ gender }: Props) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const handleReveal = () => {
    setIsCountingDown(true);
    setCountdown(3);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isCountingDown && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (isCountingDown && countdown === 0) {
      setIsCountingDown(false);
      setIsRevealed(true);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, isCountingDown]);

  // 20秒後に初期画面に戻る
  useEffect(() => {
    let resetTimer: NodeJS.Timeout;

    if (isRevealed) {
      resetTimer = setTimeout(() => {
        setIsRevealed(false);
      }, 20000);
    }

    return () => {
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [isRevealed]);

  // カウントダウン画面
  if (isCountingDown) {
    return (
      <MobileLayout>
        <div className="template-b-container countdown">
          <div className="countdown-view">
            <h2>カウントダウン</h2>
            <div className="countdown-number">{countdown}</div>
            <p>風船が割れるまで...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className={`template-b-container ${isRevealed ? `${gender}-revealed` : ''}`}>
        {!isRevealed ? (
          <div className="initial-view">
            <h2>性別を発表するよ！</h2>
            <button className="reveal-button" onClick={handleReveal}>
              風船を割る🎈
            </button>
          </div>
        ) : (
          <div className="revealed-view">
            <div className="balloon-animation">
              <div className="balloon">🎈</div>
              <div className="balloon">🎈</div>
              <div className="balloon">🎈</div>
              <div className="balloon">🎈</div>
              <div className="balloon">🎈</div>
              <div className="balloon">🎈</div>
              <div className="balloon">🎈</div>
              <div className="balloon">🎈</div>
            </div>
            <h1>性別は...</h1>
            <h2 className={`result-text ${gender}`}>{gender === "boy" ? "男の子! ♂" : "女の子! ♀"}</h2>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
