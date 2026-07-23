"use client";

import Link from "next/link";
import { useState } from "react";
import { useCurrency, type Currency } from "../context/CurrencyContext";

const linkStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.62)",
  fontSize: "0.5rem",
  letterSpacing: "0.45em",
  fontWeight: 400,
  textDecoration: "none",
  textTransform: "uppercase",
  transition: "color 0.2s ease",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

function CurrencyToggle({ style }: { style?: React.CSSProperties }) {
  const { currency, setCurrency } = useCurrency();
  const toggle = () => setCurrency(currency === "JPY" ? "USD" : "JPY");
  return (
    <button
      onClick={toggle}
      style={{
        background: "none",
        border: "1px solid rgba(255,255,255,0.25)",
        borderRadius: "2px",
        cursor: "pointer",
        padding: "0.18rem 0.55rem",
        display: "flex",
        alignItems: "center",
        gap: "0.3rem",
        fontFamily: "inherit",
        ...style,
      }}
    >
      {(["JPY", "USD"] as Currency[]).map((c, i) => (
        <span
          key={c}
          style={{
            color: currency === c ? "#ffffff" : "rgba(255,255,255,0.3)",
            fontSize: "0.46rem",
            letterSpacing: "0.3em",
            fontWeight: currency === c ? 600 : 300,
            transition: "color 0.2s",
          }}
        >
          {i === 1 && <span style={{ color: "rgba(255,255,255,0.18)", marginRight: "0.3rem" }}>|</span>}
          {c}
        </span>
      ))}
    </button>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <style>{`
        .nav-links { display: flex; }
        .nav-hamburger { display: none; }
        @media (max-width: 600px) {
          .nav-links { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>

      <nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
          height: "clamp(3rem, 5vw, 4rem)",
          background: "linear-gradient(to bottom, rgba(6,11,20,0.55) 0%, transparent 100%)",
        }}
      >
        {/* 左 — デスクトップ */}
        <div className="nav-links" style={{ gap: "clamp(1.5rem, 3vw, 3rem)" }}>
          <a
            href="/"
            onClick={e => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            style={linkStyle}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#ffffff")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.62)")}
          >
            HOME
          </a>
          <a
            href="/#collection"
            onClick={e => {
              const el = document.getElementById("collection");
              if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth" }); }
            }}
            style={linkStyle}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#ffffff")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.62)")}
          >
            COLLECTIONS
          </a>
        </div>

        {/* 左 — モバイル ハンバーガー */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "0.4rem", display: "flex", flexDirection: "column",
            gap: "5px", alignItems: "center", justifyContent: "center",
          }}
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: "block", width: "22px", height: "1.5px",
              backgroundColor: "#ffffff",
              transition: "transform 0.3s ease, opacity 0.3s ease",
              transform: menuOpen
                ? i === 0 ? "translateY(6.5px) rotate(45deg)"
                : i === 2 ? "translateY(-6.5px) rotate(-45deg)"
                : "scaleX(0)"
                : "none",
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>

        {/* 中央 — CMMN. ロゴ */}
        <Link
          href="/"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#ffffff",
            fontSize: "clamp(0.9rem, 1.8vw, 1.2rem)",
            fontWeight: 900,
            letterSpacing: "0.12em",
            textDecoration: "none",
            textTransform: "uppercase",
          }}
        >
          CMMN.
        </Link>

        {/* 右 — デスクトップ */}
        <div className="nav-links" style={{ gap: "clamp(1.5rem, 3vw, 3rem)", alignItems: "center" }}>
          {[["ABOUT US", "/about"], ["CONTACT", "/contact"]].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              style={linkStyle}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#ffffff")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.62)")}
            >
              {label}
            </Link>
          ))}
          <CurrencyToggle />
        </div>

        {/* 右 — モバイル スペーサー（CMMN.を中央に保つ） */}
        <div className="nav-hamburger" style={{ width: "30px" }} />
      </nav>

      {/* モバイル メニューオーバーレイ */}
      {menuOpen && (
        <div
          onClick={closeMenu}
          style={{
            position: "fixed", inset: 0, zIndex: 99,
            backgroundColor: "rgba(6,11,20,0.96)",
            backdropFilter: "blur(12px)",
            display: "flex", flexDirection: "column",
            justifyContent: "center",
            padding: "0 2.5rem",
          }}
        >
          {[
            ["HOME", "/", true],
            ["COLLECTIONS", "/collections", false],
            ["ABOUT US", "/about", false],
            ["CONTACT", "/contact", false],
          ].map(([label, href, isScroll], i, arr) => (
            <a
              key={label as string}
              href={href as string}
              onClick={e => {
                if (isScroll && window.location.pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else if (href === "/#collection") {
                  e.preventDefault();
                  closeMenu();
                  setTimeout(() => {
                    const el = document.getElementById("collection");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 50);
                  return;
                }
                closeMenu();
              }}
              style={{
                color: "rgba(255,255,255,0.78)",
                fontSize: "clamp(1.6rem, 7vw, 2.4rem)",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                padding: "1rem 0",
                borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                display: "block",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#ffffff")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.78)")}
            >
              {label}
            </a>
          ))}
          <div style={{ marginTop: "2rem" }}>
            <CurrencyToggle style={{ borderColor: "rgba(255,255,255,0.15)" }} />
          </div>
        </div>
      )}
    </>
  );
}
