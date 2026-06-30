"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";

export default function SignupPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const { status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.push(`/${locale}/tool`);
  }, [status, locale, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid rgba(212,153,26,0.2)", borderTopColor: "var(--primary-light)", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError(locale === "ro" ? "Parola trebuie să aibă cel puțin 8 caractere." : "Password must be at least 8 characters.");
      return;
    }
    if (!terms) {
      setError(locale === "ro" ? "Trebuie să accepți termenii și condițiile." : "You must accept the terms and conditions.");
      return;
    }
    setLoading(true);
    const normalizedEmail = email.toLowerCase();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email: normalizedEmail, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? (locale === "ro" ? "Eroare la înregistrare." : "Registration error."));
      setLoading(false);
      return;
    }
    await signIn("credentials", { email: normalizedEmail, password, redirect: false });
    router.push(`/${locale}/tool`);
  }

  const benefits = locale === "ro"
    ? ["1 anunț gratuit pe zi", "Fără card de credit", "Anulezi oricând"]
    : ["1 free listing per day", "No credit card needed", "Cancel anytime"];

  return (
    <main id="main-content" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", background: "var(--bg)" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <Link href={`/${locale}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "32px", textDecoration: "none" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px var(--primary-glow)" }}>
            <Zap size={20} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "20px", color: "var(--color-foreground)" }}>
            Anunț<span style={{ color: "var(--primary-light)" }}>AI</span>
          </span>
        </Link>

        <div className="card auth-card" style={{ padding: "36px 32px" }}>
          <h1 style={{ fontFamily: "Rubik, sans-serif", fontSize: "22px", fontWeight: 700, textAlign: "center", marginBottom: "6px", color: "var(--color-foreground)" }}>
            {t("signup_title")}
          </h1>
          <p style={{ textAlign: "center", color: "var(--color-muted-foreground)", fontSize: "14px", marginBottom: "24px" }}>
            {t("signup_subtitle")}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "24px", padding: "14px 16px", background: "rgba(var(--primary-rgb, 212,153,26),0.06)", borderRadius: "10px", border: "1px solid var(--border)" }}>
            {benefits.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--color-foreground)" }}>
                <CheckCircle size={13} color="var(--success)" />
                {item}
              </div>
            ))}
          </div>

          {error && (
            <div role="alert" aria-live="assertive" style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px" }}>
              <AlertCircle size={15} color="var(--danger)" />
              <span style={{ fontSize: "13px", color: "var(--danger)" }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label htmlFor="signup-name" style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--color-foreground)" }}>{t("name")}</label>
              <div style={{ position: "relative" }}>
                <User size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted-foreground)", pointerEvents: "none" }} />
                <input id="signup-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" placeholder={locale === "ro" ? "Ion Popescu" : "John Doe"} style={{ paddingLeft: "36px" }} />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--color-foreground)" }}>{t("email")}</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted-foreground)", pointerEvents: "none" }} />
                <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="exemplu@email.com" style={{ paddingLeft: "36px" }} />
              </div>
            </div>

            <div>
              <label htmlFor="signup-password" style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--color-foreground)" }}>{t("password")}</label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted-foreground)", pointerEvents: "none" }} />
                <input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" minLength={8} placeholder="••••••••" style={{ paddingLeft: "36px" }} />
              </div>
              <p style={{ fontSize: "11px", color: "var(--color-muted-foreground)", marginTop: "4px" }}>
                {locale === "ro" ? "Minimum 8 caractere" : "Minimum 8 characters"}
              </p>
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", marginTop: "4px" }}>
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                style={{ marginTop: "2px", accentColor: "var(--primary-light)", width: "16px", height: "16px", flexShrink: 0, cursor: "pointer" }}
              />
              <span style={{ fontSize: "12px", color: "var(--color-muted-foreground)", lineHeight: 1.5 }}>
                {locale === "ro" ? "Am citit și accept " : "I have read and accept the "}
                <Link href={`/${locale}/terms`} style={{ color: "var(--primary-light)", textDecoration: "none", fontWeight: 600 }}>
                  {locale === "ro" ? "Termenii și Condițiile" : "Terms and Conditions"}
                </Link>
                {locale === "ro" ? " și " : " and "}
                <Link href={`/${locale}/privacy`} style={{ color: "var(--primary-light)", textDecoration: "none", fontWeight: 600 }}>
                  {locale === "ro" ? "Politica de Confidențialitate" : "Privacy Policy"}
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !terms}
              aria-busy={loading}
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: "15px", marginTop: "4px", opacity: loading || !terms ? 0.6 : 1 }}
            >
              {loading ? (locale === "ro" ? "Se procesează..." : "Processing...") : t("signup_btn")}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "var(--color-muted-foreground)" }}>
            {t("have_account")}{" "}
            <Link href={`/${locale}/auth/login`} style={{ color: "var(--primary-light)", fontWeight: 600, textDecoration: "none" }}>
              {t("login_link")}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
