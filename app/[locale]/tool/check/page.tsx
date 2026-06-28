"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BarChart2, Loader2, CheckCircle, XCircle, AlertCircle, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { ListingCheck } from "@/lib/ai";

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div style={{ position: "relative", height: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "100%", background: color, borderRadius: "4px", transform: `scaleX(${score * 0.1})`, transformOrigin: "left", transition: "transform 0.8s ease" }} />
    </div>
  );
}

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 8 ? "#10B981" : score >= 6 ? "#F0B429" : "#EF4444";
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "72px", height: "72px", borderRadius: "50%", border: `3px solid ${color}`, background: `${color}12` }}>
      <span style={{ fontFamily: "Rubik, sans-serif", fontWeight: 800, fontSize: "22px", color }}>{score}</span>
    </div>
  );
}

export default function CheckToolPage() {
  const locale = useLocale();
  const isRo = locale === "ro";
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("both");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ListingCheck | null>(null);
  const [error, setError] = useState("");

  if (status === "loading") return null;
  if (!session) { router.push(`/${locale}/auth/login`); return null; }

  const userPlan = (session.user as { plan?: string })?.plan ?? "free";
  if (userPlan === "free") {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
          <div className="card" style={{ padding: "48px 36px", textAlign: "center", maxWidth: "480px", width: "100%" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(212,153,26,0.1)", border: "1px solid rgba(212,153,26,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Lock size={24} color="var(--primary-light)" />
            </div>
            <h2 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 800, fontSize: "22px", color: "var(--color-foreground)", marginBottom: "10px" }}>
              {isRo ? "Tool disponibil din plan Pro" : "Tool available from Pro plan"}
            </h2>
            <p style={{ fontSize: "14px", color: "var(--color-muted-foreground)", lineHeight: 1.7, marginBottom: "28px" }}>
              {isRo ? "Checker-ul de listing cu scor și sugestii AI este disponibil pentru utilizatorii Pro și superior." : "The listing checker with AI score and suggestions is available for Pro and above users."}
            </p>
            <Link href={`/${locale}/pricing`} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 28px", fontSize: "15px", justifyContent: "center" }}>
              {isRo ? "Vezi planurile" : "See plans"} <ArrowRight size={16} />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/tools/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), platform, language: locale }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Eroare"); return; }
      setResult(data as ListingCheck);
    } catch { setError(isRo ? "Eroare de retea. Incearca din nou." : "Network error. Try again."); }
    finally { setLoading(false); }
  }

  const scoreColor = (s: number) => s >= 8 ? "#10B981" : s >= 6 ? "#F0B429" : "#EF4444";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <Header />
      <main className="tool-main" style={{ flex: 1, maxWidth: "720px", margin: "0 auto", padding: "100px 28px 80px", width: "100%" }}>

        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "4px 14px", borderRadius: "20px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", marginBottom: "16px" }}>
            <BarChart2 size={13} color="#10B981" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#10B981", fontFamily: "Rubik,sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {isRo ? "Checker anunt" : "Listing checker"}
            </span>
          </div>
          <h1 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 800, fontSize: "clamp(26px,3.5vw,38px)", color: "var(--color-foreground)", lineHeight: 1.15, marginBottom: "10px" }}>
            {isRo ? "Cat de bun e anuntul tau?" : "How good is your listing?"}
          </h1>
          <p style={{ fontSize: "15px", color: "var(--color-muted-foreground)", lineHeight: 1.65 }}>
            {isRo
              ? "Lipeste un anunt existent si AI-ul ii da un scor detaliat cu sugestii concrete de imbunatatire."
              : "Paste an existing listing and AI gives it a detailed score with concrete improvement suggestions."}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--color-foreground)", fontFamily: "Rubik, sans-serif", marginBottom: "8px" }}>
              {isRo ? "Titlul anuntului *" : "Listing title *"}
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              minLength={3}
              maxLength={200}
              placeholder={isRo ? "Ex: Vand iPhone 13 Pro stare buna" : "Ex: Selling iPhone 13 Pro good condition"}
              style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1px solid rgba(212,153,26,0.2)", background: "rgba(13,13,34,0.6)", color: "var(--color-foreground)", fontSize: "14px", fontFamily: "Nunito Sans, sans-serif", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--color-foreground)", fontFamily: "Rubik, sans-serif", marginBottom: "8px" }}>
              {isRo ? "Descrierea anuntului *" : "Listing description *"}
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              minLength={10}
              maxLength={1000}
              rows={5}
              placeholder={isRo ? "Lipeste descrierea completa a anuntului tau..." : "Paste the full description of your listing..."}
              style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(212,153,26,0.2)", background: "rgba(13,13,34,0.6)", color: "var(--color-foreground)", fontSize: "14px", fontFamily: "Nunito Sans, sans-serif", lineHeight: 1.6, resize: "vertical", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--color-foreground)", fontFamily: "Rubik, sans-serif", marginBottom: "8px" }}>
              {isRo ? "Platforma" : "Platform"}
            </label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {[
                { key: "olx", label: "OLX" },
                { key: "vinted", label: "Vinted" },
                { key: "both", label: isRo ? "Ambele" : "Both" },
              ].map(p => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPlatform(p.key)}
                  style={{ padding: "8px 18px", borderRadius: "10px", border: `1px solid ${platform === p.key ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.1)"}`, background: platform === p.key ? "rgba(16,185,129,0.1)" : "transparent", color: platform === p.key ? "#10B981" : "var(--color-muted-foreground)", fontSize: "13px", fontWeight: 600, fontFamily: "Rubik, sans-serif", cursor: "pointer", transition: "all 0.2s" }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || title.length < 3 || description.length < 10}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "15px", opacity: loading || title.length < 3 || description.length < 10 ? 0.6 : 1 }}
          >
            {loading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <BarChart2 size={18} />}
            {loading
              ? (isRo ? "AI analizeaza..." : "AI analyzing...")
              : (isRo ? "Analizeaza anuntul" : "Analyze listing")}
          </button>
        </form>

        {error && (
          <div style={{ padding: "14px 18px", borderRadius: "12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444", fontSize: "14px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Overall score */}
            <div className="card" style={{ padding: "24px", display: "flex", gap: "20px", alignItems: "center" }}>
              <ScoreCircle score={result.overallScore} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "16px", color: "var(--color-foreground)", marginBottom: "12px" }}>
                  {isRo ? "Scor general" : "Overall score"}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { label: isRo ? "Titlu" : "Title", score: result.titleScore },
                    { label: isRo ? "Descriere" : "Description", score: result.descriptionScore },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontSize: "12px", color: "var(--color-muted-foreground)" }}>{item.label}</span>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: scoreColor(item.score) }}>{item.score}/10</span>
                      </div>
                      <ScoreBar score={item.score} color={scoreColor(item.score)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feedback */}
            <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { label: isRo ? "Feedback titlu" : "Title feedback", text: result.titleFeedback, score: result.titleScore },
                { label: isRo ? "Feedback descriere" : "Description feedback", text: result.descriptionFeedback, score: result.descriptionScore },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontFamily: "Rubik, sans-serif", fontWeight: 600, fontSize: "13px", color: "var(--color-foreground)", marginBottom: "6px" }}>{item.label}</div>
                  <p style={{ fontSize: "13px", color: "var(--color-muted-foreground)", lineHeight: 1.65 }}>{item.text}</p>
                </div>
              ))}
            </div>

            {/* Strengths */}
            {result.strengths?.length > 0 && (
              <div className="card" style={{ padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <CheckCircle size={15} color="#10B981" />
                  <span style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "14px", color: "var(--color-foreground)" }}>
                    {isRo ? "Ce functioneaza bine" : "What works well"}
                  </span>
                </div>
                {result.strengths.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: "8px" }}>
                    <CheckCircle size={13} color="#10B981" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <p style={{ fontSize: "13px", color: "var(--color-muted-foreground)", lineHeight: 1.6 }}>{s}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Improvements */}
            {result.improvements?.length > 0 && (
              <div className="card" style={{ padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <AlertCircle size={15} color="#F0B429" />
                  <span style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "14px", color: "var(--color-foreground)" }}>
                    {isRo ? "Sugestii de imbunatatire" : "Improvement suggestions"}
                  </span>
                </div>
                {result.improvements.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: "8px" }}>
                    <XCircle size={13} color="#F0B429" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <p style={{ fontSize: "13px", color: "var(--color-muted-foreground)", lineHeight: 1.6 }}>{s}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}