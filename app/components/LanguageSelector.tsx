"use client";

import { useLanguage } from "../context/LanguageContext";

export default function LanguageSelector() {
  const { setLanguage } = useLanguage();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(6, 11, 20, 0.98)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            color: "#ffffff",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 900,
            letterSpacing: "0.12em",
            margin: "0 0 2rem",
            textTransform: "uppercase",
          }}
        >
          CMMN.
        </h1>

        <p
          style={{
            color: "rgba(255, 255, 255, 0.4)",
            fontSize: "0.85rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            margin: "0 0 3rem",
          }}
        >
          Select your language
        </p>

        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
          <button
            onClick={() => setLanguage("ja")}
            style={{
              padding: "1.2rem 2.5rem",
              fontSize: "0.9rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 700,
              border: "1px solid rgba(255, 255, 255, 0.3)",
              backgroundColor: "#ffffff",
              color: "#060b14",
              cursor: "pointer",
              borderRadius: "2px",
              fontFamily: "inherit",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255, 255, 255, 0.9)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#ffffff";
            }}
          >
            日本語
          </button>

          <button
            onClick={() => setLanguage("en")}
            style={{
              padding: "1.2rem 2.5rem",
              fontSize: "0.9rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 700,
              border: "1px solid rgba(255, 255, 255, 0.3)",
              backgroundColor: "transparent",
              color: "#ffffff",
              cursor: "pointer",
              borderRadius: "2px",
              fontFamily: "inherit",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            }}
          >
            English
          </button>
        </div>
      </div>
    </div>
  );
}
