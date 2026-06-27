"use client";

import { useState } from "react";
import { X, Flame } from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const locale = useLocale();
  if (dismissed) return null;

  return (
    <div style={{
      background: "linear-gradient(90deg,rgba(120,53,15,0.97) 0%,rgba(180,83,9,0.97) 50%,rgba(120,53,15,0.97) 100%)",
      borderBottom: "1px solid rgba(212,153,26,0.35)",
      padding: "9px 20px",
      position: "relative",
      zIndex: 100,
    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Flame size={13} color="#F5B731" fill="#F5B731" />
          <span style={{ fontSize: "12px", fontWeight: 800, color: "#F5B731", fontFamily: "Rubik,sans-serif", letterSpacing: "0.07em", textTransform: "uppercase" }}>
            Preț de lansare
          </span>
        </div>
        <div style={{ width: "1px", height: "14px", background: "rgba(245,236,215,0.2)", flexShrink: 0 }} />
        <span style={{ fontSize: "13px", color: "#F5ECD7" }}>
          <strong style={{ color: "#F5B731" }}>1.247 vânzători</strong> activi — Pro la{" "}
          <strong style={{ color: "#F5B731" }}>€10/lună</strong>, prețul va crește
        </span>
        <Link
          href={`/${locale}/auth/signup`}
          style={{
            background: "rgba(212,153,26,0.15)",
            border: "1px solid rgba(212,153,26,0.45)",
            color: "#F5B731",
            padding: "4px 14px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 700,
            fontFamily: "Rubik,sans-serif",
            textDecoration: "none",
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Încearcă gratuit →
        </Link>
      </div>
      <button
        onClick={() => setDismissed(true)}
        style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(245,236,215,0.45)", display: "flex", alignItems: "center", padding: "6px" }}
        aria-label="Închide"
      >
        <X size={14} />
      </button>
    </div>
  );
}
