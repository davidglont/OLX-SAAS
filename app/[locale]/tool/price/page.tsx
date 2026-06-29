"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DollarSign, Loader2, TrendingUp, ChevronRight, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { PriceEstimate } from "@/lib/ai";

const categories = [
  { ro: "Electronice", en: "Electronics" },
  { ro: "Telefoane", en: "Phones" },
  { ro: "Laptopuri", en: "Laptops" },
  { ro: "Imbracaminte", en: "Clothing" },
  { ro: "Mobila", en: "Furniture" },
  { ro: "Jucarii", en: "Toys" },
  { ro: "Sport & Fitness", en: "Sport & Fitness" },
  { ro: "Auto & Moto", en: "Auto & Moto" },
  { ro: "Casa & Gradina", en: "Home & Garden" },
  { ro: "Altele", en: "Other" },
];

const conditions = [
  { ro: "Nou / sigilat", en: "New / sealed" },
  { ro: "Ca nou (folosit rar)", en: "Like new (rarely used)" },
  { ro: "Stare buna", en: "Good condition" },
  { ro: "Stare acceptabila", en: "Acceptable condition" },
  { ro: "Defect / pentru piese", en: "Defective / for parts" },
];

export default function PriceToolPage() {
  const locale = useLocale();
  const isRo = locale === "ro";
  const { data: session, status } = useSession();
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [productType, setProductType] = useState<"" | "original" | "replica">("");
  const [currency, setCurrency] = useState<"RON" | "EUR">("RON");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PriceEstimate | null>(null);
  const [error, setError] = useState("");

  const EUR_RATE = 5.0;
  function displayPrice(ron: number) {
    if (currency === "EUR") return `€${Math.round(ron / EUR_RATE)}`;
    return `RON ${ron}`;
  }

  if (status === "loading") return null;
  if (!session) {
    router.push(`/${locale}/auth/login`);
    return null;
  }

  const userPlan = (session.user as { plan?: string })?.plan ?? "free";
  const isLocked = userPlan === "free";

  if (isLocked) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
        <Header />
        <main style={{ flex: 1, maxWidth: "720px", margin: "0 auto", padding: "100px 28px 80px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="card tool-locked-card" style={{ padding: "48px 36px", textAlign: "center", maxWidth: "480px", width: "100%" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(212,153,26,0.1)", border: "1px solid rgba(212,153,26,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Lock size={24} color="var(--primary-light)" />
            </div>
            <h2 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 800, fontSize: "22px", color: "var(--color-foreground)", marginBottom: "10px" }}>
              {isRo ? "Tool disponibil din plan Pro" : "Tool available from Pro plan"}
            </h2>
            <p style={{ fontSize: "14px", color: "var(--color-muted-foreground)", lineHeight: 1.7, marginBottom: "28px" }}>
              {isRo
                ? "Estimatorul de preț cu calibrare pentru originale, replici și second-hand este disponibil pentru utilizatorii Pro și superior."
                : "The price estimator with calibration for originals, replicas and second-hand is available for Pro and above users."}
            </p>
            <Link href={`/${locale}/pricing`} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 28px", fontSize: "15px", justifyContent: "center" }}>
              {isRo ? "Vezi planurile" : "See plans"} <ArrowRight size={16} />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const fullDesc = [description, category, condition].filter(Boolean).join(" | ");
      const res = await fetch("/api/tools/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: fullDesc, language: locale, productType: productType || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Eroare"); return; }
      setResult(data as PriceEstimate);
    } catch { setError(isRo ? "Eroare de retea. Incearca din nou." : "Network error. Try again."); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <Header />
      <main className="tool-main" style={{ flex: 1, maxWidth: "720px", margin: "0 auto", padding: "100px 28px 80px", width: "100%" }}>

        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "4px 14px", borderRadius: "20px", background: "rgba(212,153,26,0.1)", border: "1px solid rgba(212,153,26,0.2)", marginBottom: "16px" }}>
            <DollarSign size={13} color="var(--primary-light)" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--primary-light)", fontFamily: "Rubik,sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {isRo ? "Estimator pret" : "Price estimator"}
            </span>
          </div>
          <h1 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 800, fontSize: "clamp(26px,3.5vw,38px)", color: "var(--color-foreground)", lineHeight: 1.15, marginBottom: "10px" }}>
            {isRo ? "Cat valoreaza produsul tau?" : "How much is your product worth?"}
          </h1>
          <p style={{ fontSize: "15px", color: "var(--color-muted-foreground)", lineHeight: 1.65 }}>
            {isRo
              ? "Descrie produsul si AI-ul iti estimeaza pretul corect de vanzare pe piata romaneasca, cu sfaturi de negociere."
              : "Describe your product and AI estimates the fair selling price on the Romanian market, with negotiation tips."}
          </p>
        </div>

        {/* Currency toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <span style={{ fontSize: "13px", color: "var(--color-muted-foreground)", fontFamily: "Rubik, sans-serif" }}>
            {isRo ? "Afișează în:" : "Show in:"}
          </span>
          {(["RON", "EUR"] as const).map((c) => (
            <button key={c} type="button" onClick={() => setCurrency(c)}
              style={{ padding: "5px 14px", borderRadius: "8px", border: `1px solid ${currency === c ? "rgba(212,153,26,0.5)" : "rgba(255,255,255,0.1)"}`, background: currency === c ? "rgba(212,153,26,0.12)" : "transparent", color: currency === c ? "var(--primary-light)" : "var(--color-muted-foreground)", fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
              {c}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--color-foreground)", fontFamily: "Rubik, sans-serif", marginBottom: "8px" }}>
              {isRo ? "Descrie produsul *" : "Describe the product *"}
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              minLength={5}
              maxLength={500}
              rows={4}
              placeholder={isRo
                ? "Ex: iPhone 13 Pro 128GB, culoare grafit, baterie 89%, cutie originala, cablu si incarcator incluse, fara zgarieturi..."
                : "Ex: iPhone 13 Pro 128GB, graphite color, 89% battery, original box, cable and charger included, no scratches..."}
              style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(212,153,26,0.2)", background: "rgba(13,13,34,0.6)", color: "var(--color-foreground)", fontSize: "14px", fontFamily: "Nunito Sans, sans-serif", lineHeight: 1.6, resize: "vertical", outline: "none", boxSizing: "border-box" }}
            />
            <div style={{ fontSize: "11px", color: "var(--color-muted-foreground)", marginTop: "4px", textAlign: "right" }}>{description.length}/500</div>
          </div>

          <div className="price-selects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--color-foreground)", fontFamily: "Rubik, sans-serif", marginBottom: "8px" }}>
                {isRo ? "Categorie" : "Category"}
              </label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid rgba(212,153,26,0.2)", background: "rgba(13,13,34,0.8)", color: "var(--color-foreground)", fontSize: "14px", outline: "none" }}>
                <option value="">{isRo ? "Selecteaza..." : "Select..."}</option>
                {categories.map(c => <option key={c.ro} value={isRo ? c.ro : c.en}>{isRo ? c.ro : c.en}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--color-foreground)", fontFamily: "Rubik, sans-serif", marginBottom: "8px" }}>
                {isRo ? "Stare" : "Condition"}
              </label>
              <select value={condition} onChange={e => setCondition(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid rgba(212,153,26,0.2)", background: "rgba(13,13,34,0.8)", color: "var(--color-foreground)", fontSize: "14px", outline: "none" }}>
                <option value="">{isRo ? "Selecteaza..." : "Select..."}</option>
                {conditions.map(c => <option key={c.ro} value={isRo ? c.ro : c.en}>{isRo ? c.ro : c.en}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--color-foreground)", fontFamily: "Rubik, sans-serif", marginBottom: "8px" }}>
                {isRo ? "Tip produs" : "Product type"}
              </label>
              <select value={productType} onChange={e => setProductType(e.target.value as "" | "original" | "replica")} style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid rgba(212,153,26,0.2)", background: "rgba(13,13,34,0.8)", color: "var(--color-foreground)", fontSize: "14px", outline: "none" }}>
                <option value="">{isRo ? "Necunoscut" : "Unknown"}</option>
                <option value="original">{isRo ? "Original / Autentic" : "Original / Authentic"}</option>
                <option value="replica">{isRo ? "Replica / Rep" : "Replica / Rep"}</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || description.length < 5}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "15px", opacity: loading || description.length < 5 ? 0.6 : 1 }}
          >
            {loading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <TrendingUp size={18} />}
            {loading
              ? (isRo ? "AI analizeaza..." : "AI analyzing...")
              : (isRo ? "Estimeaza pretul" : "Estimate price")}
          </button>
        </form>

        {error && (
          <div style={{ padding: "14px 18px", borderRadius: "12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444", fontSize: "14px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "12px" }}>
              {[
                { label: isRo ? "Pret minim" : "Min price", value: displayPrice(result.min), color: "#EF4444" },
                { label: isRo ? "Pret recomandat" : "Suggested price", value: displayPrice(result.suggestedPrice), color: "var(--primary-light)" },
                { label: isRo ? "Pret maxim" : "Max price", value: displayPrice(result.max), color: "#10B981" },
              ].map(item => (
                <div key={item.label} className="card" style={{ padding: "18px", textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "var(--color-muted-foreground)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.label}</div>
                  <div style={{ fontFamily: "Rubik, sans-serif", fontWeight: 800, fontSize: "20px", color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: "20px" }}>
              <h3 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "14px", color: "var(--color-foreground)", marginBottom: "10px" }}>
                {isRo ? "De ce acest pret?" : "Why this price?"}
              </h3>
              <p style={{ fontSize: "14px", color: "var(--color-muted-foreground)", lineHeight: 1.7 }}>{result.justification}</p>
            </div>

            <div className="card" style={{ padding: "20px" }}>
              <h3 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "14px", color: "var(--color-foreground)", marginBottom: "14px" }}>
                {isRo ? "Sfaturi de negociere" : "Negotiation tips"}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {result.negotiationTips.map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <ChevronRight size={15} color="var(--primary-light)" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <p style={{ fontSize: "13px", color: "var(--color-muted-foreground)", lineHeight: 1.6 }}>{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}