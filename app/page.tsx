"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// ──────────────────────────────────────────────
// Opening intro overlay
// ──────────────────────────────────────────────
function IntroOverlay() {
  const [eyewearVisible, setEyewearVisible] = useState(false);
  const [eyewearOut,     setEyewearOut]     = useState(false);
  const [logoOut,        setLogoOut]         = useState(false);
  const [overlayOut,     setOverlayOut]      = useState(false);
  const [done,           setDone]            = useState(false);

  useEffect(() => {
    // ① +500ms: EYEWEAR フェードイン
    const t1 = setTimeout(() => setEyewearVisible(true),  500);
    // ② +1300ms: EYEWEAR フェードアウト
    const t2 = setTimeout(() => setEyewearOut(true),      1300);
    // ③ +1750ms: CMMN. フェードアウト
    const t3 = setTimeout(() => setLogoOut(true),         1750);
    // ④ +2200ms: オーバーレイ自体をフェードアウト
    const t4 = setTimeout(() => setOverlayOut(true),      2200);
    // ⑤ +2900ms: DOMから除去
    const t5 = setTimeout(() => setDone(true),            2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         9999,
        backgroundColor:"#060b14",
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        opacity:        overlayOut ? 0 : 1,
        transition:     overlayOut ? "opacity 0.7s cubic-bezier(0.4,0,0.2,1)" : "none",
        pointerEvents:  overlayOut ? "none" : "all",
      }}
    >
      {/* CMMN. */}
      <span
        style={{
          fontWeight:    900,
          textTransform: "uppercase",
          color:         "#ffffff",
          lineHeight:    1,
          letterSpacing: "0.12em",
          fontSize:      "clamp(3.5rem, 12vw, 10rem)",
          textShadow:    "0 0 60px rgba(100,140,255,0.25)",
          opacity:       logoOut ? 0 : 1,
          transition:    logoOut ? "opacity 0.45s cubic-bezier(0.4,0,0.2,1)" : "none",
        }}
      >
        CMMN.
      </span>

      {/* EYEWEAR */}
      <span
        style={{
          fontWeight:    300,
          textTransform: "uppercase",
          color:         "rgba(255,255,255,0.72)",
          lineHeight:    1,
          letterSpacing: "0.55em",
          fontSize:      "clamp(0.65rem, 1.4vw, 1rem)",
          marginTop:     "1.4rem",
          opacity:       eyewearVisible && !eyewearOut ? 1 : 0,
          transition:    "opacity 0.6s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        EYEWEAR
      </span>
    </div>
  );
}

const HeroScene = dynamic(() => import("./components/HeroScene"), { ssr: false });
import ShowroomSection from "./components/ShowroomSection";

// スクロールで静かに現れる — 全セクション共通
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms,
                     transform 1.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const BG = "#060b14";

export default function Home() {
  return (
    <main style={{ backgroundColor: BG }}>
      <IntroOverlay />

      {/* ════════════════════════════════════════
          I.  HERO
          写真がブランドになる瞬間
      ════════════════════════════════════════ */}
      <div className="relative h-screen overflow-hidden">
        <HeroScene />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
          {/* CMMN. ロゴ — 変更禁止 */}
          <h1
            className="font-black uppercase text-white leading-none"
            style={{
              fontSize: "clamp(3.5rem, 12vw, 10rem)",
              letterSpacing: "0.12em",
              textShadow: "0 0 60px rgba(100,140,255,0.25)",
            }}
          >
            CMMN.
          </h1>
          <div className="mt-6 h-px w-20" style={{ backgroundColor: "rgba(255,255,255,0.18)" }} />
          <p
            className="mt-8 uppercase font-light"
            style={{
              color: "rgba(255,255,255,0.16)",
              fontSize: "0.6rem",
              letterSpacing: "0.65em",
            }}
          >
            Scroll to explore
          </p>
        </div>
      </div>


      {/* ════════════════════════════════════════
          II.  MANIFESTO
          沈黙と余白でブランドを語る
      ════════════════════════════════════════ */}
      <section
        style={{
          backgroundColor: BG,
          paddingTop:    "clamp(9rem, 20vw, 22rem)",
          paddingBottom: "clamp(9rem, 20vw, 22rem)",
          paddingLeft:   "clamp(1.5rem, 8vw, 10rem)",
          paddingRight:  "clamp(1.5rem, 8vw, 10rem)",
          position: "relative",
        }}
      >
        {/* ヒーローの青みをターンテーブルまで引き込むグラデーション */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(18,38,80,0.28) 0%, rgba(10,22,50,0.12) 35%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Reveal>
          <h2
            className="uppercase font-black text-white"
            style={{
              fontSize: "clamp(3rem, 9vw, 10rem)",
              letterSpacing: "0.04em",
              lineHeight: 0.88,
              opacity: 0.93,
            }}
          >
            Not for<br />everyone.
          </h2>
        </Reveal>

        <Reveal delay={220}>
          <p
            className="mt-12 font-light"
            style={{
              color: "rgba(255,255,255,0.28)",
              fontSize: "clamp(0.72rem, 1.1vw, 0.88rem)",
              letterSpacing: "0.16em",
              lineHeight: 2.1,
              maxWidth: "20rem",
            }}
          >
            For those who choose to see<br />
            the world from a different angle.
          </p>
        </Reveal>

        {/* ── おすすめ商品 ── */}
        <Reveal delay={400}>
          <div style={{ marginTop: "clamp(5rem, 10vw, 8rem)" }}>
            {/* ラベル */}
            <p style={{
              color: "rgba(255,255,255,0.2)",
              fontSize: "0.48rem",
              letterSpacing: "0.6em",
              textTransform: "uppercase",
              fontWeight: 300,
              marginBottom: "2rem",
            }}>
              Our Pick
            </p>

            <Link href="/products/kova-03" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "clamp(2rem, 6vw, 5rem)" }}>
              {/* 商品画像 */}
              <div style={{
                flexShrink: 0,
                width: "clamp(10rem, 28vw, 20rem)",
                aspectRatio: "1 / 1",
                backgroundColor: "#0d1120",
                overflow: "hidden",
                position: "relative",
              }}>
                <div aria-hidden="true" style={{
                  position: "absolute", inset: 0,
                  background: "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(80,105,160,0.12) 0%, transparent 70%)",
                  pointerEvents: "none",
                }} />
                <img
                  src="/products/kova-03-c1.jpg"
                  alt="KOVA / 03"
                  style={{
                    width: "100%", height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)",
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                />
              </div>

              {/* テキスト */}
              <div>
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.44rem", letterSpacing: "0.5em", textTransform: "uppercase", fontWeight: 300, margin: "0 0 0.6rem" }}>
                  KOVA / 03
                </p>
                <h3 style={{
                  color: "#ffffff",
                  fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
                  fontWeight: 900,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  lineHeight: 0.95,
                  margin: "0 0 1.2rem",
                }}>
                  KOVA<br />03.
                </h3>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "clamp(0.65rem, 1vw, 0.8rem)", letterSpacing: "0.06em", lineHeight: 1.8, fontWeight: 300, margin: "0 0 1.8rem", maxWidth: "16rem" }}>
                  Bold oval frame.<br />Sporty streetwear.
                </p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", letterSpacing: "0.06em", fontWeight: 300, margin: "0 0 1.6rem" }}>
                  ¥5,980
                </p>
                <span style={{
                  display: "inline-block",
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "0.46rem",
                  letterSpacing: "0.5em",
                  textTransform: "uppercase",
                  fontWeight: 400,
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                  paddingBottom: "0.15rem",
                }}>
                  View →
                </span>
              </div>
            </Link>
          </div>
        </Reveal>
      </section>






      {/* ════════════════════════════════════════
          V.  SHOWROOM
          デジタル旗艦店 — ギャラリー空間
      ════════════════════════════════════════ */}
      <ShowroomSection />

    </main>
  );
}
