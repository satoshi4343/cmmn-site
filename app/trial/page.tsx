"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// ── ホログラム台座 + モニター演出 ──
function StoreTransition({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"store" | "exit">("store");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("exit"), 4000);
    const t2 = setTimeout(onDone, 5400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  const exit = () => { setPhase("exit"); setTimeout(onDone, 1400); };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "linear-gradient(180deg, #d8d8d8 0%, #e8e8e8 50%, #d0d0d0 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      opacity: phase === "exit" ? 0 : 1,
      transition: phase === "exit" ? "opacity 1.4s cubic-bezier(0.4,0,0.2,1)" : "none",
      pointerEvents: phase === "exit" ? "none" : "all",
      overflow: "hidden",
    }}>

      {/* ── 縦のシアンビーム（モニター上下を貫く） ── */}
      <div style={{
        position: "absolute", top: 0, bottom: 0,
        left: "50%", transform: "translateX(-50%)",
        width: "6px",
        background: "linear-gradient(180deg, transparent 0%, rgba(0,220,220,0.7) 20%, rgba(0,220,220,0.9) 50%, rgba(0,220,220,0.7) 80%, transparent 100%)",
        filter: "blur(3px)",
        pointerEvents: "none",
      }} />
      {/* ビームのコアライン */}
      <div style={{
        position: "absolute", top: 0, bottom: 0,
        left: "50%", transform: "translateX(-50%)",
        width: "2px",
        background: "linear-gradient(180deg, transparent 0%, rgba(180,255,255,0.9) 25%, #ffffff 50%, rgba(180,255,255,0.9) 75%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* ── モニター（スクリーン枠） ── */}
      <div style={{
        position: "relative",
        width: "clamp(280px, 72vw, 680px)",
        zIndex: 2,
        marginBottom: "0",
      }}>
        {/* スクリーン本体 */}
        <div style={{
          position: "relative",
          aspectRatio: "16 / 9",
          backgroundColor: "#000",
          boxShadow: "0 0 0 3px #bbb, 0 0 0 5px #999, 0 8px 40px rgba(0,0,0,0.4), 0 0 60px rgba(0,220,220,0.15)",
          overflow: "hidden",
        }}>
          {/* 店舗写真 */}
          <img
            src="/store-bg.jpg"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
          />


          {/* NIKE ロゴ部分（上部黒帯）を隠す */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: "22%",
            backgroundColor: "#111",
          }} />

          {/* CMMN. ロゴ */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: "22%",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "0.7rem",
          }}>
            <span style={{
              color: "#fff",
              fontSize: "clamp(1rem, 3.5vw, 2.8rem)",
              fontWeight: 900,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}>
              CMMN.
            </span>
          </div>

          {/* START NOW ボタン */}
          <button
            onClick={exit}
            style={{
              position: "absolute", bottom: "8%", left: "50%",
              transform: "translateX(-50%)",
              padding: "0.35rem 1.4rem",
              backgroundColor: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.6)",
              color: "#fff",
              fontSize: "clamp(0.35rem, 0.8vw, 0.5rem)",
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              fontWeight: 400,
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.3)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.15)"}
          >
            Start Now
          </button>

          {/* スクリーングレア */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)",
          }} />
        </div>

        {/* モニタースタンド（細い首） */}
        <div style={{
          width: "6px", height: "clamp(10px, 2vw, 20px)",
          backgroundColor: "#aaa",
          margin: "0 auto",
        }} />
        {/* スタンドベース */}
        <div style={{
          width: "clamp(40px, 8vw, 80px)", height: "4px",
          backgroundColor: "#999",
          margin: "0 auto",
          borderRadius: "2px",
        }} />
      </div>

      {/* ── ホログラム台座 ── */}
      <div style={{ position: "relative", width: "clamp(200px, 55vw, 520px)", zIndex: 1, marginTop: "-1px" }}>

        {/* 台座上段 */}
        <div style={{
          width: "65%", height: "clamp(12px, 2.5vw, 22px)",
          margin: "0 auto",
          background: "linear-gradient(180deg, #e0e0e0 0%, #c8c8c8 100%)",
          borderRadius: "4px 4px 0 0",
          boxShadow: "0 -2px 12px rgba(0,220,220,0.3), inset 0 1px 0 rgba(255,255,255,0.5)",
        }} />

        {/* 台座中段 */}
        <div style={{
          width: "85%", height: "clamp(16px, 3vw, 28px)",
          margin: "0 auto",
          background: "linear-gradient(180deg, #d8d8d8 0%, #c0c0c0 100%)",
          boxShadow: "0 0 20px rgba(0,220,220,0.25), inset 0 1px 0 rgba(255,255,255,0.4)",
        }} />

        {/* 台座下段（最大） */}
        <div style={{
          width: "100%", height: "clamp(20px, 4vw, 38px)",
          background: "linear-gradient(180deg, #d0d0d0 0%, #b8b8b8 100%)",
          borderRadius: "0 0 6px 6px",
          boxShadow: "0 4px 30px rgba(0,0,0,0.18), 0 0 40px rgba(0,220,220,0.35)",
          position: "relative", overflow: "hidden",
        }}>
          {/* シアングロー帯 */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, transparent 0%, rgba(0,220,220,0.18) 30%, rgba(0,220,220,0.35) 50%, rgba(0,220,220,0.18) 70%, transparent 100%)",
          }} />
        </div>

        {/* 床面の反射 */}
        <div style={{
          width: "80%", height: "clamp(30px, 5vw, 50px)",
          margin: "0 auto",
          background: "linear-gradient(180deg, rgba(0,220,220,0.12) 0%, transparent 100%)",
          filter: "blur(6px)",
          borderRadius: "50%",
          transform: "scaleY(0.4)",
          transformOrigin: "top",
        }} />
      </div>
    </div>
  );
}

