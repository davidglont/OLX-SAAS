"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Star, MapPin, TrendingUp, Clock, Award, Zap } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SocialProof() {
  const t = useTranslations("socialProof");
  const sectionRef  = useRef<HTMLElement>(null);
  const statsRef    = useRef<(HTMLDivElement | null)[]>([]);
  const headRef     = useRef<HTMLDivElement>(null);

  const stats = [
    { value: "3×",  label: t("stat1_label"), icon: TrendingUp, color: "#8B5CF6" },
    { value: "10s", label: t("stat2_label"), icon: Clock,      color: "#EC4899" },
    { value: "89%", label: t("stat3_label"), icon: Award,      color: "#10B981" },
  ];

  const testimonials = [
    { text: t("t1_text"), name: t("t1_name"), location: t("t1_location"), stars: 5 },
    { text: t("t2_text"), name: t("t2_name"), location: t("t2_location"), stars: 5 },
    { text: t("t3_text"), name: t("t3_name"), location: t("t3_location"), stars: 5 },
    { text: t("t4_text"), name: t("t4_name"), location: t("t4_location"), stars: 5 },
    { text: t("t5_text"), name: t("t5_name"), location: t("t5_location"), stars: 5 },
    { text: t("t6_text"), name: t("t6_name"), location: t("t6_location"), stars: 5 },
    { text: t("t7_text"), name: t("t7_name"), location: t("t7_location"), stars: 5 },
    { text: t("t8_text"), name: t("t8_name"), location: t("t8_location"), stars: 5 },
    { text: t("t1_text"), name: t("t1_name"), location: t("t1_location"), stars: 5 },
    { text: t("t2_text"), name: t("t2_name"), location: t("t2_location"), stars: 5 },
    { text: t("t3_text"), name: t("t3_name"), location: t("t3_location"), stars: 5 },
    { text: t("t4_text"), name: t("t4_name"), location: t("t4_location"), stars: 5 },
    { text: t("t5_text"), name: t("t5_name"), location: t("t5_location"), stars: 5 },
    { text: t("t6_text"), name: t("t6_name"), location: t("t6_location"), stars: 5 },
    { text: t("t7_text"), name: t("t7_name"), location: t("t7_location"), stars: 5 },
    { text: t("t8_text"), name: t("t8_name"), location: t("t8_location"), stars: 5 },
  ];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: headRef.current, start: "top 85%" } });

      statsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: 40, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out", delay: i * 0.1,
            scrollTrigger: { trigger: el, start: "top 88%" } });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="lp-section" style={{ padding: "120px 28px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "600px", height: "1px", background: "linear-gradient(to right, transparent, rgba(139,92,246,0.35), transparent)" }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Heading */}
        <div ref={headRef} style={{ textAlign: "center", marginBottom: "72px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 16px", borderRadius: "20px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", marginBottom: "20px" }}>
            <Star size={13} color="var(--primary-light)" fill="var(--primary-light)" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--primary-light)", fontFamily: "Rubik,sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {t("eyebrow")}
            </span>
          </div>
          <h2 className="display-text" style={{ fontSize: "clamp(32px,4vw,52px)", color: "var(--color-foreground)" }}>
            {t("title")}
          </h2>
        </div>

        {/* Stats */}
        <div className="stats-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", maxWidth: "760px", margin: "0 auto 80px" }}>
          {stats.map(({ value, label, icon: Icon, color }, i) => (
            <div
              key={label}
              ref={el => { statsRef.current[i] = el; }}
              className="card"
              style={{ padding: "32px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", bottom: "-40px", right: "-40px", width: "120px", height: "120px", borderRadius: "50%", background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`, pointerEvents: "none" }} />
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Icon size={22} color={color} />
              </div>
              <div style={{ fontSize: "clamp(32px,4vw,48px)", fontFamily: "Rubik,sans-serif", fontWeight: 800, color, lineHeight: 1, marginBottom: "8px" }}>
                {value}
              </div>
              <div style={{ fontSize: "13px", color: "var(--color-muted-foreground)", fontWeight: 500, lineHeight: 1.4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Infinite marquee */}
        <div style={{ overflow: "hidden", maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}>
          <div className="marquee-track">
            {testimonials.map((item, i) => (
              <div
                key={i}
                className="glass-card"
                style={{ minWidth: "320px", maxWidth: "320px", marginRight: "20px", padding: "24px", flexShrink: 0 }}
              >
                <div style={{ display: "flex", gap: "2px", marginBottom: "14px" }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} color="#F59E0B" fill="#F59E0B" />)}
                </div>
                <p style={{ fontSize: "14px", color: "var(--color-foreground)", lineHeight: 1.65, marginBottom: "18px", fontStyle: "italic" }}>
                  &ldquo;{item.text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#D4991A,#A67800)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "white", fontSize: "13px", fontWeight: 700, fontFamily: "Rubik,sans-serif" }}>{item.name[0]}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, fontFamily: "Rubik,sans-serif", color: "var(--color-foreground)", display: "flex", alignItems: "center", gap: "6px" }}>
                      {item.name}
                      <span style={{ fontSize: "10px", color: "#22C55E", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "2px" }}>
                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        {t("verified")}
                      </span>
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--color-muted-foreground)", display: "flex", alignItems: "center", gap: "3px" }}>
                      <MapPin size={10} />{item.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
