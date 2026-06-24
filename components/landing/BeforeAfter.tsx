import { useTranslations } from "next-intl";
import { X, CheckCircle, Tag } from "lucide-react";

export default function BeforeAfter() {
  const t = useTranslations("beforeAfter");

  return (
    <section style={{ padding: "80px 24px", background: "var(--color-muted)" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(28px, 3vw, 40px)", fontFamily: "Rubik, sans-serif", fontWeight: 700, marginBottom: "48px" }}>
          {t("title")}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "24px", alignItems: "center" }}>
          {/* Before */}
          <div
            className="card"
            style={{
              padding: "28px",
              borderColor: "rgba(220,38,38,0.2)",
              boxShadow: "0 2px 8px rgba(220,38,38,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(220,38,38,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={14} color="#DC2626" />
              </div>
              <span style={{ fontSize: "12px", fontWeight: 700, fontFamily: "Rubik, sans-serif", color: "#DC2626", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t("before_label")}
              </span>
            </div>

            <h4 style={{ fontFamily: "Rubik, sans-serif", fontSize: "16px", fontWeight: 600, marginBottom: "10px", color: "var(--color-foreground)" }}>
              {t("before_title")}
            </h4>
            <p style={{ fontSize: "14px", color: "var(--color-muted-foreground)", lineHeight: 1.6 }}>
              {t("before_desc")}
            </p>

            <div style={{ marginTop: "16px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "11px", color: "#DC2626", background: "rgba(220,38,38,0.08)", padding: "3px 8px", borderRadius: "6px" }}>
                0 taguri
              </span>
              <span style={{ fontSize: "11px", color: "#DC2626", background: "rgba(220,38,38,0.08)", padding: "3px 8px", borderRadius: "6px" }}>
                Fără detalii
              </span>
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(124,58,237,0.25)",
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <span style={{ fontSize: "10px", fontWeight: 700, fontFamily: "Rubik, sans-serif", color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>AI</span>
          </div>

          {/* After */}
          <div
            className="card"
            style={{
              padding: "28px",
              borderColor: "rgba(22,163,74,0.25)",
              boxShadow: "0 2px 8px rgba(22,163,74,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(22,163,74,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle size={14} color="#16A34A" />
              </div>
              <span style={{ fontSize: "12px", fontWeight: 700, fontFamily: "Rubik, sans-serif", color: "#16A34A", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t("after_label")}
              </span>
            </div>

            <h4 style={{ fontFamily: "Rubik, sans-serif", fontSize: "15px", fontWeight: 600, marginBottom: "10px", color: "var(--color-foreground)", lineHeight: 1.3 }}>
              {t("after_title")}
            </h4>
            <p style={{ fontSize: "13px", color: "var(--color-muted-foreground)", lineHeight: 1.65 }}>
              {t("after_desc")}
            </p>

            <div style={{ marginTop: "16px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {["iPhone 13 Pro", "128GB", "Graphite", "ProRAW", "baterie 89%"].map((tag) => (
                <span key={tag} style={{ fontSize: "11px", color: "var(--color-primary)", background: "rgba(124,58,237,0.08)", padding: "3px 8px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "3px" }}>
                  <Tag size={9} />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