const PRODUCTS = [
  // ─── CORE ───
  { id: "core-01", code: "CORE / 01", series: "CORE", price: "¥7,980", image: "/products/core-01-c1.jpg" },
  { id: "core-02", code: "CORE / 02", series: "CORE", price: "¥7,980", image: "/products/core-02-c1.jpg" },
  { id: "core-03", code: "CORE / 03", series: "CORE", price: "¥7,980", image: "/products/core-03-c1.jpg" },
  { id: "core-04", code: "CORE / 04", series: "CORE", price: "¥7,980", image: "/products/core-04-c1.jpg" },
  // ─── KOVA ───
  { id: "kova-01", code: "KOVA / 01", series: "KOVA", price: "¥4,980", image: "/products/kova-01-c1.jpg" },
  { id: "kova-02", code: "KOVA / 02", series: "KOVA", price: "¥4,980", image: "/products/kova-02-c1.jpg" },
  { id: "kova-03", code: "KOVA / 03", series: "KOVA", price: "¥4,980", image: "/products/kova-03-c1.jpg" },
  { id: "kova-04", code: "KOVA / 04", series: "KOVA", price: "¥4,980", image: "/products/kova-04-c1.jpg" },
  // ─── VOID ───
  { id: "void-01", code: "VOID / 01", series: "VOID", price: "¥5,980", image: "/products/void-01-c1.png" },
  { id: "void-02", code: "VOID / 02", series: "VOID", price: "¥5,980", image: "/products/void-02-c1.jpg" },
  { id: "void-03", code: "VOID / 03", series: "VOID", price: "¥5,980", image: "/products/void-03-c1.jpg" },
  { id: "void-04", code: "VOID / 04", series: "VOID", price: "¥5,980", image: "/products/void-04-c1.jpg" },
];

const SERIES = ["CORE", "KOVA", "VOID"] as const;

