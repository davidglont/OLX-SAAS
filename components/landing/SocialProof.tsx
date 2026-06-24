import { useTranslations } from "next-intl";
import { Star, MapPin } from "lucide-react";

export default function SocialProof() {
  const t = useTranslations("socialProof");

  const stats = [
    { value: t("stat1_value"), label: t("stat1_label") },
    { value: t("stat2_value"), label: t("stat2_label") },
    { value: t("stat3_value"), label: t("stat3_label") },
  ];

  const testimonials = [
    { text: t("t1_text"), name: t("t1_name"), location: t("t1_location") },
    { text: t("t2_text"), name: t("t2_name"), location: t("t2_location") },
    { text: t("t3_text"), name: t("t3_name"), location: t("t3_location") },
  ];

  return (
    <section style={{ padding: "80px 24px", background: "white" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(28px, 3vw, 40px)", fontFamily: "Rubik, sans-serif", fontWeight: 700, marginBottom: "48px" }}>
          {t("title")}
        </h2>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "64px", maxWidth: "700px", margin: "0 auto 64px" }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ textAlign: "center", padding: "28px 16px", borderRadius: "16px", background: "var(--color-muted)", border: "1px solid var(--color-border)" }}>
              <div style={{ fontSize: "clamp(28px, 4vw, 40px)", fontFamily: "Rubik, sans-serif", fontWeight: 800, color: "var(--color-primary)", lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "13px", color: "var(--color-muted-foreground)", marginTop: "8px", fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {testimonials.map((t_item, i) => (
            <div key={i} className="card" style={{ padding: "28px" }}>
              <div style={{ display: "flex", gap: "2px", marginBottom: "16px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} color="#F59E0B" fill="#F59E0B" />
                ))}
              </div>
              <p style={{ fontSize: "15px", color: "var(--color-foreground)", lineHeight: 1.65, marginBottom: "20px", fontStyle: "italic" }}>
                &ldquo;{t_item.text}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "white", fontSize: "13px", fontWeight: 700, fontFamily: "Rubik, sans-serif" }}>
                    {t_item.name[0]}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, fontFamily: "Rubik, sans-serif" }}>{t_item.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--color-muted-foreground)", display: "flex", alignItems: "center", gap: "3px" }}>
                    <MapPin size={10} />
                    {t_item.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
