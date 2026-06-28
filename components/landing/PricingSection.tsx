"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, Zap, Star, Shield } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    key: "free" as const,
    price: 0,
    limit: 1,
    features: ["feature_listings", "feature_ai", "feature_tags", "feature_copy"],
    highlight: false,
    accentColor: "#7070A0",
  },
  {
    key: "pro" as const,
    price: 10,
    limit: 3,
    features: ["feature_listings", "feature_ai", "feature_tags", "feature_copy", "feature_history", "feature_platforms"],
    highlight: true,
    accentColor: "#8B5CF6",
  },
  {
    key: "proplus" as const,
    price: 20,
    limit: 5,
    features: ["feature_listings", "feature_ai", "feature_tags", "feature_copy", "feature_history", "feature_platforms", "feature_market_basic", "feature_best_days"],
    highlight: false,
    accentColor: "#EC4899",
  },
  {
    key: "business" as const,
    price: 30,
    limit: 15,
    features: ["feature_listings", "feature_ai", "feature_tags", "feature_copy", "feature_history", "feature_platforms", "feature_market_basic", "feature_best_days", "feature_market_advanced", "feature_price_opt", "feature_priority"],
    highlight: false,
    accentColor: "#10B981",
  },
];

type PlanName = "free_name" | "pro_name" | "proplus_name" | "business_name";
type PlanDesc = "free_desc" | "pro_desc" | "proplus_desc" | "business_desc";
type FeatureKey = "feature_ai" | "feature_tags" | "feature_copy" | "feature_history" | "feature_platforms" | "feature_priority" | "feature_market_basic" | "feature_market_advanced" | "feature_price_opt" | "feature_best_days" | "feature_category_report";

// Features that deserve a highlighted style (new market features)
const marketFeatures = new Set(["feature_market_basic", "feature_market_advanced", "feature_price_opt", "feature_best_days", "feature_category_report"]);

