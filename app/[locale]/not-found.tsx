"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { Zap } from "lucide-react";

export default function NotFound() {
  const locale = useLocale();

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: "var(--bg)", textAlign: "center" }}>
      <Link href={`/${locale}`} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "40px", textDecoration: "none" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px var(--primary-glow)" }}>
          <Zap size={20} color="white" fill="white" />
        </div>
        <span style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "20px", color: "var(--color-foreground)" }}>
          Anunț<span style={{ color: "var(--primary-light)" }}>AI</span>
        </span>
      </Link>

      <div style={{ fontSize: "90px", fontWeight: 800, background: "linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1, marginBottom: "16px" }}>
        404
      </div>

      <h1 style={{ fontFamily: "Rubik, sans-serif", fontSize: "26px", fontWeight: 700, marginBottom: "12px", color: "var(--color-foreground)" }}>
        {locale === "ro" ? "Pagina nu a fost găsită" : "Page not found"}
      </h1>
      <p style={{ color: "var(--color-muted-foreground)", fontSize: "15px", maxWidth: "420px", lineHeight: 1.6, marginBottom: "36px" }}>
        {locale === "ro"
          ? "Linkul pe care l-ai accesat nu există sau a fost mutat. Verifică adresa sau întoarce-te acasă."
          : "The link you followed doesn't exist or has been moved. Check the URL or go back home."}
      </p>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href={`/${locale}`} className="btn-primary" style={{ textDecoration: "none", padding: "12px 28px" }}>
          {locale === "ro" ? "Înapoi acasă" : "Go home"}
        </Link>
        <Link href={`/${locale}/tool`} style={{ textDecoration: "none", padding: "12px 28px", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--color-foreground)", fontWeight: 600, fontSize: "14px" }}>
          {locale === "ro" ? "Încearcă toolul" : "Try the tool"}
        </Link>
      </div>
    </div>
  );
}
