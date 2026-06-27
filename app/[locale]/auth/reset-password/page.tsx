"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Zap, Lock, CheckCircle, AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const isRo = locale === "ro";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) setError(isRo ? "Link invalid sau expirat." : "Invalid or expired link.");
  }, [token, isRo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError(isRo ? "Parola trebuie să aibă cel puțin 8 caractere." : "Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError(isRo ? "Parolele nu coincid." : "Passwords do not match.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? (isRo ? "Eroare. Încearcă din nou." : "Error. Please try again."));
      return;
    }
    setDone(true);
    setTimeout(() => router.push(`/${locale}/auth/login`), 2500);
  }

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
          {done ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <CheckCircle size={28} color="var(--success)" />
              </div>
              <h2 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "20px", color: "var(--color-foreground)", marginBottom: "10px" }}>
                {isRo ? "Parolă actualizată!" : "Password updated!"}
              </h2>
              <p style={{ fontSize: "14px", color: "var(--color-muted-foreground)" }}>
                {isRo ? "Vei fi redirecționat la autentificare..." : "Redirecting to login..."}
              </p>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily: "Rubik, sans-serif", fontSize: "22px", fontWeight: 700, textAlign: "center", marginBottom: "8px", color: "var(--color-foreground)" }}>
                {isRo ? "Parolă nouă" : "New password"}
              </h1>
              <p style={{ textAlign: "center", color: "var(--color-muted-foreground)", fontSize: "14px", marginBottom: "28px" }}>
                {isRo ? "Alege o parolă sigură pentru contul tău." : "Choose a secure password for your account."}
              </p>

              {error && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px" }}>
                  <AlertCircle size={15} color="var(--danger)" />
                  <span style={{ fontSize: "13px", color: "var(--danger)" }}>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--color-foreground)" }}>
                    {isRo ? "Parolă nouă" : "New password"}
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted-foreground)", pointerEvents: "none" }} />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" placeholder="••••••••" style={{ paddingLeft: "36px" }} />
                  </div>
                  <p style={{ fontSize: "11px", color: "var(--color-muted-foreground)", marginTop: "4px" }}>
                    {isRo ? "Minimum 8 caractere" : "Minimum 8 characters"}
                  </p>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--color-foreground)" }}>
                    {isRo ? "Confirmă parola" : "Confirm password"}
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted-foreground)", pointerEvents: "none" }} />
                    <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} autoComplete="new-password" placeholder="••••••••" style={{ paddingLeft: "36px" }} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: "15px", marginTop: "4px", opacity: loading || !token ? 0.7 : 1 }}
                >
                  {loading ? "..." : (isRo ? "Salvează parola" : "Save password")}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
