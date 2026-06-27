"use client";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Zap, Cpu } from "lucide-react";

export default function Footer() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer style={{ borderTop: "1px solid rgba(212,153,26,0.12)", background: "var(--bg-2)", marginTop: "auto" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 28px 32px" }}>

        {/* Top row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "40px", marginBottom: "40px" }}>
          {/* Brand */}
          <div style={{ maxWidth: "360px" }}>
            <Link href={`/${locale}`} style={{ display: "inline-flex", alignItems: "center", gap: "9px", textDecoration: "none", marginBottom: "14px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "linear-gradient(135deg, #D4991A 0%, #A67800 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(212,153,26,0.3)" }}>
                <Zap size={16} color="white" fill="white" />
              </div>
              <span style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "17px", color: "var(--color-foreground)" }}>
                Anunț<span style={{ color: "var(--primary-light)" }}>AI</span>
              </span>
            </Link>
            <p style={{ fontSize: "13px", color: "var(--color-muted-foreground)", lineHeight: 1.7, marginBottom: "20px" }}>
              Optimizează-ți anunțurile pe OLX și Vinted cu inteligență artificială. Titlu, descriere și taguri perfecte în 10 secunde.
            </p>

            {/* Powered by Neural Core — link to neuralcore.cc */}
            <a
              href="https://neuralcore.cc"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "5px 12px 5px 9px", borderRadius: "20px", border: "1px solid rgba(212,153,26,0.25)", background: "rgba(212,153,26,0.07)", textDecoration: "none", transition: "border-color 0.2s, background 0.2s" }}
            >
              <Cpu size={13} color="var(--primary-light)" />
              <span style={{ fontSize: "11px", color: "var(--color-muted-foreground)", fontFamily: "Nunito Sans, sans-serif" }}>Powered by</span>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--primary-light)", fontFamily: "Rubik, sans-serif", letterSpacing: "0.04em" }}>Neural Core</span>
            </a>
          </div>

          {/* Links grid */}
          <div style={{ display: "flex", gap: "56px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary-light)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Rubik, sans-serif", marginBottom: "14px" }}>
                Produs
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { href: `/${locale}`, label: t("home") },
                  { href: `/${locale}/tool`, label: t("tool") },
                  { href: `/${locale}/pricing`, label: t("pricing") },
                  { href: `/${locale}/dashboard`, label: t("dashboard") },
                ].map(link => (
                  <Link key={link.href} href={link.href} style={{ fontSize: "13px", color: "var(--color-muted-foreground)", textDecoration: "none", transition: "color 0.2s" }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary-light)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Rubik, sans-serif", marginBottom: "14px" }}>
                {locale === "ro" ? "Companie" : "Company"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { href: `/${locale}/about`, label: locale === "ro" ? "Despre noi" : "About" },
                  { href: `/${locale}/faq`, label: "FAQ" },
                  { href: `/${locale}/contact`, label: "Contact" },
                ].map(link => (
                  <Link key={link.href} href={link.href} style={{ fontSize: "13px", color: "var(--color-muted-foreground)", textDecoration: "none", transition: "color 0.2s" }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary-light)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Rubik, sans-serif", marginBottom: "14px" }}>
                Legal
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { href: `/${locale}/privacy`, label: locale === "ro" ? "Confidențialitate" : "Privacy Policy" },
                  { href: `/${locale}/terms`, label: locale === "ro" ? "Termeni și Condiții" : "Terms of Service" },
                  { href: `/${locale}/cookies`, label: locale === "ro" ? "Politica Cookie" : "Cookie Policy" },
                ].map(link => (
                  <Link key={link.href} href={link.href} style={{ fontSize: "13px", color: "var(--color-muted-foreground)", textDecoration: "none", transition: "color 0.2s" }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(212,153,26,0.1)", marginBottom: "24px" }} />

        {/* Bottom row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "12px", color: "var(--color-muted-foreground)" }}>
            © {year} AnunțAI. Toate drepturile rezervate.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {["ro", "en"].map(loc => (
              <Link
                key={loc}
                href={`/${loc}`}
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "Rubik, sans-serif",
                  color: loc === locale ? "var(--primary-light)" : "var(--color-muted-foreground)",
                  textDecoration: "none",
                  letterSpacing: "0.06em",
                }}
              >
                {loc.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
