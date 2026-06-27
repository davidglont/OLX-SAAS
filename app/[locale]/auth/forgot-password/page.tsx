"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Zap, Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.toLowerCase() }),
    });
    // Always show success to prevent email enumeration
    setSent(true);
    setLoading(false);
  }

  const isRo = locale === "ro";

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", background: "var(--bg)" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <Link href={`/${locale}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "32px", textDecoration: "none" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px var(--primary-glow)" }}>
            <Zap size={20} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "20px", color: "var(--color-foreground)" }}>
            Anunț<span style={{ color: "var(--primary-light)" }}>AI</span>
          </span>
        </Link>

        <div className="card" style={{ padding: "36px 32px" }}>
          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <CheckCircle size={28} color="var(--success)" />
              </div>
              <h2 style={{ fontFamily: "Rubik,sans-serif", fontWeight: 700, fontSize: "20px", color: "var(--color-foreground)", marginBottom: "10px" }}>
                {isRo ? "Email trimis!" : "Email sent!"}
              </h2>
              <p style={{ fontSize: "14px", color: "var(--color-muted-foreground)", lineHeight: 1.6, marginBottom: "24px" }}>
                {isRo
                  ? `Dacă există un cont cu adresa ${email}, vei primi instrucțiuni de resetare a parolei.`
                  : `If an account exists with ${email}, you'll receive password reset instructions.`}
              </p>
              <Link href={`/${locale}/auth/login`} className="btn-secondary" style={{ fontSize: "14px", padding: "11px 24px" }}>
                <ArrowLeft size={14} /> {isRo ? "Înapoi la autentificare" : "Back to login"}
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily: "Rubik, sans-serif", fontSize: "22px", fontWeight: 700, textAlign: "center", marginBottom: "8px", color: "var(--color-foreground)" }}>
                {isRo ? "Resetare parolă" : "Reset password"}
              </h1>
              <p style={{ textAlign: "center", color: "var(--color-muted-foreground)", fontSize: "14px", marginBottom: "28px" }}>
                {isRo ? "Introdu emailul tău și îți trimitem instrucțiuni." : "Enter your email and we'll send you reset instructions."}
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--color-foreground)" }}>
                    Email
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted-foreground)", pointerEvents: "none" }} />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" style={{ paddingLeft: "36px" }} placeholder="email@exemplu.com" />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: "15px", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "..." : (isRo ? "Trimite instrucțiuni" : "Send instructions")}
                </button>
              </form>

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Link href={`/${locale}/auth/login`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--color-muted-foreground)", textDecoration: "none" }}>
                  <ArrowLeft size={13} /> {isRo ? "Înapoi la autentificare" : "Back to login"}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
