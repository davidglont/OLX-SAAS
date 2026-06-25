"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Upload, Sparkles, Copy } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type StepKey = "step1" | "step2" | "step3";

const STEP_TITLE_KEYS = { step1: "step1_title", step2: "step2_title", step3: "step3_title" } as const;
const STEP_DESC_KEYS  = { step1: "step1_desc",  step2: "step2_desc",  step3: "step3_desc"  } as const;

const STEPS: { icon: typeof Upload; key: StepKey; color: string; glow: string }[] = [
  { icon: Upload,   key: "step1", color: "#8B5CF6", glow: "rgba(139,92,246,0.3)" },
  { icon: Sparkles, key: "step2", color: "#EC4899", glow: "rgba(236,72,153,0.3)" },
  { icon: Copy,     key: "step3", color: "#10B981", glow: "rgba(16,185,129,0.3)" },
];

export default function HowItWorks() {
  const t = useTranslations("howItWorks");
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const cardsRef   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Heading */
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: headRef.current, start: "top 85%" } });

      /* Cards stagger */
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { opacity: 0, y: 60, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
            delay: i * 0.12 });

        /* Icon pop */
        const icon = card.querySelector(".step-icon");
        if (icon) {
          gsap.fromTo(icon,
            { scale: 0, rotate: -20 },
            { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(1.7)",
              scrollTrigger: { trigger: card, start: "top 85%" },
              delay: i * 0.12 + 0.2 });
        }

        /* Number count-up */
        const numEl = card.querySelector(".step-num") as HTMLElement | null;
        if (numEl) {
          const counter = { v: 0 };
          gsap.to(counter, {
            v: i + 1, duration: 0.6, ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 85%" },
            delay: i * 0.12 + 0.1,
            onUpdate: () => { numEl.textContent = String(Math.round(counter.v)); },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: "120px 28px", position: "relative", overflow: "hidden" }}>
      {/* Subtle divider gradient */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "600px", height: "1px", background: "linear-gradient(to right, transparent, rgba(139,92,246,0.4), transparent)" }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Heading */}
        <div ref={headRef} style={{ textAlign: "center", marginBottom: "72px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 16px", borderRadius: "20px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", marginBottom: "20px" }}>
            <Sparkles size={13} color="var(--primary-light)" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--primary-light)", fontFamily: "Rubik,sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {t("eyebrow")}
            </span>
          </div>
          <h2 className="display-text" style={{ fontSize: "clamp(32px,4vw,52px)", color: "var(--color-foreground)", marginBottom: "16px" }}>
            {t("title")}
          </h2>
          <p style={{ fontSize: "18px", color: "var(--color-muted-foreground)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.6 }}>
            {t("subtitle")}
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {STEPS.map(({ icon: Icon, key, color, glow }, index) => (
            <div
              key={key}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="card"
              style={{ padding: "36px 32px", position: "relative", overflow: "hidden", cursor: "default" }}
            >
              {/* Large watermark number */}
              <div
                className="step-num"
                style={{
                  position: "absolute",
                  top: "-20px",
                  right: "20px",
                  fontSize: "120px",
                  fontFamily: "Rubik,sans-serif",
                  fontWeight: 900,
                  color: "rgba(139,92,246,0.045)",
                  lineHeight: 1,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                {index + 1}
              </div>

              {/* Icon */}
              <div
                className="step-icon"
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: `rgba(${color === "#8B5CF6" ? "139,92,246" : color === "#EC4899" ? "236,72,153" : "16,185,129"},0.12)`,
                  border: `1px solid ${color}33`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                  boxShadow: `0 8px 32px ${glow}`,
                }}
              >
                <Icon size={26} color={color} />
              </div>

              {/* Step indicator */}
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "50%", background: color, marginBottom: "14px" }}>
                <span style={{ color: "white", fontSize: "12px", fontWeight: 800, fontFamily: "Rubik,sans-serif" }}>{index + 1}</span>
              </div>

              <h3 style={{ fontFamily: "Rubik,sans-serif", fontWeight: 700, fontSize: "19px", color: "var(--color-foreground)", marginBottom: "12px" }}>
                {t(STEP_TITLE_KEYS[key])}
              </h3>
              <p style={{ color: "var(--color-muted-foreground)", fontSize: "15px", lineHeight: 1.7 }}>
                {t(STEP_DESC_KEYS[key])}
              </p>

              {/* Hover glow */}
              <div style={{ position: "absolute", bottom: "-60px", right: "-60px", width: "160px", height: "160px", borderRadius: "50%", background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`, pointerEvents: "none", opacity: 0.5 }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
