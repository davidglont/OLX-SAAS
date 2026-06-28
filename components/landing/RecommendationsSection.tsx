"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Camera, Type, Tag, Clock, Heart, Hash } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ICONS = [Camera, Type, Tag, Clock, Heart, Hash];
const COLORS = ["#D4991A", "#E07B39", "#D4991A", "#E07B39", "#D4991A", "#E07B39"];

export default function RecommendationsSection() {
  const t = useTranslations("recommendations");
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const cardsRef   = useRef<(HTMLDivElement | null)[]>([]);

  const tips = [
    { key: "tip1", stat: t("tip1_stat") },
    { key: "tip2", stat: t("tip2_stat") },
    { key: "tip3", stat: t("tip3_stat") },
    { key: "tip4", stat: t("tip4_stat") },
    { key: "tip5", stat: t("tip5_stat") },
    { key: "tip6", stat: t("tip6_stat") },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: headRef.current, start: "top 85%" } });

      cardsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: 40, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
            delay: (i % 3) * 0.08 });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="lp-section" style={{ padding: "120px 28px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "600px", height: "1px", background: "linear-gradient(to right, transparent, rgba(212,153,26,0.35), transparent)" }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div ref={headRef} style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 16px", borderRadius: "20px", background: "rgba(212,153,26,0.1)", border: "1px solid rgba(212,153,26,0.2)", marginBottom: "20px" }}>
            <Hash size={12} color="var(--primary-light)" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--primary-light)", fontFamily: "Rubik,sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {t("eyebrow")}
            </span>
          </div>
          <h2 className="display-text" style={{ fontSize: "clamp(28px,3.5vw,46px)", color: "var(--color-foreground)", marginBottom: "14px" }}>
            {t("title")}
          </h2>
          <p style={{ fontSize: "17px", color: "var(--color-muted-foreground)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.6 }}>
            {t("subtitle")}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {tips.map(({ key, stat }, i) => {
            const Icon = ICONS[i];
            const color = COLORS[i];
            return (
              <div
                key={key}
                ref={el => { cardsRef.current[i] = el; }}
                className="glass-card"
                style={{ padding: "28px 24px", position: "relative", overflow: "hidden" }}
              >
                <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "100px", height: "100px", borderRadius: "50%", background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: `${color}15`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={20} color={color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Rubik,sans-serif", fontWeight: 700, fontSize: "15px", color: "var(--color-foreground)", marginBottom: "6px" }}>
                      {t(`${key}_title` as never)}
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--color-muted-foreground)", lineHeight: 1.55, marginBottom: "10px" }}>
                      {t(`${key}_desc` as never)}
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", background: `${color}10`, border: `1px solid ${color}28`, borderRadius: "20px", padding: "3px 10px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color, fontFamily: "Rubik,sans-serif" }}>{stat}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
