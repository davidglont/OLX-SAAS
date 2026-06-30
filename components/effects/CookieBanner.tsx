"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "anuntai_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const acceptButtonRef = useRef<HTMLButtonElement>(null);
  const locale = typeof window !== "undefined"
    ? window.location.pathname.startsWith("/en") ? "en" : "ro"
    : "ro";

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (visible) acceptButtonRef.current?.focus();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") { decline(); return; }
      if (e.key !== "Tab") return;
      const el = dialogRef.current;
      if (!el) return;
      const focusable = Array.from(el.querySelectorAll<HTMLElement>("button, a[href]"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [visible]);

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
    <>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-live="polite"
        aria-label={isRo ? "Consimțământ cookie-uri" : "Cookie consent"}
        tabIndex={-1}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 99990,
          width: "min(560px, calc(100vw - 24px))",
          background: "rgba(15,12,30,0.92)",
          border: "1px solid rgba(212,153,26,0.25)",
          borderRadius: "16px",
          padding: "18px 20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,153,26,0.06)",
          backdropFilter: "blur(20px)",
          animation: "cookie-slide 0.45s cubic-bezier(0.16,1,0.3,1) forwards",
        }}
      >
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>🍪</span>
            <span style={{ fontSize: "13px", fontWeight: 700, fontFamily: "Rubik, sans-serif", color: "var(--color-foreground)" }}>
              {isRo ? "Folosim cookie-uri" : "We use cookies"}
            </span>
          </div>
          <button
            onClick={decline}
            aria-label="Închide"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", cursor: "pointer", color: "var(--color-muted-foreground)", padding: "4px 8px", lineHeight: 1, fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ×
          </button>
        </div>

        {/* Text */}
        <p style={{ fontSize: "12px", color: "var(--color-muted-foreground)", lineHeight: 1.65, marginBottom: "14px" }}>
          {isRo
            ? "Folosim cookie-uri esențiale pentru funcționarea platformei și, cu acordul tău, cookie-uri analitice pentru a îmbunătăți serviciul. "
            : "We use essential cookies for the platform to work and, with your consent, analytics cookies to improve the service. "}
          <Link href={`/${locale}/cookies`} style={{ color: "var(--primary-light)", textDecoration: "underline", textDecorationColor: "rgba(212,153,26,0.35)" }}>
            {isRo ? "Politica cookie" : "Cookie policy"}
          </Link>
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            ref={acceptButtonRef}
            onClick={accept}
            className="btn-primary"
            style={{ flex: 1, justifyContent: "center", padding: "10px 16px", fontSize: "13px", borderRadius: "10px" }}
          >
            {isRo ? "Accept toate" : "Accept all"}
          </button>
          <button
            onClick={decline}
            className="btn-secondary"
            style={{ flex: 1, justifyContent: "center", padding: "10px 16px", fontSize: "13px", borderRadius: "10px" }}
          >
            {isRo ? "Doar esențiale" : "Essential only"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes cookie-slide {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  );
}
