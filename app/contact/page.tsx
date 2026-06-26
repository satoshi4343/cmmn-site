"use client";

import { useEffect, useRef, useState } from "react";

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.08 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform: v ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 1.4s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1.4s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

const BG = "#060b14";

const sns = [
  { label: "Instagram", handle: "@cmmn.official", href: "https://www.instagram.com/cmmn.official" },
  { label: "TikTok",    handle: "@cmmn.official", href: "https://www.tiktok.com/@cmmn.official"   },
];

export default function ContactPage() {
  return (
    <main style={{ backgroundColor: BG, minHeight: "100vh", paddingTop: "clamp(7rem,14vw,12rem)" }}>
      <section style={{ padding: "0 clamp(1.5rem,8vw,10rem) clamp(6rem,10vw,10rem)" }}>

        <Reveal>
          <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.5rem", letterSpacing: "0.6em", textTransform: "uppercase", fontWeight: 300, marginBottom: "1.8rem" }}>
            Contact
          </p>
        </Reveal>

        <Reveal delay={100}>
          <h1 style={{
            color: "#ffffff",
            fontSize: "clamp(2.4rem,7vw,6rem)",
            fontWeight: 900,
            letterSpacing: "0.03em",
            lineHeight: 0.92,
            textTransform: "uppercase",
            marginBottom: "clamp(4rem,8vw,8rem)",
          }}>
            Get in<br />touch.
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginBottom: "clamp(4rem,8vw,8rem)" }} />
        </Reveal>

        {/* ── SNS ── */}
        <Reveal delay={220}>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.48rem", letterSpacing: "0.55em", textTransform: "uppercase", fontWeight: 300, marginBottom: "2rem" }}>
            Follow us
          </p>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem", marginBottom: "clamp(5rem,10vw,9rem)" }}>
          {sns.map(({ label, handle, href }, i) => (
            <Reveal key={label} delay={280 + i * 60}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", textDecoration: "none", group: "true" } as React.CSSProperties}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  (el.children[0] as HTMLElement).style.color = "#ffffff";
                  (el.children[1] as HTMLElement).style.color = "rgba(255,255,255,0.4)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  (el.children[0] as HTMLElement).style.color = "rgba(255,255,255,0.72)";
                  (el.children[1] as HTMLElement).style.color = "rgba(255,255,255,0.2)";
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.72)", fontSize: "clamp(1.2rem,2.5vw,1.8rem)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s ease" }}>
                  {label}
                </span>
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.58rem", letterSpacing: "0.3em", fontWeight: 300, transition: "color 0.2s ease" }}>
                  {handle}
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={420}>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />
        </Reveal>

      </section>
      <div style={{ height: "clamp(6rem,12vw,12rem)" }} />
    </main>
  );
}
