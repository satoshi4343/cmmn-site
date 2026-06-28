"use client";

import { useState } from "react";
import Link from "next/link";
import { ALL_PRODUCTS, SERIES_LIST, getSeriesProducts, type Series, type Product } from "../lib/products";

// ─── 商品カード ────────────────────────────────────────────
function MobileCard({ product }: { product: Product }) {
  const img = product.variants[product.defaultVariantIndex]?.image
    ?? product.variants.find(v => v.image)?.image
    ?? null;
  const allSoldOut = product.variants.every(v => v.soldOut);

  return (
    <Link href={`/products/${product.id}`} style={{ textDecoration: "none", display: "block" }}>
      {/* 画像エリア */}
      <div style={{
        width: "100%",
        aspectRatio: "1 / 1",
        backgroundColor: "#f5f5f5",
        overflow: "hidden",
        position: "relative",
      }}>
        {img ? (
          <img
            src={img}
            alt={product.code}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: "0.45rem", letterSpacing: "0.4em", color: "#bbb", textTransform: "uppercase" }}>
              Coming Soon
            </span>
          </div>
        )}
        {allSoldOut && (
          <div style={{
            position: "absolute", top: "0.5rem", right: "0.5rem",
            backgroundColor: "rgba(0,0,0,0.55)",
            color: "#fff", fontSize: "0.38rem", letterSpacing: "0.3em",
            textTransform: "uppercase", padding: "0.2rem 0.4rem",
          }}>
            Sold Out
          </div>
        )}
      </div>

      {/* テキスト */}
      <div style={{ padding: "0.6rem 0.2rem 1rem" }}>
        <p style={{ margin: "0 0 0.15rem", fontSize: "0.42rem", letterSpacing: "0.35em", color: "#999", textTransform: "uppercase", fontWeight: 300 }}>
          {product.series} / {product.number}
        </p>
        <p style={{ margin: "0 0 0.25rem", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.04em", color: "#111", textTransform: "uppercase" }}>
          {product.series} {product.number}
        </p>
        <p style={{ margin: 0, fontSize: "0.7rem", color: allSoldOut ? "#aaa" : "#222", fontWeight: 300, letterSpacing: "0.02em" }}>
          {allSoldOut ? "Sold out" : product.price}
        </p>
      </div>
    </Link>
  );
}

// ─── タブ ─────────────────────────────────────────────────
function Tabs({ active, onChange }: { active: Series; onChange: (s: Series) => void }) {
  return (
    <div style={{
      display: "flex",
      borderBottom: "1px solid #e5e5e5",
      backgroundColor: "#fff",
      position: "sticky",
      top: "44px",
      zIndex: 10,
      overflowX: "auto",
    }}>
      {SERIES_LIST.map(s => (
        <button
          key={s}
          onClick={() => onChange(s)}
          style={{
            flex: "none",
            padding: "0.7rem 1.2rem",
            background: "none",
            border: "none",
            borderBottom: `2px solid ${s === active ? "#111" : "transparent"}`,
            marginBottom: "-1px",
            fontSize: "0.48rem",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            fontWeight: s === active ? 700 : 400,
            color: s === active ? "#111" : "#aaa",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "color 0.2s, border-color 0.2s",
          }}
        >
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
      {/* モバイルのみ表示 */}
      <style>{`
        .mobile-collections { display: block; }
        .mobile-collections-redirect { display: none; }
        @media (min-width: 701px) {
          .mobile-collections { display: none; }
          .mobile-collections-redirect { display: flex; }
        }
      `}</style>

      {/* ─── モバイル版 ─── */}
      <main className="mobile-collections" style={{ backgroundColor: "#fff", minHeight: "100vh" }}>

        {/* ヘッダー */}
        <div style={{
          position: "sticky", top: 0, zIndex: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          height: "44px",
          backgroundColor: "#fff",
          borderBottom: "1px solid #e5e5e5",
        }}>
          {/* 戻るボタン */}
          <Link href="/" style={{
            position: "absolute", left: "1rem",
            display: "flex", alignItems: "center", gap: "0.3rem",
            textDecoration: "none", color: "#111",
            fontSize: "0.55rem", letterSpacing: "0.1em",
          }}>
            <span style={{ fontSize: "1rem", lineHeight: 1 }}>‹</span>
          </Link>

          {/* ブランド名 */}
          <span style={{
            fontSize: "0.9rem", fontWeight: 900,
            letterSpacing: "0.14em", textTransform: "uppercase", color: "#111",
          }}>
            CMMN.
          </span>
        </div>

        {/* タブ */}
        <Tabs active={active} onChange={setActive} />

        {/* グリッド */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0",
          borderTop: "1px solid #e5e5e5",
        }}>
          {products.map((p, i) => (
            <div key={p.id} style={{
              borderRight: i % 2 === 0 ? "1px solid #e5e5e5" : "none",
              borderBottom: "1px solid #e5e5e5",
              padding: "0 0.5rem",
            }}>
              <MobileCard product={p} />
            </div>
          ))}
        </div>
      </main>

      {/* ─── PC版：ホームのコレクションへリダイレクト ─── */}
      <main className="mobile-collections-redirect" style={{
        minHeight: "100vh", backgroundColor: "#060b14",
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
