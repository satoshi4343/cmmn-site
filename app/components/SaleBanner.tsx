"use client";

const BANNER_H = 28;
const TEXT = "CMMN. MULTI-BUY — 2 ITEMS ¥500 OFF / 3 ITEMS ¥2,000 OFF / 4+ ITEMS ¥2,980 OFF / FREE SHIPPING ¥5,000+";

export default function SaleBanner() {
  const textStyle: React.CSSProperties = {
    color: "#ffffff",
    fontSize: "0.65rem",
    letterSpacing: "0.45em",
    textTransform: "uppercase",
    fontWeight: 600,
    margin: 0,
    whiteSpace: "nowrap",
    paddingRight: "2rem",
  };

  return (
    <>
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 300,
        width: "100%",
        height: `${BANNER_H}px`,
        backgroundColor: "#060b14",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        boxSizing: "border-box",
      }}>
        <div className="cmmn-banner-track">
          <p style={textStyle}>{TEXT}</p>
          <p className="cmmn-banner-dup" style={textStyle}>{TEXT}</p>
        </div>
      </div>
    </>
  );
}
