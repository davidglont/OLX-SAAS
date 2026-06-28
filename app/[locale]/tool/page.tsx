"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Sparkles, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UploadZone from "@/components/tool/UploadZone";
import ResultsPanel from "@/components/tool/ResultsPanel";
import type { AnalysisResult } from "@/lib/ai";

type Platform = "olx" | "vinted" | "both";
type Language = "ro" | "en";
type VintedType = "original" | "replica";

async function fileToBase64(file: File): Promise<{ data: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve({ data: dataUrl.split(",")[1], mediaType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const btnToggle = (active: boolean): React.CSSProperties => ({
  padding: "9px 20px",
  borderRadius: "10px",
  border: `1.5px solid ${active ? "rgba(212,153,26,0.55)" : "rgba(255,255,255,0.09)"}`,
  background: active ? "rgba(212,153,26,0.12)" : "rgba(13,13,34,0.5)",
  color: active ? "var(--primary-light)" : "var(--color-muted-foreground)",
  fontSize: "14px",
  fontWeight: 600,
  fontFamily: "Rubik, sans-serif",
  cursor: "pointer",
  transition: "all 0.2s",
  boxShadow: active ? "0 0 0 3px rgba(212,153,26,0.09)" : "none",
});

export default function ToolPage() {
  const { data: session, status } = useSession();
  const t = useTranslations("tool");
  const locale = useLocale();
  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState<Platform>("olx");
  const [language, setLanguage] = useState<Language>(locale as Language);
  const [vintedType, setVintedType] = useState<VintedType>("original");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push(`/${locale}/auth/login`);
  }, [status, locale, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-background)" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid rgba(212,153,26,0.2)", borderTopColor: "var(--primary-light)", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const recommendedIndex = result?.photos.find((p) => p.isRecommendedCover)?.index;
  const showVintedType = platform === "vinted" || platform === "both";

  async function handleAnalyze() {
    if (files.length === 0) return;
    setLoading(true);
    setError("");
    setResult(null);
    setLimitReached(false);
    setSaved(false);

    try {
      const images = await Promise.all(files.map(fileToBase64));
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images, description, platform, language, vintedType: showVintedType ? vintedType : undefined }),
      });

      let data: Record<string, unknown>;
      try {
        data = await res.json();
      } catch {
        setError("Serverul nu a putut fi contactat. Incearca din nou.");
        return;
      }

      if (res.status === 403 && data.code === "LIMIT_REACHED") { setLimitReached(true); return; }
      if (!res.ok) { setError((data.error as string) ?? t("error")); return; }

      setResult(data as AnalysisResult);
      setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100);
    } catch {
      setError("Eroare de retea. Verifica conexiunea si incearca din nou.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!result) return;
    await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, inputDesc: description, title: result.title, description: result.description, tags: JSON.stringify(result.tags), photoCount: files.length, photoScores: JSON.stringify(result.photos) }),
    });
    setSaved(true);
  }

  const platforms: { key: Platform; label: string }[] = [
    { key: "olx", label: t("platform_olx") },
    { key: "vinted", label: t("platform_vinted") },
    { key: "both", label: t("platform_both") },
  ];

  const languages: { key: Language; label: string }[] = [
    { key: "ro", label: t("lang_ro") },
    { key: "en", label: t("lang_en") },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <Header />
      <main className="tool-main" style={{ flex: 1, maxWidth: "900px", margin: "0 auto", width: "100%", padding: "80px 20px 60px" }}>
        <div style={{ marginBottom: "36px" }}>
          <h1 style={{ fontFamily: "Rubik, sans-serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, marginBottom: "8px" }}>
            {t("title")}
          </h1>
          <p style={{ color: "var(--color-muted-foreground)", fontSize: "16px" }}>{t("subtitle")}</p>
        </div>

        <div className="card" style={{ padding: "28px", marginBottom: "24px", borderRadius: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            <UploadZone files={files} onChange={setFiles} recommendedIndex={recommendedIndex} />

            {/* Platform */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, fontFamily: "Rubik, sans-serif", marginBottom: "10px", color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {t("platform_label")}
              </label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {platforms.map(({ key, label }) => (
                  <button key={key} onClick={() => setPlatform(key)} style={btnToggle(platform === key)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Vinted type — only shown for Vinted/Both */}
            {showVintedType && (
              <div style={{ padding: "16px", borderRadius: "14px", background: "rgba(212,153,26,0.04)", border: "1px solid rgba(212,153,26,0.14)" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, fontFamily: "Rubik, sans-serif", marginBottom: "10px", color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  <ShieldCheck size={13} color="var(--primary-light)" />
                  {locale === "ro" ? "Tip produs (Vinted)" : "Product type (Vinted)"}
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setVintedType("original")} style={btnToggle(vintedType === "original")}>
                    {locale === "ro" ? "Original / Autentic" : "Original / Authentic"}
                  </button>
                  <button onClick={() => setVintedType("replica")} style={{ ...btnToggle(vintedType === "replica"), borderColor: vintedType === "replica" ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.09)", background: vintedType === "replica" ? "rgba(239,68,68,0.1)" : "rgba(13,13,34,0.5)", color: vintedType === "replica" ? "#EF4444" : "var(--color-muted-foreground)", boxShadow: vintedType === "replica" ? "0 0 0 3px rgba(239,68,68,0.08)" : "none" }}>
                    Replica / Rep
                  </button>
                </div>
                {vintedType === "replica" && (
                  <p style={{ fontSize: "12px", color: "rgba(239,68,68,0.8)", marginTop: "8px" }}>
                    {locale === "ro" ? "AI va include mentionarea corecta a replicii in anunt" : "AI will correctly mention the replica in the listing"}
                  </p>
                )}
              </div>
            )}

            {/* Language */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, fontFamily: "Rubik, sans-serif", marginBottom: "10px", color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {t("language_label")}
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                {languages.map(({ key, label }) => (
                  <button key={key} onClick={() => setLanguage(key)} style={btnToggle(language === key)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, fontFamily: "Rubik, sans-serif", marginBottom: "8px", color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {t("description_label")}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("description_placeholder")}
                maxLength={500}
                rows={3}
                style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid rgba(212,153,26,0.18)", background: "rgba(10,10,24,0.7)", color: "var(--color-foreground)", fontSize: "14px", fontFamily: "Nunito Sans, sans-serif", lineHeight: 1.6, resize: "vertical", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(212,153,26,0.45)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(212,153,26,0.18)"}
              />
              <p style={{ fontSize: "11px", color: "var(--color-muted-foreground)", marginTop: "4px", textAlign: "right" }}>
                {description.length}/500
              </p>
            </div>

            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "12px", padding: "12px 16px" }}>
                <AlertCircle size={16} color="#DC2626" />
                <span style={{ fontSize: "14px", color: "#DC2626" }}>{error}</span>
              </div>
            )}

            {limitReached && (
              <div style={{ background: "rgba(212,153,26,0.06)", border: "1.5px solid rgba(212,153,26,0.2)", borderRadius: "14px", padding: "18px 20px" }}>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--primary-light)", marginBottom: "12px" }}>
                  {t("limit_reached")}
                </p>
                <button onClick={() => router.push(`/${locale}#pricing`)} className="btn-primary" style={{ fontSize: "14px", padding: "10px 20px" }}>
                  {t("upgrade_btn")} <ArrowRight size={15} />
                </button>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading || files.length === 0}
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "15px", fontSize: "16px", borderRadius: "14px", opacity: loading || files.length === 0 ? 0.55 : 1, cursor: loading || files.length === 0 ? "not-allowed" : "pointer", boxShadow: files.length > 0 && !loading ? "0 8px 32px rgba(212,153,26,0.35)" : "none" }}
            >
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  {t("analyzing")}
                </>
              ) : (
                <><Sparkles size={18} />{t("analyze_btn")}</>
              )}
            </button>
          </div>
        </div>

        {result && (
          <div>
            <h2 style={{ fontFamily: "Rubik, sans-serif", fontSize: "22px", fontWeight: 700, marginBottom: "20px" }}>
              {t("results_title")}
            </h2>
            <ResultsPanel result={result} files={files} onSave={handleSave} saved={saved} />
          </div>
        )}
      </main>
      <Footer />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}