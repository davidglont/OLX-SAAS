"use client";

import { useTranslations, useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, Zap } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    key: "free" as const,
    price: 0,
    limit: 1,
    features: ["feature_listings", "feature_ai", "feature_tags", "feature_copy"],
    highlight: false,
  },
  {
    key: "pro" as const,
    price: 10,
    limit: 3,
    features: ["feature_listings", "feature_ai", "feature_tags", "feature_copy", "feature_history", "feature_platforms"],
    highlight: true,
  },
  {
    key: "proplus" as const,
    price: 15,
    limit: 5,
    features: ["feature_listings", "feature_ai", "feature_tags", "feature_copy", "feature_history", "feature_platforms"],
    highlight: false,
  },
  {
    key: "business" as const,
    price: 30,
    limit: 15,
    features: ["feature_listings", "feature_ai", "feature_tags", "feature_copy", "feature_history", "feature_platforms", "feature_priority"],
    highlight: false,
  },
];

export default function PricingSection() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleUpgrade(planKey: string) {
    if (!session) {
      router.push(`/${locale}/auth/signup`);
      return;
    }
    if (planKey === "free") {
      router.push(`/${locale}/tool`);
      return;
    }
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
    <section id="pricing" style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontFamily: "Rubik, sans-serif", fontWeight: 700, marginBottom: "12px" }}>
            {t("title")}
          </h2>
          <p style={{ fontSize: "17px", color: "var(--color-muted-foreground)" }}>
            {t("subtitle")}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "20px", alignItems: "start" }}>
          {plans.map((plan) => (
            <div
              key={plan.key}
              style={{
                borderRadius: "20px",
                padding: "28px 24px",
                background: plan.highlight ? "linear-gradient(145deg, #7C3AED 0%, #6366F1 100%)" : "white",
                border: plan.highlight ? "none" : "1.5px solid var(--color-border)",
                boxShadow: plan.highlight ? "0 16px 40px rgba(124,58,237,0.3)" : "0 2px 8px rgba(124,58,237,0.06)",
                position: "relative",
                transform: plan.highlight ? "scale(1.04)" : "none",
              }}
            >
              {plan.highlight && (
                <div
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #EC4899 0%, #F97316 100%)",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: 700,
                    fontFamily: "Rubik, sans-serif",
                    padding: "4px 14px",
                    borderRadius: "20px",
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 12px rgba(236,72,153,0.4)",
                  }}
                >
                  {t("most_popular")}
                </div>
              )}

              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <Zap size={16} color={plan.highlight ? "rgba(255,255,255,0.9)" : "var(--color-primary)"} fill={plan.highlight ? "rgba(255,255,255,0.9)" : "var(--color-primary)"} />
                  <span style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "16px", color: plan.highlight ? "white" : "var(--color-foreground)" }}>
                    {t(`${plan.key}_name` as "free_name" | "pro_name" | "proplus_name" | "business_name")}
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: plan.highlight ? "rgba(255,255,255,0.7)" : "var(--color-muted-foreground)" }}>
                  {t(`${plan.key}_desc` as "free_desc" | "pro_desc" | "proplus_desc" | "business_desc")}
                </p>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <span style={{ fontFamily: "Rubik, sans-serif", fontSize: "40px", fontWeight: 800, color: plan.highlight ? "white" : "var(--color-foreground)" }}>
                  €{plan.price}
                </span>
                {plan.price > 0 && (
                  <span style={{ fontSize: "14px", color: plan.highlight ? "rgba(255,255,255,0.7)" : "var(--color-muted-foreground)" }}>
                    /{t("monthly")}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleUpgrade(plan.key)}
                disabled={loading === plan.key}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: plan.highlight ? "none" : "1.5px solid var(--color-primary)",
                  background: plan.highlight ? "white" : "transparent",
                  color: plan.highlight ? "var(--color-primary)" : "var(--color-primary)",
                  fontFamily: "Rubik, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: loading === plan.key ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  marginBottom: "24px",
                  opacity: loading === plan.key ? 0.7 : 1,
                }}
              >
                {loading === plan.key ? "..." : plan.price === 0 ? t("cta_free") : t("cta_paid")}
              </button>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Check size={15} color={plan.highlight ? "rgba(255,255,255,0.9)" : "var(--color-success)"} />
                  <span style={{ fontSize: "13px", fontWeight: 600, color: plan.highlight ? "white" : "var(--color-foreground)" }}>
                    {plan.limit} {t("feature_listings")}
                  </span>
                </div>
                {plan.features.slice(1).map((feat) => (
                  <div key={feat} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Check size={15} color={plan.highlight ? "rgba(255,255,255,0.7)" : "var(--color-success)"} />
                    <span style={{ fontSize: "13px", color: plan.highlight ? "rgba(255,255,255,0.85)" : "var(--color-muted-foreground)" }}>
                      {t(feat as "feature_ai" | "feature_tags" | "feature_copy" | "feature_history" | "feature_platforms" | "feature_priority")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
