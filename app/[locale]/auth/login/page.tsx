"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    setLoading(true);
    const res = await signIn("credentials", { email: email.toLowerCase(), password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError(locale === "ro" ? "Email sau parolă incorectă." : "Incorrect email or password.");
    } else {
      router.push(`/${locale}/tool`);
    }
  }

  return (
    <main id="main-content" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", background: "var(--bg)" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
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
            {t("login_title")}
          </h1>
          <p style={{ textAlign: "center", color: "var(--color-muted-foreground)", fontSize: "14px", marginBottom: "28px" }}>
            {t("login_subtitle")}
          </p>

          {error && (
            <div role="alert" aria-live="assertive" style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px" }}>
              <AlertCircle size={15} color="var(--danger)" />
              <span style={{ fontSize: "13px", color: "var(--danger)" }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label htmlFor="login-email" style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--color-foreground)" }}>
                {t("email")}
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted-foreground)", pointerEvents: "none" }} />
                <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="exemplu@email.com" style={{ paddingLeft: "36px" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label htmlFor="login-password" style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-foreground)" }}>
                  {t("password")}
                </label>
                <Link href={`/${locale}/auth/forgot-password`} style={{ fontSize: "12px", color: "var(--primary-light)", textDecoration: "none" }}>
                  {t("forgot")}
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted-foreground)", pointerEvents: "none" }} />
                <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" placeholder="••••••••" style={{ paddingLeft: "36px" }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: "15px", marginTop: "4px", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (locale === "ro" ? "Se procesează..." : "Processing...") : t("login_btn")}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "var(--color-muted-foreground)" }}>
            {t("no_account")}{" "}
            <Link href={`/${locale}/auth/signup`} style={{ color: "var(--primary-light)", fontWeight: 600, textDecoration: "none" }}>
              {t("signup_link")}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
