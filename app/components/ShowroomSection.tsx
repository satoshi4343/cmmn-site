"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SERIES_LIST, SERIES_META, getSeriesProducts, ALL_PRODUCTS, type Series, type Product } from "../lib/products";
import { useCurrency } from "../context/CurrencyContext";
import { fetchProductPrices, formatPrice, type ShopifyPrice } from "../lib/shopify";

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.04 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform: v ? "translateY(0)" : "translateY(18px)",
      transition: `opacity 1.2s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1.2s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ─── 商品カード ────────────────────────────────────────────
function ProductCard({ product, index, displayPrice }: { product: Product; index: number; displayPrice: string }) {
  const [hovered, setHovered] = useState(false);
  const [variantIdx, setVariantIdx] = useState(product.defaultVariantIndex);
  const [imgError, setImgError] = useState(false);

  const hasVariants = product.variants.some(v => v.image !== null);
  const currentImg = product.variants[variantIdx]?.image;
  const showImg = currentImg && !imgError;

  return (
    <Reveal delay={index * 55}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ cursor: "pointer" }}>

        <Link href={`/products/${product.id}`} style={{ textDecoration: "none", display: "block" }}>
          <div style={{
            position: "relative", aspectRatio: "1 / 1",
            backgroundColor: "#f5f5f5",
            overflow: "hidden", marginBottom: "0.7rem",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {showImg ? (
              <img
                src={currentImg}
                alt={`${product.code} ${product.variants[variantIdx].label}`}
                onError={() => setImgError(true)}
                style={{
                  width: "100%", height: "100%",
                  objectFit: "contain",
                  objectPosition: "center bottom",
                  paddingTop: "clamp(1.2rem,3.5vw,2.2rem)",
                  paddingLeft: "clamp(1rem,3vw,1.8rem)",
                  paddingRight: "clamp(1rem,3vw,1.8rem)",
                  paddingBottom: "clamp(0.4rem,1vw,0.7rem)",
                  display: "block",
                  transform: hovered ? "scale(1.03) translateY(-3px)" : "scale(1) translateY(0)",
                  transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
                }}
              />
            ) : (
              <span style={{ color: "rgba(0,0,0,0.15)", fontSize: "0.46rem", letterSpacing: "0.55em", textTransform: "uppercase", fontWeight: 300, userSelect: "none" }}>
                {product.code}
              </span>
            )}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "1px",
              background: hovered ? "rgba(0,0,0,0.1)" : "transparent",
              transition: "background 0.4s ease",
            }} />
          </div>
        </Link>

        {/* カラードット */}
        {hasVariants && (
          <div style={{ display: "flex", gap: "0.38rem", marginBottom: "0.85rem" }}>
            {product.variants.map((v, i) => (
              <button
                key={v.label}
                onClick={() => { setVariantIdx(i); setImgError(false); }}
                title={v.soldOut ? `${v.name} — SOLD OUT` : v.name}
                style={{
                  width: i === variantIdx ? "1.4rem" : "0.38rem",
                  height: "0.38rem",
                  borderRadius: "999px",
                  backgroundColor: v.soldOut
                    ? (i === variantIdx ? "rgba(200,50,50,0.35)" : "rgba(0,0,0,0.1)")
                    : (i === variantIdx ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.18)"),
                  border: "none", cursor: v.image ? "pointer" : "default", padding: 0,
                  transition: "width 0.3s ease, background-color 0.25s ease",
                  opacity: v.image ? (v.soldOut ? 0.5 : 1) : 0.3,
                }}
              />
            ))}
          </div>
        )}

        {/* テキスト */}
        <Link href={`/products/${product.id}`} style={{ textDecoration: "none", display: "block" }}>
          <p style={{ color: "rgba(0,0,0,0.3)", fontSize: "0.46rem", letterSpacing: "0.52em", textTransform: "uppercase", fontWeight: 300, margin: "0 0 0.28rem" }}>
            {product.code}
          </p>
          <p style={{
            color: hovered ? "#000000" : "rgba(0,0,0,0.75)",
            fontSize: "clamp(0.9rem,1.8vw,1.15rem)",
            fontWeight: 700, letterSpacing: "0.07em",
            textTransform: "uppercase", margin: "0 0 0.3rem",
            transition: "color 0.25s ease",
          }}>
            {product.series} {product.number}
          </p>
          <p style={{ color: "rgba(0,0,0,0.35)", fontSize: "0.58rem", letterSpacing: "0.04em", fontWeight: 300, margin: "0 0 0.65rem", lineHeight: 1.5 }}>
            {product.tagline}
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "rgba(0,0,0,0.5)", fontSize: "0.68rem", letterSpacing: "0.07em", fontWeight: 300 }}>
              {displayPrice}
            </span>
            <span style={{
              color: hovered ? "rgba(0,0,0,0.5)" : "transparent",
              fontSize: "0.42rem", letterSpacing: "0.45em", textTransform: "uppercase", fontWeight: 400,
              transition: "color 0.25s ease",
            }}>
              View →
            </span>
          </div>
        </Link>
      </div>
    </Reveal>
  );
}

// ─── タブバー ─────────────────────────────────────────────
function SeriesTabs({ active, onChange }: { active: Series; onChange: (s: Series) => void }) {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
      {SERIES_LIST.map(s => {
        const isActive = s === active;
        return (
          <button key={s} onClick={() => onChange(s)} style={{
            background: "none", border: "none",
            borderBottom: `2px solid ${isActive ? "#111" : "transparent"}`,
            marginBottom: "-1px",
            padding: "0.85rem clamp(1.2rem,3.5vw,2.8rem)",
            cursor: "pointer",
            color: isActive ? "#111" : "rgba(0,0,0,0.28)",
            fontSize: "0.58rem", letterSpacing: "0.55em", textTransform: "uppercase",
            fontWeight: isActive ? 600 : 300,
            fontFamily: "inherit",
            transition: "color 0.25s, border-color 0.25s",
          }}>
            {s}
          </button>
        );
      })}
    </div>
  );
}

// ─── メインエクスポート ───────────────────────────────────
export default function ShowroomSection() {
  const [activeSeries, setActiveSeries] = useState<Series>("ALL");
  const [fading, setFading] = useState(false);
  const { currency, country } = useCurrency();
  const [usdPrices, setUsdPrices] = useState<Record<string, ShopifyPrice | null>>({});

  const products = getSeriesProducts(activeSeries);
  const meta = SERIES_META[activeSeries];

  // USD に切り替わったとき全商品の価格を一括取得
  useEffect(() => {
    if (currency !== "USD") return;
    const ids = ALL_PRODUCTS.filter(p => p.shopifyId).map(p => p.shopifyId!);
    fetchProductPrices(ids, country).then(setUsdPrices);
  }, [currency, country]);

  const handleTabChange = (s: Series) => {
    if (s === activeSeries || fading) return;
    setFading(true);
    setTimeout(() => { setActiveSeries(s); setFading(false); }, 160);
  };

  return (
    <section id="collection" style={{ backgroundColor: "#ffffff" }}>

      {/* ── NEW ARRIVALS ヘッダー ── */}
      <Reveal>
        <div style={{
          borderTop: "1px solid rgba(0,0,0,0.08)",
          padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,6rem) clamp(2.5rem,4vw,4rem)",
        }}>
          <h2 style={{
            color: "#111111",
            fontSize: "clamp(2.8rem,8vw,7rem)",
            fontWeight: 900, letterSpacing: "0.03em",
            lineHeight: 0.9, textTransform: "uppercase",
            marginBottom: "1.6rem",
          }}>
            New<br />Arrivals.
          </h2>
          <p style={{
            color: "rgba(0,0,0,0.38)",
            fontSize: "clamp(0.65rem,1vw,0.8rem)",
            letterSpacing: "0.12em", lineHeight: 2,
            fontWeight: 300, maxWidth: "22rem",
          }}>
            Sharp silhouettes. Cold energy.<br />
            Y2K, redefined for now.
          </p>
        </div>
      </Reveal>

      {/* ── タブ + グリッド ── */}
      <Reveal>
        <div style={{ padding: "0 clamp(1.5rem,6vw,6rem) clamp(3rem,6vw,5rem)" }}>
          <div style={{ marginBottom: "clamp(1.5rem,3vw,2.5rem)" }}>
            <SeriesTabs active={activeSeries} onChange={handleTabChange} />
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(160px, 100%), 1fr))",
            gap: "clamp(1.2rem,3vw,2.5rem) clamp(0.8rem,2vw,1.8rem)",
            opacity: fading ? 0 : 1,
            transition: "opacity 0.18s ease",
          }}>
            {products.map((p, i) => {
              let displayPrice = p.price;
              if (currency === "USD" && p.shopifyId) {
                const sp = usdPrices[p.shopifyId];
                if (sp) displayPrice = formatPrice(sp);
              }
              return <ProductCard key={p.id} product={p} index={i} displayPrice={displayPrice} />;
            })}
          </div>

          <div style={{
            marginTop: "clamp(3.5rem,7vw,6rem)",
            paddingTop: "clamp(1.5rem,3vw,2.5rem)",
            borderTop: "1px solid rgba(0,0,0,0.08)",
          }}>
            <span style={{ color: "rgba(0,0,0,0.25)", fontSize: "0.5rem", letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 300 }}>
              14 styles · 4 series
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
