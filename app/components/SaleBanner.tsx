"use client";

const BANNER_H = 28;
const TEXT = "SUMMER SALE — UP TO 30% OFF / FREE SHIPPING OVER ¥5,000";

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
        height: `${BANNER_H}px`,
        backgroundColor: "#060b14",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}>
        <div className="cmmn-banner-track">
          <p style={textStyle}>{TEXT}</p>
          <p className="cmmn-banner-dup" style={textStyle}>{TEXT}</p>
        </div>
      </div>
    </>
  );
}
