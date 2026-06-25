"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Type, Loader2, Copy, Check, Wand2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { TitleVariant } from "@/lib/ai";

type Language = "ro" | "en";

export default function TitlesToolPage() {
  const locale = useLocale();
  const isRo = locale === "ro";
  const { data: session, status } = useSession();
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("both");
  const [language, setLanguage] = useState<Language>(locale as Language);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TitleVariant[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  if (status === "loading") return null;
  if (!session) { router.push(`/${locale}/auth/login`); return null; }

  async function handleCopy(text: string, idx: number) {
    await navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResults([]);
    setLoading(true);
    try {
      const res = await fetch("/api/tools/titles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: description.trim(), platform, language }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Eroare"); return; }
      setResults(data as TitleVariant[]);
    } catch { setError(isRo ? "Eroare de retea. Incearca din nou." : "Network error. Try again."); }
    finally { setLoading(false); }
  }

  const btnBase: React.CSSProperties = {
    padding: "9px 20px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 600,
    fontFamily: "Rubik, sans-serif",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "1.5px solid transparent",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <Header />
      <main style={{ flex: 1, maxWidth: "720px", margin: "0 auto", padding: "100px 28px 80px", width: "100%" }}>

        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "4px 14px", borderRadius: "20px", background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.2)", marginBottom: "16px" }}>
            <Type size={13} color="#EC4899" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#EC4899", fontFamily: "Rubik,sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {isRo ? "Generator titluri A/B" : "A/B Title Generator"}
            </span>
          </div>
          <h1 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 800, fontSize: "clamp(26px,3.5vw,38px)", color: "var(--color-foreground)", lineHeight: 1.15, marginBottom: "10px" }}>
            {isRo ? "3 variante de titlu pentru acelasi produs" : "3 title variants for the same product"}
          </h1>
          <p style={{ fontSize: "15px", color: "var(--color-muted-foreground)", lineHeight: 1.65 }}>
            {isRo
              ? "AI genereaza 3 titluri cu strategii diferite. Testa-le si alege cel mai bun pentru anuntul tau."
              : "AI generates 3 titles with different strategies. Test them and choose the best one for your listing."}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "32px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--color-foreground)", fontFamily: "Rubik, sans-serif", marginBottom: "8px" }}>
              {isRo ? "Descrie produsul sau titlul curent *" : "Describe the product or current title *"}
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              minLength={5}
              maxLength={300}
              rows={3}
              placeholder={isRo
                ? "Ex: iPhone 13 Pro 128GB graphite, stare buna, baterie 89%, cutie originala..."
                : "Ex: iPhone 13 Pro 128GB graphite, good condition, 89% battery, original box..."}
              style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid rgba(212,153,26,0.2)", background: "rgba(13,13,34,0.6)", color: "var(--color-foreground)", fontSize: "14px", fontFamily: "Nunito Sans, sans-serif", lineHeight: 1.6, resize: "vertical", outline: "none", boxSizing: "border-box" }}
            />
            <p style={{ fontSize: "11px", color: "var(--color-muted-foreground)", marginTop: "4px", textAlign: "right" }}>
              {description.length}/300
            </p>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--color-foreground)", fontFamily: "Rubik, sans-serif", marginBottom: "10px" }}>
              {isRo ? "Platforma" : "Platform"}
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { key: "olx", label: "OLX" },
                { key: "vinted", label: "Vinted" },
                { key: "both", label: isRo ? "Ambele" : "Both" },
              ].map(p => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPlatform(p.key)}
                  style={{ ...btnBase, borderColor: platform === p.key ? "rgba(212,153,26,0.55)" : "rgba(255,255,255,0.1)", background: platform === p.key ? "rgba(212,153,26,0.12)" : "rgba(13,13,34,0.5)", color: platform === p.key ? "var(--primary-light)" : "var(--color-muted-foreground)", boxShadow: platform === p.key ? "0 0 0 3px rgba(212,153,26,0.1)" : "none" }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--color-foreground)", fontFamily: "Rubik, sans-serif", marginBottom: "10px" }}>
              {isRo ? "Limba continut generat" : "Generated content language"}
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              {([
                { key: "ro" as Language, label: isRo ? "Romana" : "Romanian" },
                { key: "en" as Language, label: isRo ? "Engleza" : "English" },
              ]).map(l => (
                <button
                  key={l.key}
                  type="button"
                  onClick={() => setLanguage(l.key)}
                  style={{ ...btnBase, borderColor: language === l.key ? "rgba(212,153,26,0.55)" : "rgba(255,255,255,0.1)", background: language === l.key ? "rgba(212,153,26,0.12)" : "rgba(13,13,34,0.5)", color: language === l.key ? "var(--primary-light)" : "var(--color-muted-foreground)", boxShadow: language === l.key ? "0 0 0 3px rgba(212,153,26,0.1)" : "none" }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || description.length < 5}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "15px", opacity: loading || description.length < 5 ? 0.6 : 1 }}
          >
            {loading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Wand2 size={18} />}
            {loading
              ? (isRo ? "AI genereaza..." : "AI generating...")
              : (isRo ? "Genereaza 3 variante" : "Generate 3 variants")}
          </button>
        </form>

        {error && (
          <div style={{ padding: "14px 18px", borderRadius: "12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444", fontSize: "14px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {results.map((variant, i) => (
              <div key={i} className="card" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ flexShrink: 0, width: "26px", height: "26px", borderRadius: "8px", background: "rgba(212,153,26,0.1)", border: "1px solid rgba(212,153,26,0.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, color: "var(--primary-light)", fontFamily: "Rubik, sans-serif" }}>
                      {i + 1}
                    </span>
                    <span style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "16px", color: "var(--color-foreground)", lineHeight: 1.3 }}>
                      {variant.title}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(variant.title, i)}
                    style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: "5px", padding: "7px 13px", borderRadius: "8px", border: `1px solid ${copied === i ? "rgba(16,185,129,0.4)" : "rgba(212,153,26,0.25)"}`, background: copied === i ? "rgba(16,185,129,0.1)" : "rgba(13,13,34,0.8)", color: copied === i ? "#10B981" : "var(--color-muted-foreground)", fontSize: "12px", fontWeight: 600, fontFamily: "Rubik, sans-serif", cursor: "pointer" }}
                  >
                    {copied === i ? <Check size={12} /> : <Copy size={12} />}
                    {copied === i ? (isRo ? "Copiat!" : "Copied!") : (isRo ? "Copiaza" : "Copy")}
                  </button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11px", color: "var(--color-muted-foreground)", background: "rgba(255,255,255,0.05)", padding: "2px 7px", borderRadius: "6px" }}>
                    {variant.title.length} {isRo ? "car." : "chars"}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--color-muted-foreground)", fontStyle: "italic" }}>{variant.explanation}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}