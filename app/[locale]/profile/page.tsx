"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { User, Lock, Check, AlertCircle, Loader2, ChevronLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const locale = useLocale();
  const router = useRouter();
  const isRo = locale === "ro";

  const [name, setName] = useState(session?.user?.name ?? "");
  const [nameStatus, setNameStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [nameError, setNameError] = useState("");

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwStatus, setPwStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [pwError, setPwError] = useState("");

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-background)" }}>
        <Loader2 size={32} color="var(--primary-light)" style={{ animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  if (status === "unauthenticated") { router.push(`/${locale}/auth/login`); return null; }

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    setNameStatus("loading");
    setNameError("");
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) { setNameError(data.error); setNameStatus("error"); return; }
    await update({ name });
    setNameStatus("ok");
    setTimeout(() => setNameStatus("idle"), 3000);
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPw !== confirmPw) {
      setPwError(isRo ? "Parolele nu coincid" : "Passwords do not match");
      setPwStatus("error");
      return;
    }
    setPwStatus("loading");
    setPwError("");
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
    });
    const data = await res.json();
    if (!res.ok) { setPwError(data.error); setPwStatus("error"); return; }
    setPwStatus("ok");
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setTimeout(() => setPwStatus("idle"), 3000);
  }

  const plan = session?.user?.plan ?? "free";
  const role = (session?.user as { role?: string })?.role ?? "user";

  const planLabels: Record<string, string> = {
    free: "Free", pro: "Pro", proplus: "Pro+", business: "Business",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <Header />
      <main style={{ flex: 1, maxWidth: "640px", margin: "0 auto", width: "100%", padding: "80px 24px 60px" }}>
        <button
          onClick={() => router.back()}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--color-muted-foreground)", background: "none", border: "none", cursor: "pointer", padding: "0", marginBottom: "28px", fontFamily: "Rubik, sans-serif" }}
        >
          <ChevronLeft size={16} />
          {isRo ? "Inapoi" : "Back"}
        </button>

        <h1 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 800, fontSize: "28px", color: "var(--color-foreground)", marginBottom: "6px" }}>
          {isRo ? "Setari cont" : "Account settings"}
        </h1>
        <p style={{ fontSize: "14px", color: "var(--color-muted-foreground)", marginBottom: "36px" }}>
          {session?.user?.email}
          {role === "admin" && (
            <span style={{ marginLeft: "10px", fontSize: "11px", padding: "2px 8px", borderRadius: "10px", background: "rgba(212,153,26,0.1)", border: "1px solid rgba(212,153,26,0.2)", color: "var(--primary-light)", fontFamily: "Rubik, sans-serif", fontWeight: 700 }}>
              Admin
            </span>
          )}
          <span style={{ marginLeft: "8px", fontSize: "11px", padding: "2px 8px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-muted-foreground)", fontFamily: "Rubik, sans-serif", fontWeight: 600 }}>
            {planLabels[plan] ?? plan}
          </span>
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Name section */}
          <div className="card" style={{ padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(212,153,26,0.1)", border: "1px solid rgba(212,153,26,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={15} color="var(--primary-light)" />
              </div>
              <h2 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "16px", color: "var(--color-foreground)" }}>
                {isRo ? "Informatii personale" : "Personal information"}
              </h2>
            </div>

            <form onSubmit={saveName} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, fontFamily: "Rubik, sans-serif", color: "var(--color-muted-foreground)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {isRo ? "Nume afisat" : "Display name"}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setNameStatus("idle"); }}
                  minLength={2}
                  maxLength={50}
                  required
                  placeholder={isRo ? "Numele tau" : "Your name"}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: `1px solid ${nameStatus === "error" ? "rgba(239,68,68,0.4)" : "rgba(212,153,26,0.2)"}`, background: "rgba(13,13,34,0.6)", color: "var(--color-foreground)", fontSize: "14px", fontFamily: "Nunito Sans, sans-serif", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {nameStatus === "error" && (
                <div style={{ display: "flex", alignItems: "center", gap: "7px", color: "#EF4444", fontSize: "13px" }}>
                  <AlertCircle size={14} />
                  {nameError}
                </div>
              )}

              <button
                type="submit"
                disabled={nameStatus === "loading" || name.trim() === (session?.user?.name ?? "")}
                className="btn-primary"
                style={{ alignSelf: "flex-start", padding: "10px 22px", fontSize: "14px", opacity: nameStatus === "loading" ? 0.7 : 1 }}
              >
                {nameStatus === "loading" ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : nameStatus === "ok" ? <Check size={15} /> : null}
                {nameStatus === "ok" ? (isRo ? "Salvat!" : "Saved!") : (isRo ? "Salveaza" : "Save")}
              </button>
            </form>
          </div>

          {/* Password section */}
          <div className="card" style={{ padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(212,153,26,0.1)", border: "1px solid rgba(212,153,26,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Lock size={15} color="var(--primary-light)" />
              </div>
              <h2 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "16px", color: "var(--color-foreground)" }}>
                {isRo ? "Schimba parola" : "Change password"}
              </h2>
            </div>

            <form onSubmit={savePassword} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, fontFamily: "Rubik, sans-serif", color: "var(--color-muted-foreground)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {isRo ? "Parola curenta" : "Current password"}
                </label>
                <input
                  type="password"
                  value={currentPw}
                  onChange={e => { setCurrentPw(e.target.value); setPwStatus("idle"); }}
                  required
                  placeholder="••••••••"
                  style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1px solid rgba(212,153,26,0.2)", background: "rgba(13,13,34,0.6)", color: "var(--color-foreground)", fontSize: "14px", fontFamily: "Nunito Sans, sans-serif", outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, fontFamily: "Rubik, sans-serif", color: "var(--color-muted-foreground)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {isRo ? "Parola noua" : "New password"}
                </label>
                <input
                  type="password"
                  value={newPw}
                  onChange={e => { setNewPw(e.target.value); setPwStatus("idle"); }}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: `1px solid ${newPw && newPw !== confirmPw && confirmPw ? "rgba(239,68,68,0.4)" : "rgba(212,153,26,0.2)"}`, background: "rgba(13,13,34,0.6)", color: "var(--color-foreground)", fontSize: "14px", fontFamily: "Nunito Sans, sans-serif", outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, fontFamily: "Rubik, sans-serif", color: "var(--color-muted-foreground)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {isRo ? "Confirma parola noua" : "Confirm new password"}
                </label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={e => { setConfirmPw(e.target.value); setPwStatus("idle"); }}
                  required
                  placeholder="••••••••"
                  style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: `1px solid ${confirmPw && confirmPw !== newPw ? "rgba(239,68,68,0.4)" : "rgba(212,153,26,0.2)"}`, background: "rgba(13,13,34,0.6)", color: "var(--color-foreground)", fontSize: "14px", fontFamily: "Nunito Sans, sans-serif", outline: "none", boxSizing: "border-box" }}
                />
                {confirmPw && confirmPw !== newPw && (
                  <p style={{ fontSize: "12px", color: "#EF4444", marginTop: "5px" }}>
                    {isRo ? "Parolele nu coincid" : "Passwords do not match"}
                  </p>
                )}
              </div>

              {pwStatus === "error" && (
                <div style={{ display: "flex", alignItems: "center", gap: "7px", color: "#EF4444", fontSize: "13px" }}>
                  <AlertCircle size={14} />
                  {pwError}
                </div>
              )}

              {pwStatus === "ok" && (
                <div style={{ display: "flex", alignItems: "center", gap: "7px", color: "#10B981", fontSize: "13px" }}>
                  <Check size={14} />
                  {isRo ? "Parola schimbata cu succes!" : "Password changed successfully!"}
                </div>
              )}

              <button
                type="submit"
                disabled={pwStatus === "loading" || !currentPw || !newPw || !confirmPw || newPw !== confirmPw}
                className="btn-primary"
                style={{ alignSelf: "flex-start", padding: "10px 22px", fontSize: "14px", opacity: pwStatus === "loading" ? 0.7 : 1 }}
              >
                {pwStatus === "loading" ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : null}
                {isRo ? "Schimba parola" : "Change password"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}