export default function PricingSection() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [annual, setAnnual] = useState(false);

  const displayPrice = (p: number) => annual ? Math.round(p * 0.8) : p;
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const cardsRef   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: headRef.current, start: "top 85%" } });

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { opacity: 0, y: 56, scale: 0.93 },
          { opacity: 1, y: 0, scale: i === 1 ? 1.03 : 1, duration: 0.85, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
            delay: i * 0.1 });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / (rect.height / 2)) * -5;
    const ry = ((e.clientX - cx) / (rect.width  / 2)) *  5;
    gsap.to(card, { rotateX: rx, rotateY: ry, duration: 0.3, ease: "power2.out", transformPerspective: 800 });
  };

  const handleMouseLeave = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power3.out" });
  };

  async function handleUpgrade(planKey: string) {
    if (!session) { router.push(`/${locale}/auth/signup`); return; }
    if (planKey === "free") { router.push(`/${locale}/tool`); return; }
    setLoading(planKey);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  }

  return (
    <section id="pricing" ref={sectionRef} className="lp-section" style={{ padding: "120px 28px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "600px", height: "1px", background: "linear-gradient(to right, transparent, rgba(139,92,246,0.35), transparent)" }} />
      <div className="glow-orb" style={{ width: "700px", height: "400px", background: "radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", borderRadius: "50%" }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
        <div ref={headRef} style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 16px", borderRadius: "20px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", marginBottom: "20px" }}>
            <Zap size={13} color="var(--primary-light)" fill="var(--primary-light)" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--primary-light)", fontFamily: "Rubik,sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
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

        {/* Annual / Monthly toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "56px" }}>
          <span style={{ fontSize: "14px", color: annual ? "var(--color-muted-foreground)" : "var(--color-foreground)", fontWeight: annual ? 400 : 600 }}>
            {t("toggle_monthly")}
          </span>
          <button
            onClick={() => setAnnual(a => !a)}
            style={{ width: "48px", height: "26px", borderRadius: "13px", border: "none", cursor: "pointer", position: "relative", background: annual ? "var(--primary)" : "rgba(255,255,255,0.12)", transition: "background 0.25s ease", flexShrink: 0 }}
            aria-label="Toggle annual billing"
          >
            <span style={{ position: "absolute", top: "3px", left: annual ? "25px" : "3px", width: "20px", height: "20px", borderRadius: "50%", background: "white", transition: "left 0.25s ease", boxShadow: "0 1px 4px rgba(0,0,0,0.35)" }} />
          </button>
          <span style={{ fontSize: "14px", color: annual ? "var(--color-foreground)" : "var(--color-muted-foreground)", fontWeight: annual ? 600 : 400, display: "flex", alignItems: "center", gap: "8px" }}>
            {t("toggle_annual")}
            {annual && (
              <span style={{ fontSize: "11px", fontWeight: 700, fontFamily: "Rubik,sans-serif", color: "var(--primary-light)", background: "rgba(212,153,26,0.12)", border: "1px solid rgba(212,153,26,0.28)", borderRadius: "20px", padding: "2px 10px", letterSpacing: "0.04em" }}>
                {t("save_badge")}
              </span>
            )}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", alignItems: "start" }}>
          {plans.map((plan, index) => (
            <div
              key={plan.key}
              ref={el => { cardsRef.current[index] = el; }}
              onMouseMove={e => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
              style={{
                position: "relative",
                borderRadius: "20px",
                padding: "32px 28px",
                background: plan.highlight
                  ? `linear-gradient(145deg, rgba(109,40,217,0.35) 0%, rgba(139,92,246,0.15) 100%)`
                  : "rgba(13,13,34,0.7)",
                border: plan.highlight
                  ? "1px solid rgba(139,92,246,0.5)"
                  : "1px solid rgba(255,255,255,0.07)",
                boxShadow: plan.highlight
                  ? "0 24px 64px rgba(139,92,246,0.2), 0 0 0 1px rgba(139,92,246,0.25)"
                  : "0 4px 24px rgba(0,0,0,0.3)",
                backdropFilter: "blur(16px)",
                willChange: "transform",
                transformStyle: "preserve-3d",
              }}
            >
              {plan.highlight && (
                <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#8B5CF6,#6D28D9)", color: "white", fontSize: "11px", fontWeight: 700, fontFamily: "Rubik,sans-serif", padding: "5px 16px", borderRadius: "20px", whiteSpace: "nowrap", boxShadow: "0 4px 16px rgba(139,92,246,0.5)", display: "flex", alignItems: "center", gap: "5px", letterSpacing: "0.04em" }}>
                  <Star size={10} fill="white" color="white" /> {t("most_popular")}
                </div>
              )}

              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: `${plan.accentColor}22`, border: `1px solid ${plan.accentColor}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Zap size={13} color={plan.accentColor} fill={plan.accentColor} />
                  </div>
                  <span style={{ fontFamily: "Rubik,sans-serif", fontWeight: 700, fontSize: "16px", color: "var(--color-foreground)" }}>
                    {t(`${plan.key}_name` as PlanName)}
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "var(--color-muted-foreground)", lineHeight: 1.5 }}>
                  {t(`${plan.key}_desc` as PlanDesc)}
                </p>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                  <span style={{ fontFamily: "Rubik,sans-serif", fontSize: "clamp(36px,3vw,48px)", fontWeight: 800, color: plan.highlight ? "var(--primary-light)" : "var(--color-foreground)" }}>
                    {"€"}{displayPrice(plan.price)}
                  </span>
                  {plan.price > 0 && (
                    <span style={{ fontSize: "13px", color: "var(--color-muted-foreground)" }}>/{t("monthly")}</span>
                  )}
                </div>
                {plan.price === 0 && (
                  <div style={{ fontSize: "12px", color: "var(--color-muted-foreground)", marginTop: "2px" }}>{t("forever_free")}</div>
                )}
                {annual && plan.price > 0 && (
                  <div style={{ fontSize: "11px", color: "var(--primary-light)", marginTop: "4px", fontWeight: 600 }}>
                    €{displayPrice(plan.price) * 12} {t("annual_note")}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleUpgrade(plan.key)}
                disabled={loading === plan.key}
                className={plan.highlight ? "btn-primary" : "btn-secondary"}
                style={{ width: "100%", justifyContent: "center", marginBottom: plan.price > 0 ? "8px" : "24px", padding: "12px", fontSize: "14px", opacity: loading === plan.key ? 0.7 : 1, cursor: loading === plan.key ? "not-allowed" : "pointer" }}
              >
                {loading === plan.key ? t("processing") : plan.price === 0 ? t("cta_free") : t("cta_paid")}
              </button>

              {plan.price > 0 && (
                <div style={{ textAlign: "center", marginBottom: "18px" }}>
                  <span style={{ fontSize: "11px", color: "var(--color-muted-foreground)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Shield size={10} color="var(--color-muted-foreground)" />
                    {t("guarantee")}
                  </span>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: `${plan.accentColor}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Check size={11} color={plan.accentColor} />
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-foreground)" }}>
                    {plan.limit} {t("feature_listings")}
                  </span>
                </div>
                {plan.features.slice(1).map(feat => {
                  const isMarket = marketFeatures.has(feat);
                  return (
                    <div key={feat} style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                      <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: isMarket ? "rgba(212,153,26,0.15)" : `${plan.accentColor}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Check size={11} color={isMarket ? "var(--primary-light)" : plan.accentColor} />
                      </div>
                      <span style={{ fontSize: "13px", color: isMarket ? "var(--primary-light)" : "var(--color-muted-foreground)", fontWeight: isMarket ? 600 : 400 }}>
                        {t(feat as FeatureKey)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}