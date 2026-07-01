"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Zap, CheckCircle, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const locale = useLocale();
  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) {
      setErrorMsg(locale === "ro" ? "Link invalid sau incomplet." : "Invalid or incomplete link.");
      setState("error");
      return;
    }
    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (res.ok) {
          setState("success");
        } else {
          const data = await res.json().catch(() => ({}));
          setErrorMsg(data.error ?? (locale === "ro" ? "Eroare la verificare." : "Verification failed."));
          setState("error");
        }
      })
      .catch(() => {
        setErrorMsg(locale === "ro" ? "Eroare de rețea." : "Network error.");
        setState("error");
      });
  }, [locale]);

  const logo = (
    <Link href={`/${locale}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "32px", textDecoration: "none" }}>
      <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px var(--primary-glow)" }}>
        <Zap size={20} color="white" fill="white" />
      </div>
      <span style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "20px", color: "var(--color-foreground)" }}>
        Anunț<span style={{ color: "var(--primary-light)" }}>AI</span>
      </span>
    </Link>
  );

  if (state === "loading") {
    return (
      <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", background: "var(--bg)" }}>
        <div style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
          {logo}
          <div className="card auth-card" style={{ padding: "48px 32px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid rgba(212,153,26,0.2)", borderTopColor: "var(--primary-light)", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: "var(--color-muted-foreground)", fontSize: "14px" }}>
              {locale === "ro" ? "Se verifică emailul..." : "Verifying email..."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (state === "error") {
    return (
      <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", background: "var(--bg)" }}>
        <div style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
          {logo}
          <div className="card auth-card" style={{ padding: "48px 32px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <XCircle size={28} color="var(--danger)" />
            </div>
            <h1 style={{ fontFamily: "Rubik, sans-serif", fontSize: "20px", fontWeight: 700, marginBottom: "8px", color: "var(--color-foreground)" }}>
              {locale === "ro" ? "Link invalid" : "Invalid link"}
            </h1>
            <p style={{ color: "var(--color-muted-foreground)", fontSize: "14px", marginBottom: "28px" }}>
              {errorMsg || (locale === "ro" ? "Link-ul este invalid sau a expirat." : "The link is invalid or has expired.")}
            </p>
            <Link href={`/${locale}/auth/signup`} className="btn-primary" style={{ display: "inline-flex", justifyContent: "center", width: "100%", padding: "12px", fontSize: "15px" }}>
              {locale === "ro" ? "Creează un cont nou" : "Create a new account"}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", background: "var(--bg)" }}>
      <div style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
        {logo}
        <div className="card auth-card" style={{ padding: "48px 32px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <CheckCircle size={28} color="var(--success)" />
          </div>
          <h1 style={{ fontFamily: "Rubik, sans-serif", fontSize: "20px", fontWeight: 700, marginBottom: "8px", color: "var(--color-foreground)" }}>
            {locale === "ro" ? "Email confirmat!" : "Email confirmed!"}
          </h1>
          <p style={{ color: "var(--color-muted-foreground)", fontSize: "14px", marginBottom: "28px" }}>
            {locale === "ro" ? "Contul tău a fost verificat. Te poți autentifica acum." : "Your account has been verified. You can now sign in."}
          </p>
          <Link href={`/${locale}/auth/login?verified=1`} className="btn-primary" style={{ display: "inline-flex", justifyContent: "center", width: "100%", padding: "12px", fontSize: "15px" }}>
            {locale === "ro" ? "Autentifică-te" : "Sign in"}
          </Link>
        </div>
      </div>
    </main>
  );
}
