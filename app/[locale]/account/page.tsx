"use client";

import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Zap, ArrowRight, CheckCircle, Shield } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PLANS, type PlanKey } from "@/lib/stripe";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const t = useTranslations("account");
  const tPricing = useTranslations("pricing");
  const locale = useLocale();
  const router = useRouter();
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push(`/${locale}/auth/login`);
    if (typeof window !== "undefined" && window.location.search.includes("success=1")) {
      setSuccess(true);
    }
  }, [status, locale, router]);

  async function handleUpgrade(plan: string) {
    setUpgrading(plan);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setUpgrading(null);
  }

  if (status === "loading") {
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

  const currentPlan = (session?.user as { plan?: string })?.plan ?? "free";
  const isAdmin = (session?.user as { role?: string })?.role === "admin";
  const planInfo = PLANS[currentPlan as PlanKey] ?? PLANS.free;

  const PLAN_ORDER: Record<PlanKey, number> = { free: 0, pro: 1, proplus: 2, business: 3 };
  const currentTier = PLAN_ORDER[currentPlan as PlanKey] ?? 0;

  const upgradePlans = (Object.entries(PLANS) as [PlanKey, typeof PLANS[PlanKey]][]).filter(
    ([key]) => key !== "free" && PLAN_ORDER[key] > currentTier
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <Header />
      <main style={{ flex: 1, maxWidth: "700px", margin: "0 auto", width: "100%", padding: "40px 24px" }}>
        <h1 style={{ fontFamily: "Rubik, sans-serif", fontSize: "28px", fontWeight: 700, marginBottom: "32px", display: "flex", alignItems: "center", gap: "10px" }}>
          <User size={24} color="var(--color-primary)" />
          {t("title")}
        </h1>

        {success && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.25)", borderRadius: "12px", padding: "14px 18px", marginBottom: "24px" }}>
            <CheckCircle size={18} color="var(--color-success)" />
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-success)" }}>
              {locale === "ro" ? "Abonamentul tău a fost activat cu succes!" : "Your subscription has been activated successfully!"}
            </span>
          </div>
        )}

        {/* Profile card */}
        <div className="card" style={{ padding: "28px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {session?.user?.image ? (
                <img src={session.user.image} alt="" width={56} height={56} style={{ borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <span style={{ color: "white", fontSize: "20px", fontWeight: 700, fontFamily: "Rubik, sans-serif" }}>
                  {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
                </span>
              )}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "18px" }}>{session?.user?.name}</span>
                {isAdmin && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700, padding: "2px 10px", borderRadius: "20px", background: "rgba(212,153,26,0.12)", border: "1px solid rgba(212,153,26,0.3)", color: "var(--primary-light)", fontFamily: "Rubik, sans-serif" }}>
                    <Shield size={10} />
                    Admin
                  </span>
                )}
              </div>
              <div style={{ fontSize: "14px", color: "var(--color-muted-foreground)", marginTop: "2px" }}>{session?.user?.email}</div>
            </div>
          </div>
        </div>

        {/* Current plan */}
        <div className="card" style={{ padding: "28px", marginBottom: "20px" }}>
          <h2 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "16px", marginBottom: "16px" }}>
            {t("current_plan")}
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={20} color="white" fill="white" />
              </div>
              <div>
                <div style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "18px" }}>{planInfo.name}</div>
                <div style={{ fontSize: "13px", color: "var(--color-muted-foreground)" }}>
                  {planInfo.limit} {t("listings_per_day")}
                  {planInfo.price > 0 && ` · €${planInfo.price}${t("per_month")}`}
                </div>
              </div>
            </div>
            {currentPlan === "free" && (
              <Link href={`/${locale}/pricing`} className="btn-primary" style={{ fontSize: "14px", padding: "10px 20px" }}>
                {t("upgrade")}
                <ArrowRight size={15} />
              </Link>
            )}
          </div>
        </div>

        {/* Upgrade options */}
        {upgradePlans.length > 0 && (
          <div className="card" style={{ padding: "28px" }}>
            <h2 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "16px", marginBottom: "16px" }}>
              {t("upgrade")}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {upgradePlans.map(([key, plan]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: "12px", border: "1.5px solid var(--color-border)", gap: "12px" }}>
                  <div>
                    <span style={{ fontFamily: "Rubik, sans-serif", fontWeight: 600, fontSize: "15px" }}>{plan.name}</span>
                    <span style={{ fontSize: "13px", color: "var(--color-muted-foreground)", marginLeft: "10px" }}>
                      {plan.limit} {t("listings_per_day")} · €{plan.price}{t("per_month")}
                    </span>
                  </div>
                  <button
                    onClick={() => handleUpgrade(key)}
                    disabled={upgrading === key}
                    className="btn-primary"
                    style={{ fontSize: "13px", padding: "8px 18px", flexShrink: 0, opacity: upgrading === key ? 0.7 : 1 }}
                  >
                    {upgrading === key ? "..." : tPricing("cta_paid")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
