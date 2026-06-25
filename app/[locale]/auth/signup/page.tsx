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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError(locale === "ro" ? "Parola trebuie să aibă cel puțin 8 caractere." : "Password must be at least 8 characters.");
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
      setError(data.error ?? (locale === "ro" ? "Eroare la înregistrare." : "Registration error."));
      setLoading(false);
      return;
    }
    await signIn("credentials", { email, password, redirect: false });
    router.push(`/${locale}/tool`);
  }

  const benefits = locale === "ro"
    ? ["1 anunț gratuit pe zi", "Fără card de credit", "Anulezi oricând"]
    : ["1 free listing per day", "No credit card needed", "Cancel anytime"];

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", background: "var(--bg)" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <Link href={`/${locale}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "32px", textDecoration: "none" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px var(--primary-glow)" }}>
            <Zap size={20} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "20px", color: "var(--color-foreground)" }}>
            Anunț<span style={{ color: "var(--primary-light)" }}>AI</span>
          </span>
        </Link>

        <div className="card" style={{ padding: "36px 32px" }}>
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
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px" }}>
              <AlertCircle size={15} color="var(--danger)" />
              <span style={{ fontSize: "13px", color: "var(--danger)" }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--color-foreground)" }}>{t("name")}</label>
              <div style={{ position: "relative" }}>
                <User size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted-foreground)", pointerEvents: "none" }} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" style={{ paddingLeft: "36px" }} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--color-foreground)" }}>{t("email")}</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted-foreground)", pointerEvents: "none" }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" style={{ paddingLeft: "36px" }} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--color-foreground)" }}>{t("password")}</label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted-foreground)", pointerEvents: "none" }} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" minLength={8} style={{ paddingLeft: "36px" }} />
              </div>
              <p style={{ fontSize: "11px", color: "var(--color-muted-foreground)", marginTop: "4px" }}>
                {locale === "ro" ? "Minimum 8 caractere" : "Minimum 8 characters"}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: "15px", marginTop: "4px", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "..." : t("signup_btn")}
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
    </div>
  );
}
