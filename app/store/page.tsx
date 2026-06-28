"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const StoreScene = dynamic(() => import("../components/StoreScene"), { ssr: false });

export default function StorePage() {
  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "#111", position: "relative", overflow: "hidden" }}>

      {/* 左上 — Exit */}
      <div style={{ position: "absolute", top: "1.5rem", left: "1.5rem", zIndex: 20 }}>
        <Link href="/" style={{
          color: "rgba(255,255,255,0.45)", fontSize: "0.46rem", letterSpacing: "0.45em",
          textTransform: "uppercase", textDecoration: "none",
        }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#fff")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)")}
        >
          ← Exit Store
        </Link>
      </div>

      {/* 中央上 — ブランド */}
      <div style={{ position: "absolute", top: "1.4rem", left: "50%", transform: "translateX(-50%)", zIndex: 20 }}>
        <span style={{ color: "#fff", fontSize: "1rem", fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          CMMN.
        </span>
      </div>

      {/* 下 — 操作ヒント */}
      <div style={{
        position: "absolute", bottom: "1.8rem", left: "50%", transform: "translateX(-50%)",
        zIndex: 20, textAlign: "center", pointerEvents: "none",
      }}>
        <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.43rem", letterSpacing: "0.4em", textTransform: "uppercase", margin: 0 }}>
          Drag to look around · Click product to view
        </p>
      </div>

      {/* 3Dシーン */}
      <StoreScene />
    </div>
  );
}
