"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Shield, RotateCcw, Lock, ArrowRight } from "lucide-react";

export default function UrgencyBanner() {
  const locale = useLocale();
  const t = useTranslations("guarantee");

  const items = [
    { Icon: Shield,     title: t("money_back"), desc: t("money_back_desc") },
    { Icon: RotateCcw,  title: t("cancel"),     desc: t("cancel_desc")     },
    { Icon: Lock,       title: t("secure"),     desc: t("secure_desc")     },
  ];

  return (
    <section className="lp-urgency" style={{ padding: "0 28px 96px" }}>
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        background: "linear-gradient(135deg,rgba(212,153,26,0.07) 0%,rgba(224,123,57,0.04) 100%)",
        border: "1px solid rgba(212,153,26,0.18)",
        borderRadius: "24px",
        padding: "clamp(32px,5vw,52px) clamp(24px,5vw,56px)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h3 style={{ fontFamily: "Rubik,sans-serif", fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 700, color: "var(--color-foreground)", marginBottom: "10px" }}>
            {t("title")}
          </h3>
          <p style={{ fontSize: "15px", color: "var(--color-muted-foreground)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.6 }}>
            {t("subtitle")}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(20px,4vw,48px)", flexWrap: "wrap", marginBottom: "40px" }}>
          {items.map(({ Icon, title, desc }) => (
            <div key={title} style={{ display: "flex", alignItems: "flex-start", gap: "14px", maxWidth: "230px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(212,153,26,0.1)", border: "1px solid rgba(212,153,26,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={18} color="var(--primary-light)" />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-foreground)", fontFamily: "Rubik,sans-serif", marginBottom: "4px" }}>{title}</div>
                <div style={{ fontSize: "12px", color: "var(--color-muted-foreground)", lineHeight: 1.55 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link
            href={`/${locale}/auth/signup`}
            className="btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 36px", fontSize: "15px" }}
          >
            {t("cta")} <ArrowRight size={16} />
          </Link>
          <p style={{ fontSize: "12px", color: "var(--color-muted-foreground)", marginTop: "12px" }}>
            {t("cta_sub")}
          </p>
        </div>
      </div>
    </section>
  );
}
