import { useTranslations } from "next-intl";
import { Upload, Sparkles, Copy } from "lucide-react";

const steps = [
  { icon: Upload, key: "step1" },
  { icon: Sparkles, key: "step2" },
  { icon: Copy, key: "step3" },
];

export default function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <section style={{ padding: "80px 24px", background: "white" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontFamily: "Rubik, sans-serif", fontWeight: 700, marginBottom: "12px" }}>
            {t("title")}
          </h2>
          <p style={{ fontSize: "17px", color: "var(--color-muted-foreground)", maxWidth: "480px", margin: "0 auto" }}>
            {t("subtitle")}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
          {steps.map(({ icon: Icon, key }, index) => (
            <div key={key} className="card" style={{ padding: "32px 28px", position: "relative", overflow: "hidden" }}>
              {/* Step number watermark */}
              <div
                style={{
                  position: "absolute",
                  top: "-16px",
                  right: "20px",
                  fontSize: "96px",
                  fontFamily: "Rubik, sans-serif",
                  fontWeight: 800,
                  color: "rgba(124,58,237,0.06)",
                  lineHeight: 1,
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {index + 1}
              </div>

              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(99,102,241,0.12) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <Icon size={24} color="var(--color-primary)" />
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "var(--color-primary)",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "Rubik, sans-serif",
                  marginBottom: "12px",
                }}
              >
                {index + 1}
              </div>

              <h3 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 600, fontSize: "18px", marginBottom: "10px" }}>
                {t(`${key}_title` as "step1_title" | "step2_title" | "step3_title")}
              </h3>
              <p style={{ color: "var(--color-muted-foreground)", fontSize: "15px", lineHeight: 1.65 }}>
                {t(`${key}_desc` as "step1_desc" | "step2_desc" | "step3_desc")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