function Carousel({ series }: { series: string }) {
  const items = PRODUCTS.filter(p => p.series === series);
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(1);

  const scroll = (dir: "prev" | "next") => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector("[data-card]") as HTMLElement;
    const w = card ? card.offsetWidth + 24 : 300;
    el.scrollBy({ left: dir === "next" ? w : -w, behavior: "smooth" });
    setActive(a => dir === "next" ? Math.min(a + 1, items.length) : Math.max(a - 1, 1));
  };

  return (
    <div style={{ position: "relative" }}>
      {/* カード列 */}
      <div
        ref={ref}
        style={{
          display: "flex",
          gap: "1.5rem",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          padding: "0.5rem 0 2rem",
        }}
      >
        {items.map((p, i) => (
          <Link key={p.id} href={`/products/${p.id}`}
            data-card
            style={{
              flexShrink: 0,
              width: "clamp(220px, 28vw, 320px)",
              scrollSnapAlign: "start",
              textDecoration: "none",
              display: "block",
            }}
          >
            <div style={{
              backgroundColor: "#f5f5f3",
              aspectRatio: "1 / 1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
              marginBottom: "1rem",
              transition: "transform 0.3s ease",
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "translateY(0)"}
            >
              <img
                src={p.image}
                alt={p.code}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            </div>
            <p style={{ color: "#999", fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", margin: "0 0 0.25rem", fontWeight: 300 }}>
              {p.series}
            </p>
            <p style={{ color: "#111", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 0.2rem" }}>
              {p.code}
            </p>
            <p style={{ color: "#555", fontSize: "0.75rem", fontWeight: 300, margin: 0 }}>
              {p.price}
            </p>
          </Link>
        ))}
      </div>

      {/* ナビゲーション矢印 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.5rem" }}>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {items.map((_, i) => (
            <div key={i} style={{
              width: i + 1 === active ? "1.4rem" : "0.4rem",
              height: "0.4rem",
              borderRadius: "99px",
              backgroundColor: i + 1 === active ? "#111" : "#ccc",
              transition: "width 0.3s, background-color 0.3s",
            }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {(["prev", "next"] as const).map(dir => (
            <button
              key={dir}
              onClick={() => scroll(dir)}
              style={{
                width: "2.4rem", height: "2.4rem",
                borderRadius: "50%",
                border: "1px solid #ddd",
                backgroundColor: "transparent",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem", color: "#333",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#111"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#333"; }}
            >
              {dir === "prev" ? "‹" : "›"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TrialPage() {
  const [activeTab, setActiveTab] = useState<"CORE" | "KOVA" | "VOID" | "ALL">("ALL");
  const [showHero, setShowHero] = useState(true);

  return (
    <main style={{ backgroundColor: "#fff", minHeight: "100vh", fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
      {showHero && <StoreTransition onDone={() => setShowHero(false)} />}

      {/* ── ナビ ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        backgroundColor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid #eee",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1rem clamp(1.5rem,5vw,4rem)",
      }}>
        <div style={{ display: "flex", gap: "2rem" }}>
          {["Home", "Shop", "Collections"].map(l => (
            <span key={l} style={{ color: "#555", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ color: "#111", fontSize: "1.2rem", fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            CMMN.
          </span>
        </Link>
        <div style={{ display: "flex", gap: "2rem" }}>
          {["About Us", "Store"].map(l => (
            <span key={l} style={{ color: "#555", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </nav>

      {/* ── ヒーロー ── */}
      <section style={{
        padding: "clamp(4rem,10vw,8rem) clamp(1.5rem,5vw,4rem) clamp(3rem,6vw,5rem)",
        borderBottom: "1px solid #eee",
      }}>
        <p style={{ color: "#aaa", fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", margin: "0 0 1.2rem", fontWeight: 300 }}>
          SS 2025 Collection
        </p>
        <h1 style={{ color: "#111", fontSize: "clamp(3rem,9vw,9rem)", fontWeight: 900, letterSpacing: "0.02em", textTransform: "uppercase", lineHeight: 0.9, margin: "0 0 2rem" }}>
          New<br />Arrivals.
        </h1>
        <p style={{ color: "#888", fontSize: "clamp(0.7rem,1.2vw,0.9rem)", fontWeight: 300, letterSpacing: "0.1em", maxWidth: "32ch", lineHeight: 1.8 }}>
          Sharp silhouettes. Cold energy.<br />
          Y2K, redefined for now.
        </p>
      </section>

      {/* ── タブ ── */}
      <section style={{ padding: "2rem clamp(1.5rem,5vw,4rem) 0", borderBottom: "1px solid #eee" }}>
        <div style={{ display: "flex", gap: "0" }}>
          {(["ALL", "CORE", "KOVA", "VOID"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "0.9rem 1.6rem",
                background: "none", border: "none",
                borderBottom: activeTab === tab ? "2px solid #111" : "2px solid transparent",
                color: activeTab === tab ? "#111" : "#bbb",
                fontSize: "0.56rem", letterSpacing: "0.4em", textTransform: "uppercase",
                fontWeight: activeTab === tab ? 700 : 300,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "color 0.2s, border-color 0.2s",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* ── 商品 ── */}
      <section style={{ padding: "3rem clamp(1.5rem,5vw,4rem) 6rem" }}>
        {activeTab === "ALL" ? (
          SERIES.map(s => (
            <div key={s} style={{ marginBottom: "4rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1.5rem" }}>
                <h2 style={{ color: "#111", fontSize: "clamp(1.2rem,3vw,2rem)", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>
                  {s} Series
                </h2>
                <span style={{ color: "#ccc", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>
                  {s === "CORE" ? "¥7,980" : s === "KOVA" ? "¥4,980" : "¥5,980"}
                </span>
              </div>
              <Carousel series={s} />
            </div>
          ))
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1.5rem" }}>
              <h2 style={{ color: "#111", fontSize: "clamp(1.2rem,3vw,2rem)", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>
                {activeTab} Series
              </h2>
            </div>
            <Carousel series={activeTab} />
          </div>
        )}
      </section>

      {/* ── フッター ── */}
      <footer style={{
        borderTop: "1px solid #eee",
        padding: "2rem clamp(1.5rem,5vw,4rem)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ color: "#ccc", fontSize: "0.5rem", letterSpacing: "0.4em", textTransform: "uppercase" }}>
          © 2025 CMMN.
        </span>
        <span style={{ color: "#ccc", fontSize: "0.5rem", letterSpacing: "0.5em", textTransform: "uppercase" }}>
          Not loud. Not ordinary. Just CMMN.
        </span>
        <Link href="/" style={{ color: "#aaa", fontSize: "0.5rem", letterSpacing: "0.4em", textTransform: "uppercase", textDecoration: "none" }}>
          ← Back to main site
        </Link>
      </footer>

      {/* ── 試し用ラベル ── */}
      <div style={{
        position: "fixed", bottom: "1.5rem", right: "1.5rem",
        backgroundColor: "#111", color: "#fff",
        fontSize: "0.45rem", letterSpacing: "0.3em", textTransform: "uppercase",
        padding: "0.5rem 0.9rem", borderRadius: "2px",
        opacity: 0.6, pointerEvents: "none",
      }}>
        Trial Page
      </div>
    </main>
  );
}
