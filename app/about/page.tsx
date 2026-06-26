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

export default function AboutPage() {
  return (
    <main style={{ backgroundColor: BG, minHeight: "100vh", paddingTop: "clamp(7rem,14vw,12rem)" }}>

      {/* ── ヘッダー ── */}
      <section style={{ padding: "0 clamp(1.5rem,8vw,10rem) clamp(6rem,10vw,10rem)" }}>
        <Reveal>
          <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.5rem", letterSpacing: "0.6em", textTransform: "uppercase", fontWeight: 300, marginBottom: "1.8rem" }}>
            About Us
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
            We are not<br />a luxury brand.
          </h1>
        </Reveal>

        {/* ── 区切り線 ── */}
        <Reveal delay={160}>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginBottom: "clamp(4rem,8vw,8rem)" }} />
        </Reveal>

        {/* ── 本文 ── */}
        <div style={{ maxWidth: "42rem", display: "flex", flexDirection: "column", gap: "clamp(2.5rem,5vw,4rem)" }}>

          <Reveal delay={200}>
            <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "clamp(1rem,1.8vw,1.25rem)", fontWeight: 300, lineHeight: 1.9, letterSpacing: "0.02em" }}>
              We don&apos;t sell names. We sell presence.<br />
              CMMN. was built for the ones who know that style doesn&apos;t come with a price tag — it comes with attitude.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "clamp(0.82rem,1.3vw,1rem)", fontWeight: 300, lineHeight: 2, letterSpacing: "0.02em" }}>
              Derived from &quot;common,&quot; stripped of the ordinary.<br />
              Familiar enough to belong anywhere.<br />
              Different enough to own every room.
            </p>
          </Reveal>

          <Reveal delay={320}>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "clamp(0.82rem,1.3vw,1rem)", fontWeight: 300, lineHeight: 2, letterSpacing: "0.02em" }}>
              We don&apos;t sell sunglasses.<br />
              We sell the version of you that stops second-guessing yourself.<br />
              A pair of frames won&apos;t change who you are.<br />
              But it changes how you walk into a room.<br />
              The way you carry yourself. The way you hold your head.<br />
              The way they look back.<br />
              That shift is everything. That&apos;s what CMMN. is for.
            </p>
          </Reveal>

          <Reveal delay={380}>
            <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "clamp(0.75rem,1.1vw,0.88rem)", fontWeight: 300, lineHeight: 2.2, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Sharp silhouettes. Cold energy. Y2K, redefined for now.<br />
              Built for the street. Built for the beach.<br />
              Built for the moments when confidence speaks before you do.<br />
              Not loud. Not ordinary. Just CMMN.
            </p>
          </Reveal>
        </div>

      </section>

      {/* 下余白 */}
      <div style={{ height: "clamp(6rem,12vw,12rem)" }} />
    </main>
  );
}
