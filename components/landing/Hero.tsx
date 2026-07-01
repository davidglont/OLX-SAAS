"use client";

import { useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight, Star, Zap, CheckCircle } from "lucide-react";

function getActiveSellers(locale: string): string {
  const START = new Date("2026-07-01").getTime();
  const count = 150 + Math.max(0, Math.floor((Date.now() - START) / 86_400_000)) * 20;
  const sep = locale === "ro" ? "." : ",";
  return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef  = useRef<HTMLDivElement>(null);
  const headRef   = useRef<HTMLHeadingElement>(null);
  const subRef    = useRef<HTMLParagraphElement>(null);
  const ctaRef    = useRef<HTMLDivElement>(null);
  const trustRef  = useRef<HTMLDivElement>(null);
  const cardRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(badgeRef.current,
          { opacity: 0, y: 20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7 }, 0.3)

        .fromTo(headRef.current?.querySelectorAll(".word") ?? [],
          { opacity: 0, y: 64, rotateX: -20 },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.85, stagger: 0.08 }, 0.55)

        .fromTo(subRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7 }, 1.1)

        .fromTo(ctaRef.current?.children ?? [],
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 1.3)

        .fromTo(trustRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.55 }, 1.55)

        .fromTo(cardRef.current,
          { opacity: 0, x: 56, rotateY: 6 },
          { opacity: 1, x: 0, rotateY: 0, duration: 1.1, ease: "power3.out" }, 0.7);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const words = t("title").split(" ");

  return (
    <section
      ref={containerRef}
      style={{ position: "relative", minHeight: "100dvh", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: "68px" }}
    >
      {/* Ambient orbs — static, no animation */}
      <div className="glow-orb" style={{ width: "700px", height: "700px", background: "radial-gradient(circle, rgba(212,153,26,0.13) 0%, transparent 70%)", top: "-180px", left: "-200px" }} />
      <div className="glow-orb" style={{ width: "500px", height: "500px", background: "radial-gradient(circle, rgba(224,123,57,0.09) 0%, transparent 70%)", bottom: "-100px", right: "-80px" }} />

      <div className="hero-inner" style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 28px", width: "100%", position: "relative", zIndex: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>

        {/* ── Left — copy ──────────────────────────────────────── */}
        <div>
          <div ref={badgeRef} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px 6px 8px", borderRadius: "24px", background: "rgba(212,153,26,0.1)", border: "1px solid rgba(212,153,26,0.25)", marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", background: "rgba(212,153,26,0.2)", borderRadius: "16px", padding: "3px 10px" }}>
              <Zap size={11} color="var(--primary-light)" fill="var(--primary-light)" />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary-light)", fontFamily: "Rubik,sans-serif", letterSpacing: "0.06em" }}>AI</span>
            </div>
            <span className="hero-live-dot" aria-hidden="true" />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-foreground)" }}>
              {getActiveSellers(locale)} {locale === "ro" ? "vânzători activi" : "active sellers"}
            </span>
          </div>

          <h1
            ref={headRef}
            className="display-text hero-headline"
            style={{ fontSize: "clamp(40px,5.2vw,76px)", color: "var(--color-foreground)", marginBottom: "24px", perspective: "800px" }}
          >
            {words.map((word, i) => (
              <span
                key={i}
                className="word"
                style={{ display: "inline-block", marginRight: "0.28em", color: i === 2 ? "var(--primary-light)" : "var(--color-foreground)", willChange: "transform, opacity" }}
              >
                {word}
              </span>
            ))}
          </h1>

          <p ref={subRef} style={{ fontSize: "clamp(16px,1.6vw,19px)", color: "var(--color-muted-foreground)", lineHeight: 1.7, maxWidth: "500px", marginBottom: "40px" }}>
            {t("subtitle")}
          </p>

          <div ref={ctaRef} className="hero-ctas" style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "40px" }}>
            <Link href={`/${locale}/auth/signup`} className="btn-primary" style={{ fontSize: "16px", padding: "15px 32px", gap: "10px" }}>
              {t("cta_primary")} <ArrowRight size={17} />
            </Link>
            <Link href={`/${locale}/pricing`} className="btn-secondary" style={{ fontSize: "16px", padding: "15px 28px" }}>
              {t("cta_secondary")}
            </Link>
          </div>

          <div ref={trustRef} style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ display: "flex" }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={13} color="#F59E0B" fill="#F59E0B" />)}
              </div>
              <span style={{ fontSize: "13px", color: "var(--color-muted-foreground)", fontWeight: 500 }}>4.9/5</span>
            </div>
            {[t("trust1"), t("trust2")].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle size={14} color="var(--success)" />
                <span style={{ fontSize: "13px", color: "var(--color-muted-foreground)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right — product preview card ─────────────────────── */}
        <div ref={cardRef} className="hero-preview" style={{ position: "relative", perspective: "1000px" }}>
          <div className="glass-card" style={{ padding: "24px", boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(212,153,26,0.18)" }}>
            {/* Topbar */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", paddingBottom: "14px", borderBottom: "1px solid rgba(212,153,26,0.1)" }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "linear-gradient(135deg,#D4991A,#A67800)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={14} color="white" fill="white" />
              </div>
              <span style={{ fontFamily: "Rubik,sans-serif", fontWeight: 700, fontSize: "13px", color: "var(--color-foreground)" }}>AnunțAI</span>
              <span style={{ fontSize: "10px", fontWeight: 700, fontFamily: "Rubik,sans-serif", color: "var(--primary-light)", background: "rgba(212,153,26,0.13)", border: "1px solid rgba(212,153,26,0.28)", borderRadius: "12px", padding: "3px 9px", marginLeft: "auto" }}>AI Ready</span>
            </div>

            {/* Scores */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--color-muted-foreground)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "8px" }}>Photo Quality</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "6px" }}>
                {[{s:9,c:"#10B981"},{s:7,c:"#F59E0B"},{s:9,c:"#10B981"}].map(({s,c},i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "8px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ fontSize: "20px", fontWeight: 800, fontFamily: "Rubik,sans-serif", color: c }}>{s}</div>
                    <div style={{ fontSize: "9px", color: "var(--color-muted-foreground)", marginTop: "2px" }}>/10</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--color-muted-foreground)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "6px" }}>Generated Title</div>
              <div style={{ background: "rgba(212,153,26,0.08)", borderRadius: "8px", padding: "10px 12px", border: "1px solid rgba(212,153,26,0.15)" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-foreground)", fontFamily: "Rubik,sans-serif", lineHeight: 1.4 }}>iPhone 13 Pro 128GB Graphite — Impecabil, Garanție</span>
              </div>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {["iPhone 13","Apple","128GB","5G","Face ID","Sigilat"].map(tag => (
                <span key={tag} className="badge badge-primary" style={{ fontSize: "10px", padding: "3px 9px" }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Floating chips */}
          <div className="glass-card" style={{ position: "absolute", top: "24px", right: "-20px", padding: "11px 15px", display: "flex", alignItems: "center", gap: "9px", boxShadow: "0 8px 32px rgba(0,0,0,0.45)", zIndex: 2 }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#10B981,#059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle size={17} color="white" />
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, fontFamily: "Rubik,sans-serif", color: "var(--color-foreground)" }}>Salvat!</div>
              <div style={{ fontSize: "11px", color: "var(--color-muted-foreground)" }}>OLX + Vinted</div>
            </div>
          </div>

          <div className="glass-card" style={{ position: "absolute", bottom: "24px", left: "-20px", padding: "11px 15px", display: "flex", alignItems: "center", gap: "9px", boxShadow: "0 8px 32px rgba(0,0,0,0.45)", zIndex: 2 }}>
            <Zap size={20} color="#F59E0B" fill="#F59E0B" />
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, fontFamily: "Rubik,sans-serif", color: "var(--color-foreground)" }}>10 secunde</div>
              <div style={{ fontSize: "11px", color: "var(--color-muted-foreground)" }}>generare AI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll line */}
      <div style={{ position: "absolute", bottom: "36px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "1px", height: "52px", background: "linear-gradient(to bottom, transparent, rgba(212,153,26,0.5))" }} />
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-preview { display: none !important; }
          .hero-inner { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .hero-inner { padding: 40px 16px 60px !important; }
          .hero-headline { font-size: clamp(28px, 8vw, 48px) !important; }
          .hero-ctas { flex-direction: column !important; align-items: stretch !important; gap: 10px !important; }
          .hero-ctas > * { justify-content: center !important; }
        }
        @media (max-width: 480px) {
          .hero-inner { padding: 32px 14px 48px !important; }
          .hero-headline { font-size: clamp(26px, 7.5vw, 40px) !important; }
        }
        .hero-live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #22C55E; flex-shrink: 0;
          animation: hero-pulse 2.2s ease-in-out infinite;
        }
        @keyframes hero-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          50% { opacity: 0.7; box-shadow: 0 0 0 4px rgba(34,197,94,0); }
        }
      `}</style>
    </section>
  );
}
