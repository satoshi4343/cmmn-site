"use client";

import Link from "next/link";

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

export default function Navbar() {
  return (
    <>
      <style>{`
        .nav-links { display: flex; }
        @media (max-width: 600px) { .nav-links { display: none !important; } }
      `}</style>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
          height: "clamp(3rem, 5vw, 4rem)",
          background: "linear-gradient(to bottom, rgba(6,11,20,0.55) 0%, transparent 100%)",
        }}
      >
        {/* 左 */}
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

        {/* 右 */}
        <div className="nav-links" style={{ gap: "clamp(1.5rem, 3vw, 3rem)" }}>
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
        </div>
      </nav>
    </>
  );
}
