"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UploadZone from "@/components/tool/UploadZone";
import ResultsPanel from "@/components/tool/ResultsPanel";
import type { AnalysisResult } from "@/lib/ai";

type Platform = "olx" | "vinted" | "both";
type Language = "ro" | "en";

async function fileToBase64(file: File): Promise<{ data: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      resolve({ data: base64, mediaType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ToolPage() {
  const { data: session, status } = useSession();
  const t = useTranslations("tool");
  const locale = useLocale();
  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState<Platform>("olx");
  const [language, setLanguage] = useState<Language>(locale as Language);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [saved, setSaved] = useState(false);

  if (status === "unauthenticated") {
    router.push(`/${locale}/auth/login`);
    return null;
  }

  const recommendedIndex = result?.photos.find((p) => p.isRecommendedCover)?.index;

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
        body: JSON.stringify({ images, description, platform, language }),
      });

      const data = await res.json();

      if (res.status === 403 && data.code === "LIMIT_REACHED") {
        setLimitReached(true);
        return;
      }

      if (!res.ok) {
        setError(data.error ?? t("common_error" as "upload_title"));
        return;
      }

      setResult(data as AnalysisResult);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch {
      setError("Eroare de conexiune. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!result) return;
    await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform,
        inputDesc: description,
        title: result.title,
        description: result.description,
        tags: JSON.stringify(result.tags),
        photoCount: files.length,
        photoScores: JSON.stringify(result.photos),
      }),
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
      <main style={{ flex: 1, maxWidth: "900px", margin: "0 auto", width: "100%", padding: "40px 24px" }}>
        <div style={{ marginBottom: "36px" }}>
          <h1 style={{ fontFamily: "Rubik, sans-serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, marginBottom: "8px" }}>
            {t("title")}
          </h1>
          <p style={{ color: "var(--color-muted-foreground)", fontSize: "16px" }}>{t("subtitle")}</p>
        </div>

        {/* Input form */}
        <div className="card" style={{ padding: "28px", marginBottom: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Upload */}
            <div>
              <UploadZone files={files} onChange={setFiles} recommendedIndex={recommendedIndex} />
            </div>

            {/* Platform */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, fontFamily: "Rubik, sans-serif", marginBottom: "10px", color: "var(--color-foreground)" }}>
                {t("platform_label")}
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                {platforms.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setPlatform(key)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: "10px",
                      border: `1.5px solid ${platform === key ? "var(--color-primary)" : "var(--color-border)"}`,
                      background: platform === key ? "rgba(124,58,237,0.08)" : "white",
                      color: platform === key ? "var(--color-primary)" : "var(--color-muted-foreground)",
                      fontSize: "14px",
                      fontWeight: 600,
                      fontFamily: "Rubik, sans-serif",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, fontFamily: "Rubik, sans-serif", marginBottom: "10px", color: "var(--color-foreground)" }}>
                {t("language_label")}
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                {languages.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setLanguage(key)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: "10px",
                      border: `1.5px solid ${language === key ? "var(--color-secondary)" : "var(--color-border)"}`,
                      background: language === key ? "rgba(99,102,241,0.08)" : "white",
                      color: language === key ? "var(--color-secondary)" : "var(--color-muted-foreground)",
                      fontSize: "14px",
                      fontWeight: 600,
                      fontFamily: "Rubik, sans-serif",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, fontFamily: "Rubik, sans-serif", marginBottom: "8px", color: "var(--color-foreground)" }}>
                {t("description_label")}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("description_placeholder")}
                maxLength={500}
                rows={3}
                style={{ resize: "vertical" }}
              />
              <p style={{ fontSize: "11px", color: "var(--color-muted-foreground)", marginTop: "4px", textAlign: "right" }}>
                {description.length}/500
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "10px", padding: "12px 16px" }}>
                <AlertCircle size={16} color="#DC2626" />
                <span style={{ fontSize: "14px", color: "#DC2626" }}>{error}</span>
              </div>
            )}

            {/* Limit reached */}
            {limitReached && (
              <div style={{ background: "rgba(124,58,237,0.06)", border: "1.5px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "16px 20px" }}>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-primary)", marginBottom: "10px" }}>
                  {t("limit_reached")}
                </p>
                <button onClick={() => router.push(`/${locale}/pricing`)} className="btn-primary" style={{ fontSize: "14px", padding: "10px 20px" }}>
                  {t("upgrade_btn")}
                  <ArrowRight size={15} />
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleAnalyze}
              disabled={loading || files.length === 0}
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "16px", opacity: loading || files.length === 0 ? 0.6 : 1, cursor: loading || files.length === 0 ? "not-allowed" : "pointer" }}
            >
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  {t("analyzing")}
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  {t("analyze_btn")}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
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

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
