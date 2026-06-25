"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "anuntai_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const locale = typeof window !== "undefined"
    ? window.location.pathname.startsWith("/en") ? "en" : "ro"
    : "ro";

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  const isRo = locale === "ro";

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={isRo ? "Consimțământ cookie-uri" : "Cookie consent"}
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 99990,
        width: "min(620px, calc(100vw - 32px))",
        background: "var(--surface-2)",
        border: "1px solid rgba(212,153,26,0.22)",
        borderRadius: "18px",
        padding: "20px 22px",
        boxShadow: "0 16px 56px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,153,26,0.08)",
        animation: "cookie-slide 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        backdropFilter: "blur(16px)",
      }}
    >
      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
        <div style={{ flexShrink: 0, width: "36px", height: "36px", borderRadius: "10px", background: "rgba(212,153,26,0.12)", border: "1px solid rgba(212,153,26,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Cookie size={18} color="var(--primary-light)" />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "13px", fontWeight: 700, fontFamily: "Rubik, sans-serif", color: "var(--color-foreground)", marginBottom: "4px" }}>
            {isRo ? "Folosim cookie-uri" : "We use cookies"}
          </p>
          <p style={{ fontSize: "12px", color: "var(--color-muted-foreground)", lineHeight: 1.6, marginBottom: "14px" }}>
            {isRo
              ? "Folosim cookie-uri esențiale pentru funcționarea platformei și, cu acordul tău, cookie-uri analitice pentru a îmbunătăți serviciul. "
              : "We use essential cookies for the platform to work and, with your consent, analytics cookies to improve the service. "}
            <Link href={`/${locale}/cookies`} style={{ color: "var(--primary-light)", textDecoration: "underline", textDecorationColor: "rgba(212,153,26,0.4)" }}>
              {isRo ? "Politica cookie" : "Cookie policy"}
            </Link>
          </p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={accept}
              className="btn-primary"
              style={{ padding: "9px 22px", fontSize: "13px", borderRadius: "10px" }}
            >
              {isRo ? "Accept toate" : "Accept all"}
            </button>
            <button
              onClick={decline}
              className="btn-secondary"
              style={{ padding: "9px 18px", fontSize: "13px", borderRadius: "10px" }}
            >
              {isRo ? "Doar esențiale" : "Essential only"}
            </button>
          </div>
        </div>

        <button
          onClick={decline}
          aria-label="Închide"
          style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "var(--color-muted-foreground)", padding: "2px", lineHeight: 0 }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
