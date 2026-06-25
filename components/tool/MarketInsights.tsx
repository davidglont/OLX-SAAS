"use client";

import { TrendingUp, Calendar, Lightbulb, Lock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import type { MarketInsight } from "@/lib/ai";

interface MarketInsightsProps {
  market?: MarketInsight;
  // When market is undefined AND user doesn't have access, show the upgrade CTA.
  // When market is undefined AND user has access, return null (AI edge case).
  hasAccess: boolean;
}

const demandConfig: Record<string, { label: string; color: string; bg: string; labelEn: string }> = {
  scazut:  { label: "Cerere scazuta",  labelEn: "Low demand",    color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
  mediu:   { label: "Cerere medie",    labelEn: "Medium demand", color: "#F0B429", bg: "rgba(240,180,41,0.1)" },
  ridicat: { label: "Cerere ridicata", labelEn: "High demand",   color: "#10B981", bg: "rgba(16,185,129,0.1)" },
};

export default function MarketInsights({ market, hasAccess }: MarketInsightsProps) {
  const locale = useLocale();
  const isRo = locale === "ro";

  // API returned market data — show it regardless of client-side plan state
  if (market) {
    const demand = demandConfig[market.demand] ?? demandConfig.mediu;
    return (
      <div className="card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "rgba(212,153,26,0.1)", border: "1px solid rgba(212,153,26,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp size={14} color="var(--primary-light)" />
          </div>
          <h3 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "15px", color: "var(--color-foreground)" }}>
            {isRo ? "Analiza de piata" : "Market Analysis"}
          </h3>
          <span style={{ marginLeft: "auto", fontSize: "10px", padding: "2px 8px", borderRadius: "20px", background: "rgba(212,153,26,0.1)", border: "1px solid rgba(212,153,26,0.2)", color: "var(--primary-light)", fontFamily: "Rubik, sans-serif", fontWeight: 700 }}>
            AI
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div style={{ padding: "14px", borderRadius: "10px", background: "rgba(212,153,26,0.05)", border: "1px solid rgba(212,153,26,0.12)" }}>
            <div style={{ fontSize: "11px", color: "var(--color-muted-foreground)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {isRo ? "Pret estimat" : "Estimated price"}
            </div>
            <div style={{ fontFamily: "Rubik, sans-serif", fontWeight: 800, fontSize: "20px", background: "linear-gradient(135deg, #F0B429, #D4991A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {market.currency} {market.priceRange.min} {String.fromCharCode(8211)} {market.priceRange.max}
            </div>
          </div>

          <div style={{ padding: "14px", borderRadius: "10px", background: demand.bg, border: `1px solid ${demand.color}25` }}>
            <div style={{ fontSize: "11px", color: "var(--color-muted-foreground)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {isRo ? "Cerere" : "Demand"}
            </div>
            <div style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "14px", color: demand.color }}>
              {isRo ? demand.label : demand.labelEn}
            </div>
          </div>
        </div>

        {market.bestDays?.length > 0 && (
          <div style={{ marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <Calendar size={13} color="var(--color-muted-foreground)" />
              <span style={{ fontSize: "12px", color: "var(--color-muted-foreground)", fontWeight: 600 }}>
                {isRo ? "Zile optime de postare" : "Best posting days"}
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {market.bestDays.map((day) => (
                <span key={day} style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "20px", background: "rgba(212,153,26,0.08)", border: "1px solid rgba(212,153,26,0.18)", color: "var(--primary-light)", fontFamily: "Rubik, sans-serif", fontWeight: 600 }}>
                  {day}
                </span>
              ))}
            </div>
            {market.seasonality && (
              <p style={{ fontSize: "11px", color: "var(--color-muted-foreground)", marginTop: "6px", fontStyle: "italic" }}>
                {market.seasonality}
              </p>
            )}
          </div>
        )}

        {market.tips?.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
              <Lightbulb size={13} color="var(--primary-light)" />
              <span style={{ fontSize: "12px", color: "var(--color-muted-foreground)", fontWeight: 600 }}>
                {isRo ? "Sfaturi pentru acest produs" : "Tips for this product"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {market.tips.slice(0, 3).map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0, width: "20px", height: "20px", borderRadius: "6px", background: "rgba(212,153,26,0.1)", border: "1px solid rgba(212,153,26,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 800, color: "var(--primary-light)", fontFamily: "Rubik, sans-serif", marginTop: "1px" }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--color-muted-foreground)", lineHeight: 1.6, flex: 1 }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // No market data returned. If user has access, don't show anything (AI edge case).
  if (hasAccess) return null;

  // User doesn't have access — show upgrade CTA with blurred preview
  return (
    <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "12px",
        background: "rgba(6,6,16,0.78)", backdropFilter: "blur(6px)",
        borderRadius: "16px",
      }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(212,153,26,0.12)", border: "1px solid rgba(212,153,26,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lock size={20} color="var(--primary-light)" />
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "14px", color: "var(--color-foreground)", marginBottom: "4px" }}>
            {isRo ? "Analiza de piata" : "Market Analysis"}
          </p>
          <p style={{ fontSize: "12px", color: "var(--color-muted-foreground)" }}>
            {isRo ? "Disponibil pe Pro+ si Business" : "Available on Pro+ and Business"}
          </p>
        </div>
        <Link
          href={`/${locale}#pricing`}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 18px", borderRadius: "10px", background: "linear-gradient(135deg, #D4991A 0%, #A67800 100%)", color: "white", fontSize: "13px", fontWeight: 700, fontFamily: "Rubik, sans-serif", textDecoration: "none", boxShadow: "0 4px 16px rgba(212,153,26,0.35)" }}
        >
          {isRo ? "Upgrade acum" : "Upgrade now"}
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Blurred preview */}
      <div className="card" style={{ padding: "24px", filter: "blur(4px)", pointerEvents: "none", userSelect: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "rgba(212,153,26,0.1)", border: "1px solid rgba(212,153,26,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp size={14} color="var(--primary-light)" />
          </div>
          <h3 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "15px", color: "var(--color-foreground)" }}>
            {isRo ? "Analiza de piata" : "Market Analysis"}
          </h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div style={{ padding: "14px", borderRadius: "10px", background: "rgba(212,153,26,0.05)", border: "1px solid rgba(212,153,26,0.1)" }}>
            <div style={{ fontSize: "11px", color: "var(--color-muted-foreground)", marginBottom: "4px" }}>{isRo ? "Pret estimat" : "Estimated price"}</div>
            <div style={{ fontFamily: "Rubik, sans-serif", fontWeight: 800, fontSize: "18px", color: "var(--primary-light)" }}>RON 450-620</div>
          </div>
          <div style={{ padding: "14px", borderRadius: "10px", background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.12)" }}>
            <div style={{ fontSize: "11px", color: "var(--color-muted-foreground)", marginBottom: "4px" }}>{isRo ? "Cerere" : "Demand"}</div>
            <div style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "13px", color: "#10B981" }}>{isRo ? "Cerere ridicata" : "High demand"}</div>
          </div>
        </div>
        <div style={{ height: "32px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", marginBottom: "10px" }} />
        <div style={{ height: "48px", borderRadius: "8px", background: "rgba(255,255,255,0.03)" }} />
      </div>
    </div>
  );
}