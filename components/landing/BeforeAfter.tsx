"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { X, CheckCircle, Tag, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BeforeAfter() {
  const t = useTranslations("beforeAfter");
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const beforeRef  = useRef<HTMLDivElement>(null);
  const arrowRef   = useRef<HTMLDivElement>(null);
  const afterRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: headRef.current, start: "top 85%" } });

      gsap.fromTo(beforeRef.current,
        { opacity: 0, x: -48 },
        { opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: beforeRef.current, start: "top 82%" } });

      gsap.fromTo(arrowRef.current,
        { opacity: 0, scale: 0.5, rotate: -90 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.7, ease: "back.out(1.4)",
          scrollTrigger: { trigger: arrowRef.current, start: "top 82%" }, delay: 0.25 });

      gsap.fromTo(afterRef.current,
        { opacity: 0, x: 48 },
        { opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: afterRef.current, start: "top 82%" }, delay: 0.1 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const beforeTags = [t("before_tag1"), t("before_tag2")];
  const afterTags  = [t("after_tag1"), t("after_tag2"), t("after_tag3"), t("after_tag4"), t("after_tag5")];

  return (
    <section ref={sectionRef} className="lp-section" style={{ padding: "120px 28px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "600px", height: "1px", background: "linear-gradient(to right, transparent, rgba(139,92,246,0.35), transparent)" }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Heading */}
        <div ref={headRef} style={{ textAlign: "center", marginBottom: "72px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 16px", borderRadius: "20px", background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.2)", marginBottom: "20px" }}>
            <ArrowRight size={13} color="var(--accent)" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)", fontFamily: "Rubik,sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {t("eyebrow")}
            </span>
          </div>
          <h2 className="display-text" style={{ fontSize: "clamp(32px,4vw,52px)", color: "var(--color-foreground)", marginBottom: "16px" }}>
            {t("title")}
          </h2>
          <p style={{ fontSize: "17px", color: "var(--color-muted-foreground)", maxWidth: "480px", margin: "0 auto" }}>
            {t("subtitle")}
          </p>
        </div>

        {/* Comparison */}
        <div className="ba-grid" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "24px", alignItems: "center" }}>

          {/* Before */}
          <div ref={beforeRef} style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={15} color="#EF4444" />
              </div>
              <span style={{ fontSize: "14px", fontWeight: 700, fontFamily: "Rubik,sans-serif", color: "#EF4444", letterSpacing: "0.02em" }}>{t("before_label")}</span>
            </div>
            <div className="card" style={{ padding: "24px", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.03)" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "10px" }}>Titlu</div>
              <p style={{ fontFamily: "Rubik,sans-serif", fontSize: "15px", fontWeight: 500, color: "var(--color-foreground)", marginBottom: "16px", lineHeight: 1.4 }}>
                {t("before_title")}
              </p>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>Descriere</div>
              <p style={{ fontSize: "14px", color: "var(--color-muted-foreground)", lineHeight: 1.6, marginBottom: "16px" }}>
                {t("before_desc")}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {beforeTags.map(tag => (
                  <span key={tag} style={{ padding: "3px 10px", borderRadius: "16px", fontSize: "12px", background: "rgba(239,68,68,0.08)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)", fontFamily: "Rubik,sans-serif", fontWeight: 600 }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div ref={arrowRef} className="ba-arrow-icon" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "linear-gradient(135deg,#8B5CF6,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 32px rgba(139,92,246,0.4), 0 0 64px rgba(236,72,153,0.2)", flexShrink: 0 }}>
              <ArrowRight size={22} color="white" />
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary-light)", fontFamily: "Rubik,sans-serif", letterSpacing: "0.06em", textAlign: "center", lineHeight: 1.3 }}>AI<br/>Magic</span>
          </div>

          {/* After */}
          <div ref={afterRef} style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle size={15} color="#10B981" />
              </div>
              <span style={{ fontSize: "14px", fontWeight: 700, fontFamily: "Rubik,sans-serif", color: "#10B981", letterSpacing: "0.02em" }}>{t("after_label")}</span>
            </div>
            <div className="card" style={{ padding: "24px", border: "1px solid rgba(16,185,129,0.2)", background: "rgba(16,185,129,0.03)", boxShadow: "0 0 40px rgba(16,185,129,0.05)" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "10px" }}>Titlu</div>
              <p style={{ fontFamily: "Rubik,sans-serif", fontSize: "15px", fontWeight: 600, color: "var(--color-foreground)", marginBottom: "16px", lineHeight: 1.4 }}>
                {t("after_title")}
              </p>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>Descriere</div>
              <p style={{ fontSize: "14px", color: "var(--color-muted-foreground)", lineHeight: 1.6, marginBottom: "16px" }}>
                {t("after_desc")}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {afterTags.map(tag => (
                  <span key={tag} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "3px 10px", borderRadius: "16px", fontSize: "12px", background: "rgba(16,185,129,0.08)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)", fontFamily: "Rubik,sans-serif", fontWeight: 600 }}>
                    <Tag size={10} />{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
