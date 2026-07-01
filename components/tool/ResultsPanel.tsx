"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { Copy, Check, Tag, Save, CheckCircle, Camera, Zap, Lock } from "lucide-react";
import PhotoCard from "./PhotoCard";
import MarketInsights from "./MarketInsights";
import type { AnalysisResult } from "@/lib/ai";

interface ResultsPanelProps {
  result: AnalysisResult;
  files: File[];
  onSave: () => Promise<void>;
  saved: boolean;
}

function CopyButton({ text, label, fullWidth }: { text: string; label: string; fullWidth?: boolean }) {
  const t = useTranslations("tool");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "7px 14px",
        borderRadius: "8px",
        border: `1.5px solid ${copied ? "rgba(16,185,129,0.4)" : "rgba(212,153,26,0.25)"}`,
        background: copied ? "rgba(16,185,129,0.1)" : "rgba(13,13,34,0.8)",
        color: copied ? "var(--success)" : "var(--color-muted-foreground)",
        fontSize: "13px",
        fontWeight: 600,
        fontFamily: "Rubik, sans-serif",
        cursor: "pointer",
        transition: "background 0.2s, border-color 0.2s, color 0.2s",
        width: fullWidth ? "100%" : undefined,
        justifyContent: fullWidth ? "center" : undefined,
      }}
      aria-label={label}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? t("copied") : t("copy")}
    </button>
  );
}

export default function ResultsPanel({ result, files, onSave, saved }: ResultsPanelProps) {
  const t = useTranslations("tool");
  const locale = useLocale();
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);

  const plan = (session?.user as { plan?: string } | undefined)?.plan ?? "free";
  const role = (session?.user as { role?: string } | undefined)?.role ?? "user";
  const hasMarketAccess = ["proplus", "business"].includes(plan) || role === "admin";
  const hasTagsAccess = plan !== "free" || role === "admin";

  async function handleSave() {
    setSaving(true);
    await onSave();
    setSaving(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Results header with Neural Core badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "4px" }}>
        <h2 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "18px", color: "var(--color-foreground)" }}>
          {t("results_title")}
        </h2>
        <a
          href="https://neuralcore.cc"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: "5px", padding: "3px 10px 3px 8px", borderRadius: "20px", border: "1px solid rgba(212,153,26,0.28)", background: "rgba(212,153,26,0.07)", textDecoration: "none", transition: "border-color 0.2s" }}
        >
          <Zap size={11} color="var(--primary-light)" fill="var(--primary-light)" />
          <span style={{ fontSize: "10px", fontFamily: "Rubik, sans-serif", fontWeight: 700, color: "var(--primary-light)", letterSpacing: "0.04em" }}>
            Powered by Neural Core
          </span>
        </a>
      </div>

      {/* Photo quality */}
      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "15px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", color: "var(--color-foreground)" }}>
          <span style={{ width: "28px", height: "28px", borderRadius: "8px", background: "rgba(212,153,26,0.1)", border: "1px solid rgba(212,153,26,0.2)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Camera size={14} color="var(--primary-light)" />
          </span>
          {t("photo_quality")}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
          {result.photos.map((photo) => (
            <PhotoCard key={photo.index} photo={photo} file={files[photo.index]} />
          ))}
        </div>
      </div>

      {/* Category */}
      {result.category && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 16px", background: "rgba(212,153,26,0.07)", borderRadius: "12px", border: "1px solid rgba(212,153,26,0.18)" }}>
          <Tag size={14} color="var(--primary-light)" />
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-foreground)", fontFamily: "Rubik, sans-serif" }}>{result.category}</span>
        </div>
      )}

      {/* Title */}
      <div className="card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "15px", color: "var(--color-foreground)" }}>{t("generated_title")}</h3>
          <CopyButton text={result.title} label={`${t("copy")} titlu`} />
        </div>
        <p style={{ fontSize: "17px", fontFamily: "Rubik, sans-serif", fontWeight: 600, color: "var(--color-foreground)", lineHeight: 1.45 }}>
          {result.title}
        </p>
        <p style={{ fontSize: "11px", color: "var(--color-muted-foreground)", marginTop: "8px" }}>
          {result.title.length} {locale === "ro" ? "caractere" : "characters"}
        </p>
      </div>

      {/* Description */}
      <div className="card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "15px", color: "var(--color-foreground)" }}>{t("generated_desc")}</h3>
          <CopyButton text={result.description} label={`${t("copy")} descriere`} />
        </div>
        <p style={{ fontSize: "14px", color: "var(--color-foreground)", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
          {result.description}
        </p>
      </div>

      {/* Tags */}
      <div className="card" style={{ padding: "24px", position: "relative", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "15px", color: "var(--color-foreground)" }}>{t("tags_label")}</h3>
          {hasTagsAccess && <CopyButton text={result.tags.join(", ")} label={t("copy_all_tags")} />}
        </div>
        {hasTagsAccess ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {result.tags.map((tag) => (
              <span key={tag} className="badge badge-primary" style={{ fontSize: "12px", padding: "4px 12px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", filter: "blur(5px)", userSelect: "none", pointerEvents: "none" }}>
              {["brand", "produs", "second hand", "ca nou", "ieftin", "calitate"].map((tag) => (
                <span key={tag} className="badge badge-primary" style={{ fontSize: "12px", padding: "4px 12px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(13,13,34,0.7)", backdropFilter: "blur(2px)", borderRadius: "inherit" }}>
              <Lock size={20} color="var(--primary-light)" style={{ marginBottom: "8px" }} />
              <p style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "13px", color: "var(--color-foreground)", marginBottom: "4px" }}>
                {locale === "ro" ? "Taguri disponibile din Pro" : "Tags available from Pro"}
              </p>
              <p style={{ fontSize: "12px", color: "var(--color-muted-foreground)" }}>
                {locale === "ro" ? "Upgrade pentru acces" : "Upgrade to unlock"}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Market Insights */}
      <MarketInsights market={result.market} hasAccess={hasMarketAccess} />

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving || saved}
        style={{
          width: "100%",
          justifyContent: "center",
          padding: "14px",
          fontSize: "15px",
          background: saved
            ? "rgba(16,185,129,0.1)"
            : "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
          color: saved ? "var(--success)" : "white",
          border: saved ? "1.5px solid rgba(16,185,129,0.3)" : "none",
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          opacity: saving ? 0.7 : 1,
          cursor: saving || saved ? "default" : "pointer",
          fontFamily: "Rubik, sans-serif",
          fontWeight: 600,
          transition: "opacity 0.2s, transform 0.2s",
          boxShadow: saved ? "none" : "0 8px 32px rgba(212,153,26,0.4)",
        }}
      >
        {saved ? <CheckCircle size={18} /> : <Save size={18} />}
        {saved ? t("saved") : saving ? "..." : t("save_listing")}
      </button>
    </div>
  );
}