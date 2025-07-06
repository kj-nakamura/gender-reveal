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
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleReveal = async () => {
    if (gender === "girl") {
      setIsPlaying(true);
      setVideoError(false);
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.error('Video play failed:', error);
          // ビデオ再生に失敗した場合はエラーメッセージを表示
          setIsPlaying(false);
          setVideoError(true);
        }
      }
    } else {
      setIsRevealed(true);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  if (isPlaying && gender === "girl") {
    return (
      <div className="template-a-container">
        <div className="video-container">
          <video
            ref={videoRef}
            src="/gender-reveal.mp4"
            onEnded={handleVideoEnd}
            className="reveal-video"
            controls
            muted
            playsInline
            preload="metadata"
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
          {videoError && (
            <div className="error-message">
              動画の再生に失敗しました。<br />
              ブラウザの設定を確認するか、再度お試しください。
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
