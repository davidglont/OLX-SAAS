import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Clock } from "lucide-react";

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section style={{ padding: "80px 24px 64px", textAlign: "center", maxWidth: "1200px", margin: "0 auto" }}>
      <div className="animate-fade-in-up">
        <span className="badge badge-primary" style={{ marginBottom: "24px", display: "inline-flex" }}>
          <Zap size={12} style={{ marginRight: "6px" }} />
          {t("badge")}
        </span>

        <h1
          style={{
            fontFamily: "Rubik, sans-serif",
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 700,
            lineHeight: 1.1,
            color: "var(--color-foreground)",
            marginBottom: "24px",
            letterSpacing: "-0.02em",
          }}
        >
          {locale === "ro" ? (
            <>
              Vinde de <span style={{ color: "var(--color-primary)" }}>3×</span> mai repede
              <br />pe OLX și Vinted
            </>
          ) : (
            <>
              Sell <span style={{ color: "var(--color-primary)" }}>3×</span> faster
              <br />on OLX and Vinted
            </>
          )}
        </h1>

        <p
          style={{
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "var(--color-muted-foreground)",
            maxWidth: "600px",
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          {t("subtitle")}
        </p>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "48px" }}>
          <Link href={`/${locale}/auth/signup`} className="btn-primary" style={{ fontSize: "16px", padding: "14px 28px" }}>
            {t("cta_primary")}
            <ArrowRight size={18} />
          </Link>
          <Link href={`/${locale}/tool`} className="btn-secondary" style={{ fontSize: "16px", padding: "14px 28px" }}>
            {t("cta_secondary")}
          </Link>
        </div>

        <p style={{ fontSize: "13px", color: "var(--color-muted-foreground)" }}>
          {t("trust")}
        </p>
      </div>

      {/* Visual demo card */}
      <div
        style={{
          marginTop: "64px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
          maxWidth: "900px",
          margin: "64px auto 0",
        }}
      >
        {/* Upload side */}
        <div className="card" style={{ padding: "24px", textAlign: "left" }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: "80px",
                  borderRadius: "8px",
                  background: i === 1 ? "rgba(124,58,237,0.08)" : "var(--color-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `2px ${i === 1 ? "solid var(--color-primary)" : "dashed var(--color-border)"}`,
                }}
              >
                {i === 1 && <Zap size={20} color="var(--color-primary)" />}
              </div>
            ))}
          </div>
          <div style={{ height: "10px", borderRadius: "5px", background: "var(--color-muted)", width: "60%", marginBottom: "8px" }} />
          <div style={{ height: "10px", borderRadius: "5px", background: "var(--color-muted)", width: "40%" }} />
          <p style={{ fontSize: "12px", color: "var(--color-muted-foreground)", marginTop: "12px", fontWeight: 500 }}>
            {locale === "ro" ? "Poze încărcate" : "Photos uploaded"}
          </p>
        </div>

        {/* AI arrow */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 20px rgba(124,58,237,0.3)",
            }}
          >
            <Zap size={22} color="white" fill="white" />
          </div>
        </div>

        {/* Result side */}
        <div className="card" style={{ padding: "24px", textAlign: "left" }}>
          <div className="badge badge-success" style={{ marginBottom: "12px", fontSize: "11px" }}>
            {locale === "ro" ? "Gata de postat" : "Ready to post"}
          </div>
          <div style={{ height: "12px", borderRadius: "6px", background: "rgba(124,58,237,0.15)", width: "85%", marginBottom: "8px" }} />
          <div style={{ height: "8px", borderRadius: "4px", background: "var(--color-muted)", width: "70%", marginBottom: "6px" }} />
          <div style={{ height: "8px", borderRadius: "4px", background: "var(--color-muted)", width: "55%", marginBottom: "12px" }} />
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {[40, 55, 35, 48].map((w, i) => (
              <div key={i} style={{ height: "22px", width: `${w}px`, borderRadius: "11px", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            <Clock size={12} color="var(--color-muted-foreground)" />
            <span style={{ fontSize: "11px", color: "var(--color-muted-foreground)" }}>
              {locale === "ro" ? "Generat în 8 secunde" : "Generated in 8 seconds"}
            </span>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap", marginTop: "48px" }}>
        {[
          { icon: <Shield size={16} />, text: locale === "ro" ? "Date securizate" : "Secure data" },
          { icon: <Zap size={16} />, text: "GDPR" },
          { icon: <Clock size={16} />, text: locale === "ro" ? "Fără card necesar" : "No card required" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-muted-foreground)", fontSize: "13px" }}>
            <span style={{ color: "var(--color-primary)" }}>{item.icon}</span>
            {item.text}
          </div>
        ))}
      </div>
    </section>
  );
}
