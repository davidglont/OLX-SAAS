"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Trash2, Plus, Tag, Calendar, ShoppingBag, Crown, Check, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface Listing {
  id: string;
  platform: string;
  title: string;
  description: string;
  tags: string;
  photoCount: number;
  createdAt: string;
}

interface Usage { used: number; limit: number; }

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push(`/${locale}/auth/login`);
  }, [status, locale, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/listings").then((r) => r.json()),
      fetch("/api/usage").then((r) => r.json()),
    ]).then(([l, u]) => {
      setListings(Array.isArray(l) ? l : []);
      setUsage(u);
      setLoading(false);
    });
  }, [status]);

  async function handleDelete(id: string) {
    setDeleting(id);
    await fetch(`/api/listings/${id}`, { method: "DELETE" });
    setListings((prev) => prev.filter((l) => l.id !== id));
    setDeleting(null);
  }

  const plan = (session?.user as { plan?: string } | null)?.plan ?? "free";

  const PLAN_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; features: string[]; nextPlan: string | null }> = {
    free:     { label: "Free",     color: "#9CA3AF", bg: "rgba(156,163,175,0.07)", border: "rgba(156,163,175,0.15)", features: ["1 analiză / zi", "Tool principal AI", "Salvare anunțuri"], nextPlan: "pro" },
    pro:      { label: "Pro",      color: "#60A5FA", bg: "rgba(96,165,250,0.07)",  border: "rgba(96,165,250,0.15)",  features: ["3 analize / zi", "Estimator Preț", "Generator Titluri A/B", "Checker Listing"], nextPlan: "proplus" },
    proplus:  { label: "Pro+",     color: "var(--primary-light)", bg: "rgba(212,153,26,0.07)", border: "rgba(212,153,26,0.2)", features: ["5 analize / zi", "Toate toolurile", "Analiză de piață AI", "Zile optime de postare"], nextPlan: "business" },
    business: { label: "Business", color: "#A78BFA", bg: "rgba(167,139,250,0.07)", border: "rgba(167,139,250,0.15)", features: ["15 analize / zi", "Toate toolurile", "Analiză avansată de piață", "Suport prioritar"], nextPlan: null },
  };

  const planCfg = PLAN_CONFIG[plan] ?? PLAN_CONFIG.free;

  if (status === "loading" || loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid var(--color-border)", borderTopColor: "var(--color-primary)", animation: "spin 0.8s linear infinite" }} />
        </main>
        <Footer />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <Header />
      <main className="tool-main dashboard-main" style={{ flex: 1, maxWidth: "1000px", margin: "0 auto", width: "100%", padding: "40px 24px" }}>
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontFamily: "Rubik, sans-serif", fontSize: "28px", fontWeight: 700, marginBottom: "6px", display: "flex", alignItems: "center", gap: "10px" }}>
              <LayoutDashboard size={24} color="var(--color-primary)" />
              {t("title")}
            </h1>
            <p style={{ color: "var(--color-muted-foreground)", fontSize: "15px" }}>{t("subtitle")}</p>
          </div>
          <Link href={`/${locale}/tool`} className="btn-primary" style={{ fontSize: "14px", padding: "10px 20px" }}>
            <Plus size={16} />
            {t("empty_cta")}
          </Link>
        </div>

        {/* Plan card */}
        <div className="card" style={{ padding: "20px 24px", marginBottom: "16px", background: planCfg.bg, border: `1px solid ${planCfg.border}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: planCfg.bg, border: `1px solid ${planCfg.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Crown size={16} color={planCfg.color} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "15px", color: "var(--color-foreground)" }}>Plan curent</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 10px", borderRadius: "20px", background: planCfg.border, color: planCfg.color, fontFamily: "Rubik, sans-serif" }}>{planCfg.label}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  {planCfg.features.map((f) => (
                    <span key={f} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--color-muted-foreground)" }}>
                      <Check size={11} color={planCfg.color} />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {planCfg.nextPlan && (
              <Link href={`/${locale}/pricing`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, fontFamily: "Rubik, sans-serif", color: planCfg.color, background: planCfg.bg, border: `1px solid ${planCfg.border}`, padding: "8px 16px", borderRadius: "10px", textDecoration: "none", whiteSpace: "nowrap" }}>
                Upgrade <ArrowRight size={13} />
              </Link>
            )}
          </div>
        </div>

        {/* Usage bar */}
        {usage && (
          <div className="card" style={{ padding: "20px 24px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, fontFamily: "Rubik, sans-serif" }}>{t("today_usage")}</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-primary)" }}>{usage.used} {t("of")} {usage.limit}</span>
              </div>
              <div style={{ height: "6px", borderRadius: "3px", background: "var(--color-muted)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: "100%", background: usage.used >= usage.limit ? "#DC2626" : "var(--color-primary)", transform: `scaleX(${usage.limit > 0 ? usage.used / usage.limit : 0})`, transformOrigin: "left", transition: "transform 0.4s ease" }} />
              </div>
            </div>
            {usage.used >= usage.limit && (
              <Link href={`/${locale}/pricing`} className="btn-primary" style={{ fontSize: "13px", padding: "8px 16px", flexShrink: 0 }}>
                Upgrade
              </Link>
            )}
          </div>
        )}

        {/* Listings */}
        {listings.length === 0 ? (
          <div className="card" style={{ padding: "64px 24px", textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: "rgba(124,58,237,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <ShoppingBag size={28} color="var(--color-primary)" />
            </div>
            <h3 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "18px", marginBottom: "8px" }}>{t("empty_title")}</h3>
            <p style={{ color: "var(--color-muted-foreground)", marginBottom: "24px" }}>{t("empty_desc")}</p>
            <Link href={`/${locale}/tool`} className="btn-primary" style={{ display: "inline-flex", fontSize: "14px", padding: "11px 24px" }}>
              <Plus size={16} />
              {t("empty_cta")}
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {listings.map((listing) => {
              const tags = JSON.parse(listing.tags || "[]") as string[];
              return (
                <div key={listing.id} className="card" style={{ padding: "20px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                        <span className="badge badge-primary" style={{ fontSize: "11px", textTransform: "capitalize" }}>
                          {listing.platform}
                        </span>
                        <span style={{ fontSize: "12px", color: "var(--color-muted-foreground)", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Calendar size={11} />
                          {new Date(listing.createdAt).toLocaleDateString(locale === "ro" ? "ro-RO" : "en-GB")}
                        </span>
                        <span style={{ fontSize: "12px", color: "var(--color-muted-foreground)" }}>
                          {listing.photoCount} {t("photos")}
                        </span>
                      </div>
                      <h3 className="listing-title" style={{ fontFamily: "Rubik, sans-serif", fontWeight: 600, fontSize: "15px", marginBottom: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {listing.title}
                      </h3>
                      <p style={{ fontSize: "13px", color: "var(--color-muted-foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "10px" }}>
                        {listing.description}
                      </p>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {tags.slice(0, 4).map((tag) => (
                          <span key={tag} style={{ fontSize: "11px", color: "var(--color-primary)", background: "rgba(124,58,237,0.07)", padding: "2px 8px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "3px" }}>
                            <Tag size={9} />
                            {tag}
                          </span>
                        ))}
                        {tags.length > 4 && (
                          <span style={{ fontSize: "11px", color: "var(--color-muted-foreground)" }}>+{tags.length - 4}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      disabled={deleting === listing.id}
                      aria-label={t("delete")}
                      style={{ padding: "8px", borderRadius: "8px", border: "1px solid var(--color-border)", background: "white", cursor: "pointer", color: deleting === listing.id ? "var(--color-muted-foreground)" : "#DC2626", transition: "all 0.15s", flexShrink: 0 }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
