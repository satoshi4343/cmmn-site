"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const StoreScene = dynamic(() => import("../components/StoreScene"), { ssr: false });

export default function StorePage() {
  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden">
      {/* 3D store */}
      <StoreScene />

      {/* Top-left: back to home */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="text-xs tracking-[0.3em] text-white/40 uppercase hover:text-white/80 transition-colors"
        >
          ← Home
        </Link>
      </div>

      {/* Top-right: brand */}
      <div className="absolute top-6 right-6 z-20 text-right">
        <p className="text-xs tracking-[0.4em] text-white/30 uppercase">CMMN.</p>
        <p className="text-xs tracking-[0.2em] text-white/20 uppercase">Store</p>
      </div>

      {/* Center hint – disappears on click */}
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-16 pointer-events-none"
      >
        <p className="text-xs tracking-[0.4em] text-white/40 uppercase animate-pulse">
          Click to look around
        </p>
        <p className="mt-2 text-xs tracking-[0.2em] text-white/20 uppercase">
          Move mouse to explore
        </p>
      </div>
    </main>
  );
}
