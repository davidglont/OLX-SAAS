import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  const t = useTranslations("nav");
  const locale = useLocale();

  return (
    <footer style={{ borderTop: "1px solid var(--color-border)", background: "white", marginTop: "auto" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px", display: "flex", flexWrap: "wrap", gap: "32px", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={15} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "16px", color: "var(--color-foreground)" }}>
            Anunț<span style={{ color: "var(--color-primary)" }}>AI</span>
          </span>
        </div>

        <nav style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          {[
            { href: `/${locale}`, label: t("home") },
            { href: `/${locale}/tool`, label: t("tool") },
            { href: `/${locale}/pricing`, label: t("pricing") },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ fontSize: "14px", color: "var(--color-muted-foreground)", textDecoration: "none" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p style={{ fontSize: "13px", color: "var(--color-muted-foreground)" }}>
          © {new Date().getFullYear()} AnunțAI. Toate drepturile rezervate.
        </p>
      </div>
    </footer>
  );
}
