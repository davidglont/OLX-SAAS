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
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? "var(--primary-light)" : "rgba(212,153,26,0.28)"}`,
          borderRadius: "18px",
          padding: "44px 24px",
          textAlign: "center",
          background: isDragActive
            ? "rgba(212,153,26,0.06)"
            : "rgba(10,10,24,0.55)",
          cursor: "pointer",
          transition: "background 0.25s, border-color 0.25s",
          backdropFilter: "blur(10px)",
          boxShadow: isDragActive ? "0 0 0 4px rgba(212,153,26,0.1) inset" : "none",
        }}
      >
        <input {...getInputProps()} aria-label={t("upload_title")} />
        <div style={{
          width: "60px", height: "60px", borderRadius: "18px",
          background: isDragActive ? "rgba(212,153,26,0.2)" : "rgba(212,153,26,0.1)",
          border: `1px solid ${isDragActive ? "rgba(212,153,26,0.5)" : "rgba(212,153,26,0.22)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 18px",
          transition: "background 0.25s, border-color 0.25s",
          boxShadow: isDragActive ? "0 8px 24px rgba(212,153,26,0.2)" : "none",
        }}>
          <Upload size={26} color={isDragActive ? "var(--primary-light)" : "var(--primary)"} />
        </div>
        <p style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "15px", marginBottom: "6px", color: "var(--color-foreground)" }}>
          {t("upload_title")}
        </p>
        <p style={{ fontSize: "13px", color: "var(--color-muted-foreground)", marginBottom: "14px", lineHeight: 1.6 }}>
          {t("upload_desc")}
        </p>
        <span style={{
          fontSize: "11px", color: "var(--primary-light)",
          background: "rgba(212,153,26,0.08)",
          border: "1px solid rgba(212,153,26,0.2)",
          padding: "4px 14px", borderRadius: "20px",
          fontFamily: "Rubik, sans-serif", fontWeight: 700, letterSpacing: "0.04em",
        }}>
          {t("upload_formats")}
        </span>
      </div>

      {files.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "10px", marginTop: "16px" }}>
          {files.map((file, i) => {
            const url = URL.createObjectURL(file);
            const isRecommended = recommendedIndex === i;
            return (
              <div
                key={`${file.name}-${i}`}
                style={{
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  aspectRatio: "1",
                  border: isRecommended
                    ? "2.5px solid var(--primary-light)"
                    : "1px solid rgba(212,153,26,0.18)",
                  boxShadow: isRecommended ? "0 0 18px rgba(212,153,26,0.3)" : "none",
                  transition: "box-shadow 0.2s",
                }}
              >
                <img
                  src={url}
                  alt={file.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onLoad={() => URL.revokeObjectURL(url)}
                />
                {isRecommended && (
                  <div style={{ position: "absolute", bottom: "4px", left: "4px", background: "var(--primary)", borderRadius: "6px", padding: "2px 7px", display: "flex", alignItems: "center", gap: "3px" }}>
                    <Star size={9} color="white" fill="white" />
                    <span style={{ fontSize: "9px", color: "white", fontWeight: 700, fontFamily: "Rubik, sans-serif" }}>Cover</span>
                  </div>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); remove(i); }}
                  aria-label="Elimina poza"
                  style={{ position: "absolute", top: "4px", right: "4px", width: "22px", height: "22px", borderRadius: "50%", background: "rgba(0,0,0,0.72)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}
                >
                  <X size={12} color="white" />
                </button>
                <div style={{ position: "absolute", bottom: isRecommended ? "24px" : "4px", right: "4px", background: "rgba(0,0,0,0.6)", borderRadius: "5px", padding: "1px 5px" }}>
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