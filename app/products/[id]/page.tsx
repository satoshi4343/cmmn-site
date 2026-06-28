"use client";

import { use, useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { getProduct, ALL_PRODUCTS, type Product } from "../../lib/products";
import ShopifyBuyButton from "../../components/ShopifyBuyButton";

const BG = "#060b14";

// ─────────────────────────────────────────────────────────
//  画像 — エラー時はプレースホルダーボックスを表示
// ─────────────────────────────────────────────────────────
function ProductImage({
  src, alt, style, onClick,
}: {
  src: string | null; alt: string;
  style?: React.CSSProperties; onClick?: () => void;
}) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        onClick={onClick}
        style={{
          width: "100%", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          backgroundColor: "#0d1120",
          cursor: onClick ? "zoom-in" : "default",
          ...style,
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.08)", fontSize: "0.5rem", letterSpacing: "0.6em", textTransform: "uppercase" }}>
          Photo coming soon
        </span>
      </div>
    );
  }

  return (
    <img
      src={src} alt={alt}
      onClick={onClick}
      onError={() => setErrored(true)}
      style={{
        width: "100%", height: "100%",
        objectFit: "contain",
        display: "block",
        cursor: onClick ? "zoom-in" : "default",
        ...style,
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────
//  全画面モーダル（ライトボックス）
// ─────────────────────────────────────────────────────────
function LightboxModal({
  product, initialIndex, onClose,
}: {
  product: Product; initialIndex: number; onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);
  const touchStartX = useRef(0);
  const total = product.variants.length;
  const current = product.variants[idx];

  const prev = useCallback(() => setIdx(i => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setIdx(i => (i + 1) % total), [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        backgroundColor: "rgba(2,4,12,0.97)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}
    >
      {/* 閉じるボタン */}
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: "1.5rem", right: "1.8rem",
          background: "none", border: "none", cursor: "pointer",
          color: "rgba(255,255,255,0.4)", fontSize: "1.6rem", lineHeight: 1,
          padding: "0.5rem", zIndex: 10,
          transition: "color 0.2s",
        }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#fff")}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)")}
      >
        ✕
      </button>

      {/* 画像エリア */}
      <div
        onClick={e => e.stopPropagation()}
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (dx > 50) prev();
          else if (dx < -50) next();
        }}
        style={{
          width: "min(88vw, 820px)",
          aspectRatio: "1 / 1",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}
      >
        {current.image ? (
          <img
            src={current.image}
            alt={`${product.code} ${current.label}`}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.12)", fontSize: "0.5rem", letterSpacing: "0.6em", textTransform: "uppercase" }}>
              Photo coming soon
            </span>
          </div>
        )}
      </div>

      {/* カラーラベル */}
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.52rem", letterSpacing: "0.42em", textTransform: "uppercase", fontWeight: 300, marginTop: "1.5rem" }}>
        {current.label} — {current.name}
      </p>

      {/* ドットインジケーター */}
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        {product.variants.map((_, i) => (
          <button
            key={i}
            onClick={e => { e.stopPropagation(); setIdx(i); }}
            style={{
              width: i === idx ? "1.6rem" : "0.45rem",
              height: "0.45rem",
              borderRadius: "999px",
              backgroundColor: i === idx ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
              border: "none", cursor: "pointer", padding: 0,
              transition: "width 0.3s ease, background-color 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* 左右矢印 */}
      {total > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); prev(); }}
            style={{
              position: "absolute", left: "clamp(1rem,3vw,2.5rem)", top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.55)", width: "2.8rem", height: "2.8rem",
              borderRadius: "50%", cursor: "pointer", fontSize: "1rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.14)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
          >
            ‹
          </button>
          <button
            onClick={e => { e.stopPropagation(); next(); }}
            style={{
              position: "absolute", right: "clamp(1rem,3vw,2.5rem)", top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.55)", width: "2.8rem", height: "2.8rem",
              borderRadius: "50%", cursor: "pointer", fontSize: "1rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.14)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  アコーディオン
// ─────────────────────────────────────────────────────────
function Accordion({ title, children, defaultOpen = false }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.1rem 0", background: "none", border: "none",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.52rem", letterSpacing: "0.55em", textTransform: "uppercase", fontWeight: 300, fontFamily: "inherit" }}>
          {title}
        </span>
        <span style={{
          color: "rgba(255,255,255,0.35)", fontSize: "0.9rem",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          transition: "transform 0.3s ease", display: "inline-block", lineHeight: 1,
        }}>
          +
        </span>
      </button>
      <div style={{
        maxHeight: open ? "400px" : "0",
        overflow: "hidden",
        transition: "max-height 0.45s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{ paddingBottom: "1.5rem" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  スペック行
// ─────────────────────────────────────────────────────────
function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "9.5rem 1fr",
      gap: "0.8rem",
      padding: "0.72rem 0",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <span style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.56rem", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 300 }}>
        {label}
      </span>
      <span style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.62rem", letterSpacing: "0.04em", fontWeight: 300, lineHeight: 1.6 }}>
        {value}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  メインページ
// ─────────────────────────────────────────────────────────
export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = getProduct(id);
  const [variantIdx, setVariantIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const related = ALL_PRODUCTS
    .filter(p => p.series === product?.series && p.id !== product?.id)
    .slice(0, 3);

  useEffect(() => {
    if (product) setVariantIdx(product.defaultVariantIndex);
  }, [product]);

  if (!product) {
    return (
      <main style={{ backgroundColor: BG, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.55rem", letterSpacing: "0.5em", textTransform: "uppercase", margin: "0 0 2rem" }}>
            Product not found
          </p>
          <Link href="/" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.5rem", letterSpacing: "0.45em", textTransform: "uppercase", textDecoration: "none" }}>
            ← Return home
          </Link>
        </div>
      </main>
    );
  }

  const variant = product.variants[variantIdx];
  const isSoldOut = !!variant?.soldOut;

  return (
    <main style={{ backgroundColor: BG, minHeight: "100vh", color: "#fff", fontFamily: "inherit", overflowX: "hidden" }}>

      {/* ─ ナビゲーション ─────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1rem clamp(1.5rem,5vw,4rem)",
        backgroundColor: "rgba(6,11,20,0.9)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ color: "#fff", fontSize: "clamp(0.9rem,2vw,1.1rem)", fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            CMMN.
          </span>
        </Link>
        <div style={{ display: "flex", gap: "clamp(1.2rem,3vw,2.5rem)" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.48rem", letterSpacing: "0.48em", textTransform: "uppercase", textDecoration: "none", fontWeight: 300 }}>
            Collection
          </Link>
          <Link href="/store" style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.48rem", letterSpacing: "0.48em", textTransform: "uppercase", textDecoration: "none", fontWeight: 300 }}>
            Store
          </Link>
        </div>
      </nav>

      {/* ─ パンくず ──────────────────────────────────────── */}
      <div style={{ paddingTop: "calc(56px + 1.5rem)", padding: "calc(56px + 1.5rem) clamp(1.5rem,5vw,4rem) 0" }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {[
            { label: "Home", href: "/" },
            { label: product.series },
            { label: product.code },
          ].map((item, i, arr) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {item.href ? (
                <Link href={item.href} style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.46rem", letterSpacing: "0.35em", textTransform: "uppercase", textDecoration: "none", fontWeight: 300 }}>
                  {item.label}
                </Link>
              ) : (
                <span style={{ color: i === arr.length - 1 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)", fontSize: "0.46rem", letterSpacing: "0.35em", textTransform: "uppercase", fontWeight: 300 }}>
                  {item.label}
                </span>
              )}
              {i < arr.length - 1 && (
                <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.5rem" }}>›</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* ─ メインレイアウト ───────────────────────────────── */}
      <style>{`
        @media (max-width: 700px) {
          .product-grid { grid-template-columns: 1fr !important; }
          .product-img-sticky { position: static !important; }
        }
      `}</style>
      <div className="product-grid" style={{
        display: "grid",
        gridTemplateColumns: "58fr 42fr",
        gap: "clamp(2rem,5vw,6rem)",
        maxWidth: "1360px",
        margin: "0 auto",
        padding: "clamp(2.5rem,5vw,5rem) clamp(1.5rem,5vw,4rem) clamp(4rem,8vw,7rem)",
        alignItems: "start",
      }}>

        {/* ── LEFT: 画像パネル（sticky） ─────────────────── */}
        <div className="product-img-sticky" style={{ position: "sticky", top: "calc(56px + 2rem)" }}>

          {/* メイン画像 */}
          <div
            style={{
              position: "relative",
              aspectRatio: "1 / 1",
              backgroundColor: "#0e1120",
              overflow: "hidden",
              cursor: "zoom-in",
            }}
            onClick={() => setModalOpen(true)}
          >
            {variant.image ? (
              <img
                src={variant.image}
                alt={`${product.code} ${variant.label}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.07)", fontSize: "0.5rem", letterSpacing: "0.6em", textTransform: "uppercase" }}>
                  Photo coming soon
                </span>
              </div>
            )}

            {/* ズームヒント */}
            <div style={{
              position: "absolute", bottom: "1rem", right: "1rem",
              color: "rgba(255,255,255,0.2)", fontSize: "0.44rem",
              letterSpacing: "0.38em", textTransform: "uppercase", fontWeight: 300,
              pointerEvents: "none",
            }}>
              Click to enlarge
            </div>
          </div>

          {/* カラー別サムネイル */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0.5rem",
            marginTop: "0.6rem",
          }}>
            {product.variants.map((v, i) => (
              <button
                key={v.label}
                onClick={() => setVariantIdx(i)}
                style={{
                  aspectRatio: "1 / 1",
                  backgroundColor: "#0e1120",
                  border: `1.5px solid ${i === variantIdx ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.08)"}`,
                  padding: "0.5rem",
                  cursor: "pointer",
                  overflow: "hidden",
                  position: "relative",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "border-color 0.25s ease",
                  outline: "none",
                }}
              >
                {v.image ? (
                  <img
                    src={v.image}
                    alt={v.name}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <span style={{ color: "rgba(255,255,255,0.12)", fontSize: "0.4rem", letterSpacing: "0.3em" }}>{v.label}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT: 商品情報 ────────────────────────────── */}
        <div>

          {/* シリーズ */}
          <p style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.5rem", letterSpacing: "0.65em", textTransform: "uppercase", fontWeight: 300, margin: "0 0 0.7rem" }}>
            {product.series} Series
          </p>

          {/* 商品コード */}
          <h1 style={{
            color: "#ffffff",
            fontSize: "clamp(2.4rem,4.5vw,4rem)",
            fontWeight: 900,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            lineHeight: 1.05,
            margin: "0 0 1rem",
          }}>
            {product.series} / {product.number}
          </h1>

          {/* 価格 */}
          <p style={{ color: "rgba(255,255,255,0.88)", fontSize: "1.4rem", letterSpacing: "0.04em", fontWeight: 400, margin: "0 0 2rem" }}>
            {product.price}
            <span style={{ fontSize: "0.46rem", color: "rgba(255,255,255,0.28)", letterSpacing: "0.3em", marginLeft: "0.7rem" }}>TAX INCL.</span>
          </p>

          {/* 区切り */}
          <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.07)", margin: "0 0 1.6rem" }} />

          {/* カラー選択 */}
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ color: "rgba(255,255,255,0.32)", fontSize: "0.48rem", letterSpacing: "0.45em", textTransform: "uppercase", fontWeight: 300, margin: "0 0 1rem" }}>
              Color:{" "}
              <span style={{ color: "rgba(255,255,255,0.78)" }}>{variant.label} — {variant.name}</span>
              {isSoldOut && (
                <span style={{ marginLeft: "0.9rem", color: "rgba(255,90,90,0.85)", fontSize: "0.42rem", letterSpacing: "0.3em" }}>
                  SOLD OUT
                </span>
              )}
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {product.variants.map((v, i) => {
                const isActive = i === variantIdx;
                return (
                  <button
                    key={v.label}
                    onClick={() => setVariantIdx(i)}
                    title={v.soldOut ? `${v.name} — SOLD OUT` : v.name}
                    style={{
                      position: "relative",
                      padding: "0.48rem 0.9rem 0.44rem",
                      border: `1px solid ${isActive ? "rgba(255,255,255,0.75)" : v.soldOut ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.16)"}`,
                      backgroundColor: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                      color: isActive
                        ? (v.soldOut ? "rgba(255,100,100,0.8)" : "#ffffff")
                        : v.soldOut ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.42)",
                      fontSize: "0.46rem",
                      letterSpacing: "0.38em",
                      textTransform: "uppercase",
                      fontWeight: isActive ? 600 : 300,
                      cursor: "pointer",
                      borderRadius: "2px",
                      fontFamily: "inherit",
                      transition: "border-color 0.2s, color 0.2s, background-color 0.2s",
                      outline: "none",
                      opacity: v.soldOut && !isActive ? 0.38 : 1,
                      boxShadow: isActive ? "inset 0 -1.5px 0 rgba(255,255,255,0.55)" : "none",
                      textDecoration: v.soldOut && !isActive ? "line-through" : "none",
                    }}
                  >
                    {v.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 区切り */}
          <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.07)", margin: "0 0 1.8rem" }} />

          {/* CTA ボタン */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", marginBottom: "2.2rem" }}>
            {isSoldOut ? (
              /* SOLD OUT */
              <div style={{
                display: "block", padding: "1.05rem",
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                textAlign: "center",
                fontSize: "0.52rem", letterSpacing: "0.55em",
                textTransform: "uppercase", fontWeight: 700,
                color: "rgba(255,255,255,0.25)", borderRadius: "2px",
                cursor: "not-allowed",
              }}>
                Sold Out
              </div>
            ) : (
              <>
                {/* Buy Now / Add to Cart — ShopifySDK（shopifyIdがある商品）またはフォールバック */}
                {product.shopifyId ? (
                  <>
                    <ShopifyBuyButton productId={product.shopifyId} buyNow />
                    <ShopifyBuyButton productId={product.shopifyId} />
                  </>
                ) : (
                  <a
                    href="https://vusyw0-rc.myshopify.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block", padding: "1.05rem",
                      backgroundColor: "#ffffff", color: "#060b14",
                      textAlign: "center", fontSize: "0.52rem",
                      letterSpacing: "0.55em", textTransform: "uppercase",
                      fontWeight: 700, textDecoration: "none",
                      borderRadius: "2px", transition: "background-color 0.25s ease",
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.88)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "#ffffff")}
                  >
                    Buy Now
                  </a>
                )}
              </>
            )}
          </div>

          {/* 区切り */}
          <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.07)", margin: "0 0 0.4rem" }} />

          {/* アコーディオン: Description */}
          <Accordion title="Description" defaultOpen>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.66rem", letterSpacing: "0.04em", lineHeight: 1.9, fontWeight: 300, margin: 0 }}>
              {product.description}
            </p>
          </Accordion>

          {/* アコーディオン: Details */}
          {product.detailRows.length > 0 && (
            <Accordion title="Details">
              <div>
                {product.detailRows.map(row => (
                  <SpecRow key={row.label} label={row.label} value={row.value} />
                ))}
              </div>
            </Accordion>
          )}

          {/* アコーディオン: Size */}
          {product.sizeRows.length > 0 && (
            <Accordion title="Size">
              <div>
                {product.sizeRows.map(row => (
                  <SpecRow key={row.label} label={row.label} value={row.value} />
                ))}
              </div>
            </Accordion>
          )}

          {/* アコーディオン: Colors */}
          <Accordion title="Colors">
            <div>
              {product.variants.map((v, i) => (
                <div key={v.label} style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "0.65rem 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  cursor: "pointer",
                }}
                  onClick={() => setVariantIdx(i)}
                >
                  <span style={{ color: i === variantIdx ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.28)", fontSize: "0.48rem", letterSpacing: "0.38em", textTransform: "uppercase", fontWeight: i === variantIdx ? 600 : 300, flexShrink: 0, transition: "color 0.2s" }}>
                    {v.label}
                  </span>
                  <span style={{ color: i === variantIdx ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.38)", fontSize: "0.6rem", letterSpacing: "0.06em", fontWeight: 300, transition: "color 0.2s" }}>
                    {v.name}
                  </span>
                  {v.soldOut && (
                    <span style={{ marginLeft: "auto", color: "rgba(255,80,80,0.6)", fontSize: "0.4rem", letterSpacing: "0.28em", textTransform: "uppercase", flexShrink: 0 }}>
                      Sold Out
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Accordion>
          {/* アコーディオン群の末尾ボーダー */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />
        </div>
      </div>

      {/* ─ 同シリーズの関連商品 ──────────────────────────── */}
      {related.length > 0 && (
        <section style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "clamp(4rem,8vw,6rem) clamp(1.5rem,5vw,4rem)",
          maxWidth: "1360px",
          margin: "0 auto",
        }}>
          <p style={{ color: "rgba(255,255,255,0.18)", fontSize: "0.5rem", letterSpacing: "0.6em", textTransform: "uppercase", fontWeight: 300, margin: "0 0 2.5rem" }}>
            Also in {product.series}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(1.2rem,3vw,2.5rem)" }}>
            {related.map(p => (
              <RelatedCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ─ フッター ──────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "2rem clamp(1.5rem,5vw,4rem)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ color: "rgba(255,255,255,0.18)", fontSize: "0.45rem", letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 300 }}>
          © 2025 CMMN.
        </span>
        <Link href="/" style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.45rem", letterSpacing: "0.42em", textTransform: "uppercase", textDecoration: "none", fontWeight: 300 }}>
          ← Back to home
        </Link>
      </footer>

      {/* ─ ライトボックスモーダル ────────────────────────── */}
      {modalOpen && (
        <LightboxModal
          product={product}
          initialIndex={variantIdx}
          onClose={() => setModalOpen(false)}
        />
      )}
    </main>
  );
}

// ─────────────────────────────────────────────────────────
//  関連商品カード（コンパクト）
// ─────────────────────────────────────────────────────────
function RelatedCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const mainImg = product.variants[product.defaultVariantIndex]?.image;

  return (
    <Link href={`/products/${product.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div style={{
          aspectRatio: "1 / 1",
          backgroundColor: "#0e1120",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1.5rem",
          marginBottom: "1rem",
          overflow: "hidden",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}>
          {mainImg ? (
            <img src={mainImg} alt={product.code} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          ) : (
            <span style={{ color: "rgba(255,255,255,0.06)", fontSize: "0.44rem", letterSpacing: "0.5em", textTransform: "uppercase" }}>
              {product.code}
            </span>
          )}
        </div>
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.44rem", letterSpacing: "0.48em", textTransform: "uppercase", fontWeight: 300, margin: "0 0 0.22rem" }}>
          {product.series}
        </p>
        <p style={{ color: hovered ? "#fff" : "rgba(255,255,255,0.7)", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 0.2rem", transition: "color 0.25s" }}>
          {product.series} / {product.number}
        </p>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.6rem", fontWeight: 300, margin: 0 }}>
          {product.price}
        </p>
      </div>
    </Link>
  );
}
