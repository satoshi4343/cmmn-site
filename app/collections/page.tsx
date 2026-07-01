"use client";

import { useState } from "react";
import Link from "next/link";
import { SERIES_LIST, getSeriesProducts, type Series, type Product } from "../lib/products";

const BG = "#060b14";

// ─── 商品カード ────────────────────────────────────────────
function Card({ product }: { product: Product }) {
  const img = product.variants[product.defaultVariantIndex]?.image
    ?? product.variants.find(v => v.image)?.image
    ?? null;
  const allSoldOut = product.variants.every(v => v.soldOut);

  return (
    <Link href={`/products/${product.id}`} style={{ textDecoration: "none", display: "block" }}>
      {/* 画像エリア */}
      <div style={{
        width: "100%", aspectRatio: "1 / 1",
        backgroundColor: "#0d1120",
        overflow: "hidden", position: "relative",
        marginBottom: "0.7rem",
      }}>
        {img ? (
          <img src={img} alt={product.code}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "0.42rem", letterSpacing: "0.4em", color: "rgba(255,255,255,0.06)", textTransform: "uppercase" }}>
              {product.code}
            </span>
          </div>
        )}
        {allSoldOut && (
          <div style={{
            position: "absolute", top: "0.5rem", right: "0.5rem",
            backgroundColor: "rgba(0,0,0,0.6)", color: "rgba(255,255,255,0.5)",
            fontSize: "0.36rem", letterSpacing: "0.3em", textTransform: "uppercase", padding: "0.2rem 0.4rem",
          }}>
            Sold Out
          </div>
        )}
      </div>

      {/* テキスト */}
      <p style={{ margin: "0 0 0.2rem", fontSize: "0.42rem", letterSpacing: "0.45em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", fontWeight: 300 }}>
        {product.code}
      </p>
      <p style={{ margin: "0 0 0.25rem", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.06em", color: "rgba(255,255,255,0.82)", textTransform: "uppercase" }}>
        {product.series} {product.number}
      </p>
      <p style={{ margin: 0, fontSize: "0.68rem", color: allSoldOut ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.45)", fontWeight: 300 }}>
        {allSoldOut ? "Sold out" : product.price}
      </p>
    </Link>
  );
}

// ─── タブ ─────────────────────────────────────────────────
function Tabs({ active, onChange }: { active: Series; onChange: (s: Series) => void }) {
  return (
    <div style={{
      display: "flex",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      backgroundColor: BG,
      position: "sticky", top: "44px", zIndex: 10,
      overflowX: "auto",
    }}>
      {SERIES_LIST.map(s => (
        <button key={s} onClick={() => onChange(s)} style={{
          flex: "none",
          padding: "0.85rem 1.2rem",
          background: "none", border: "none",
          borderBottom: `2px solid ${s === active ? "rgba(255,255,255,0.82)" : "transparent"}`,
          marginBottom: "-1px",
          fontSize: "0.5rem", letterSpacing: "0.5em", textTransform: "uppercase",
          fontWeight: s === active ? 600 : 300,
          color: s === active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.26)",
          cursor: "pointer", fontFamily: "inherit",
          transition: "color 0.2s, border-color 0.2s",
        }}>
          {s}
        </button>
      ))}
    </div>
  );
}

// ─── メインページ ──────────────────────────────────────────
export default function CollectionsPage() {
  const [active, setActive] = useState<Series>("ALL");
  const products = getSeriesProducts(active);

  return (
    <>
      <style>{`
        .mob-col { display: block; }
        .mob-col-redirect { display: none; }
        @media (min-width: 701px) {
          .mob-col { display: none; }
          .mob-col-redirect { display: flex; }
        }
      `}</style>

      {/* モバイル版 */}
      <main className="mob-col" style={{ backgroundColor: BG, minHeight: "100vh" }}>

        {/* ヘッダー */}
        <div style={{
          position: "sticky", top: 0, zIndex: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          height: "44px",
          backgroundColor: "rgba(6,11,20,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <Link href="/" style={{
            position: "absolute", left: "1rem",
            textDecoration: "none", color: "rgba(255,255,255,0.5)",
            fontSize: "1.1rem", lineHeight: 1,
          }}>
            ‹
          </Link>
          <span style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            CMMN.
          </span>
        </div>

        {/* タブ */}
        <Tabs active={active} onChange={setActive} />

        {/* グリッド */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(1rem,3vw,1.8rem) clamp(0.6rem,2vw,1.2rem)",
          padding: "1.2rem",
        }}>
          {products.map(p => (
            <Card key={p.id} product={p} />
          ))}
        </div>
      </main>

      {/* PC版リダイレクト */}
      <main className="mob-col-redirect" style={{
        minHeight: "100vh", backgroundColor: BG,
        alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "2rem",
      }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.55rem", letterSpacing: "0.5em", textTransform: "uppercase" }}>
          View collections on the main page
        </p>
        <Link href="/#collection" style={{
          color: "#fff", fontSize: "0.5rem", letterSpacing: "0.45em",
          textTransform: "uppercase", textDecoration: "none",
          borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: "0.2rem",
        }}>
          Go to Collections →
        </Link>
      </main>
    </>
  );
}
