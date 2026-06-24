"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";

export default function SignupPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Parola trebuie să aibă cel puțin 8 caractere.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Eroare la înregistrare.");
      setLoading(false);
      return;
    }
    await signIn("credentials", { email, password, redirect: false });
    router.push(`/${locale}/tool`);
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: `/${locale}/tool` });
  }

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", background: "var(--color-background)" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <Link href={`/${locale}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "32px", textDecoration: "none" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={20} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "20px" }}>
            Anunț<span style={{ color: "var(--color-primary)" }}>AI</span>
          </span>
        </Link>

        <div className="card" style={{ padding: "36px 32px" }}>
          <h1 style={{ fontFamily: "Rubik, sans-serif", fontSize: "24px", fontWeight: 700, textAlign: "center", marginBottom: "6px" }}>
            {t("signup_title")}
          </h1>
          <p style={{ textAlign: "center", color: "var(--color-muted-foreground)", fontSize: "14px", marginBottom: "28px" }}>
            {t("signup_subtitle")}
          </p>

          {/* Benefits */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "24px", padding: "14px 16px", background: "rgba(124,58,237,0.05)", borderRadius: "10px", border: "1px solid rgba(124,58,237,0.1)" }}>
            {[
              locale === "ro" ? "1 anunț gratuit pe zi" : "1 free listing per day",
              locale === "ro" ? "Fără card de credit" : "No credit card needed",
              locale === "ro" ? "Anulezi oricând" : "Cancel anytime",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--color-foreground)" }}>
                <CheckCircle size={13} color="var(--color-success)" />
                {item}
              </div>
            ))}
          </div>

          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            style={{ width: "100%", padding: "11px 16px", borderRadius: "10px", border: "1.5px solid var(--color-border)", background: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "14px", fontWeight: 600, fontFamily: "Rubik, sans-serif", cursor: googleLoading ? "not-allowed" : "pointer", marginBottom: "20px", transition: "all 0.2s", opacity: googleLoading ? 0.7 : 1 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            {googleLoading ? "..." : t("google_btn")}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
            <span style={{ fontSize: "12px", color: "var(--color-muted-foreground)", fontWeight: 500 }}>{t("or")}</span>
            <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
          </div>

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px" }}>
              <AlertCircle size={15} color="#DC2626" />
              <span style={{ fontSize: "13px", color: "#DC2626" }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>{t("name")}</label>
              <div style={{ position: "relative" }}>
                <User size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted-foreground)", pointerEvents: "none" }} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" style={{ paddingLeft: "36px" }} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>{t("email")}</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted-foreground)", pointerEvents: "none" }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" style={{ paddingLeft: "36px" }} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>{t("password")}</label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted-foreground)", pointerEvents: "none" }} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" minLength={8} style={{ paddingLeft: "36px" }} />
              </div>
              <p style={{ fontSize: "11px", color: "var(--color-muted-foreground)", marginTop: "4px" }}>
                {locale === "ro" ? "Minimum 8 caractere" : "Minimum 8 characters"}
              </p>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "15px", marginTop: "4px", opacity: loading ? 0.7 : 1 }}>
              {loading ? "..." : t("signup_btn")}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "var(--color-muted-foreground)" }}>
            {t("have_account")}{" "}
            <Link href={`/${locale}/auth/login`} style={{ color: "var(--color-primary)", fontWeight: 600 }}>
              {t("login_link")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
