"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Copy, Check, Tag, Save, CheckCircle } from "lucide-react";
import PhotoCard from "./PhotoCard";
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
        border: "1.5px solid var(--color-border)",
        background: copied ? "rgba(22,163,74,0.08)" : "white",
        color: copied ? "var(--color-success)" : "var(--color-muted-foreground)",
        fontSize: "13px",
        fontWeight: 600,
        fontFamily: "Rubik, sans-serif",
        cursor: "pointer",
        transition: "all 0.2s",
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
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await onSave();
    setSaving(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Photo quality */}
      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "16px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "28px", height: "28px", borderRadius: "8px", background: "rgba(124,58,237,0.1)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>📷</span>
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
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "rgba(124,58,237,0.05)", borderRadius: "12px", border: "1px solid rgba(124,58,237,0.1)" }}>
          <Tag size={15} color="var(--color-primary)" />
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-foreground)" }}>{result.category}</span>
        </div>
      )}

      {/* Title */}
      <div className="card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "16px" }}>{t("generated_title")}</h3>
          <CopyButton text={result.title} label={`${t("copy")} titlu`} />
        </div>
        <p style={{ fontSize: "17px", fontFamily: "Rubik, sans-serif", fontWeight: 500, color: "var(--color-foreground)", lineHeight: 1.4 }}>
          {result.title}
        </p>
        <p style={{ fontSize: "12px", color: "var(--color-muted-foreground)", marginTop: "8px" }}>
          {result.title.length} {locale === "ro" ? "caractere" : "characters"}
        </p>
      </div>

      {/* Description */}
      <div className="card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "16px" }}>{t("generated_desc")}</h3>
          <CopyButton text={result.description} label={`${t("copy")} descriere`} />
        </div>
        <p style={{ fontSize: "15px", color: "var(--color-foreground)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
          {result.description}
        </p>
      </div>

      {/* Tags */}
      <div className="card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "16px" }}>{t("tags_label")}</h3>
          <CopyButton text={result.tags.join(", ")} label={t("copy_all_tags")} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {result.tags.map((tag) => (
            <span key={tag} className="badge badge-primary" style={{ fontSize: "13px", padding: "5px 12px" }}>
              <Tag size={11} style={{ marginRight: "4px" }} />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving || saved}
        className={saved ? "" : "btn-primary"}
        style={{
          width: "100%",
          justifyContent: "center",
          padding: "14px",
          fontSize: "15px",
          background: saved ? "rgba(22,163,74,0.1)" : undefined,
          color: saved ? "var(--color-success)" : undefined,
          border: saved ? "1.5px solid rgba(22,163,74,0.3)" : undefined,
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          opacity: saving ? 0.7 : 1,
          cursor: saving || saved ? "default" : "pointer",
        }}
      >
        {saved ? <CheckCircle size={18} /> : <Save size={18} />}
        {saved ? t("saved") : saving ? "..." : t("save_listing")}
      </button>
    </div>
  );
}
