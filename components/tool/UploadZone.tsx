"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslations } from "next-intl";
import { Upload, X, Star } from "lucide-react";

interface UploadZoneProps {
  files: File[];
  onChange: (files: File[]) => void;
  recommendedIndex?: number;
}

export default function UploadZone({ files, onChange, recommendedIndex }: UploadZoneProps) {
  const t = useTranslations("tool");

  const onDrop = useCallback((accepted: File[]) => {
    const combined = [...files, ...accepted].slice(0, 10);
    onChange(combined);
  }, [files, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [], "image/avif": [] },
    maxSize: 10 * 1024 * 1024,
    multiple: true,
  });

  function remove(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div>
      {/* Drop area */}
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? "var(--color-primary)" : "var(--color-border)"}`,
          borderRadius: "16px",
          padding: "40px 24px",
          textAlign: "center",
          background: isDragActive ? "rgba(124,58,237,0.04)" : "white",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        <input {...getInputProps()} aria-label={t("upload_title")} />
        <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "rgba(124,58,237,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Upload size={24} color="var(--color-primary)" />
        </div>
        <p style={{ fontFamily: "Rubik, sans-serif", fontWeight: 600, fontSize: "15px", marginBottom: "6px" }}>
          {t("upload_title")}
        </p>
        <p style={{ fontSize: "13px", color: "var(--color-muted-foreground)", marginBottom: "8px" }}>
          {t("upload_desc")}
        </p>
        <span style={{ fontSize: "12px", color: "var(--color-muted-foreground)", background: "var(--color-muted)", padding: "3px 10px", borderRadius: "6px" }}>
          {t("upload_formats")}
        </span>
      </div>

      {/* Previews */}
      {files.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "10px", marginTop: "16px" }}>
          {files.map((file, i) => {
            const url = URL.createObjectURL(file);
            const isRecommended = recommendedIndex === i;
            return (
              <div key={`${file.name}-${i}`} style={{ position: "relative", borderRadius: "12px", overflow: "hidden", aspectRatio: "1", border: isRecommended ? "2.5px solid var(--color-primary)" : "1.5px solid var(--color-border)" }}>
                <img src={url} alt={file.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onLoad={() => URL.revokeObjectURL(url)} />
                {isRecommended && (
                  <div style={{ position: "absolute", bottom: "4px", left: "4px", background: "var(--color-primary)", borderRadius: "6px", padding: "2px 6px", display: "flex", alignItems: "center", gap: "3px" }}>
                    <Star size={9} color="white" fill="white" />
                    <span style={{ fontSize: "9px", color: "white", fontWeight: 700, fontFamily: "Rubik, sans-serif" }}>Cover</span>
                  </div>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); remove(i); }}
                  aria-label="Elimină poza"
                  style={{ position: "absolute", top: "4px", right: "4px", width: "22px", height: "22px", borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <X size={12} color="white" />
                </button>
                <div style={{ position: "absolute", bottom: isRecommended ? "24px" : "4px", right: "4px", background: "rgba(0,0,0,0.55)", borderRadius: "5px", padding: "1px 5px" }}>
                  <span style={{ fontSize: "10px", color: "white", fontWeight: 600 }}>{i + 1}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
