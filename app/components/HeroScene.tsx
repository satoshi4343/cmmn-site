"use client";

import { useEffect, useState } from "react";

export default function HeroScene() {
  const [showWith, setShowWith] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowWith(true), 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="absolute inset-0" style={{ backgroundColor: "#0b1523" }}>
      {/* ── 写真レイヤー ── */}

      {/* hero-without.jpg */}
      <img
        src="/hero-without.jpg"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: "cover",
          objectPosition: "center 20%",
          transform: "scale(1.04)",
          transition: "opacity 2.6s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: showWith ? 0 : 1,
        }}
      />

      {/* hero-with.jpg */}
      <img
        src="/hero-with.jpg"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: "cover",
          objectPosition: "center 20%",
          transform: "scale(1.04)",
          transition: "opacity 2.6s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: showWith ? 1 : 0,
        }}
      />

      {/* ── 重ね演出 ── */}

      {/* ヴィネット：縁を暗くして被写体を浮かせる */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 40%, transparent 30%, rgba(4,10,22,0.55) 100%)",
        }}
      />

      {/* 上部フェード（ヘッダー周辺を自然に暗く） */}
      <div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(8,14,26,0.45), transparent)",
        }}
      />

      {/* 下部グラデーション：写真の青みからダークネイビーへ自然につなぐ */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: "45%",
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(7,13,24,0.6) 40%, rgba(6,11,20,0.88) 70%, #060b14 100%)",
        }}
      />

      {/* フィルムグレイン */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.045, mixBlendMode: "screen" }}
        aria-hidden="true"
      >
        <filter id="film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#film-grain)" />
      </svg>
    </div>
  );
}
