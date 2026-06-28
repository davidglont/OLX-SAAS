import type { Metadata } from "next";
import Link from "next/link";
import { Zap, TrendingUp, Clock, Star, ArrowRight } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isRo = locale === "ro";
  return {
    title: isRo ? "Studii de caz — AnunțAI" : "Case Studies — AnunțAI",
    description: isRo
      ? "Vânzătorii români care folosesc AnunțAI vând mai rapid și la prețuri mai bune. Citește poveștile lor."
      : "Romanian sellers using AnunțAI sell faster and at better prices. Read their stories.",
  };
}

const CASES_RO = [
  {
    name: "Mirela P.",
    location: "Cluj-Napoca",
    platform: "Vinted",
    category: "Haine & Accesorii",
    avatar: "MP",
    color: "#d4991a",
    before: "3–5 zile până la prima ofertă",
    after: "Sub 24 ore",
    metric: "+280%",
    metricLabel: "mai multe vizualizări",
    story:
      "Vindeam haine second-hand de 2 ani pe Vinted, dar anunțurile mele nu aveau tracțiune. Scriam descrieri scurte, fără prea multă grijă. Am încercat AnunțAI cu o geacă de piele și mi-a generat un titlu cu toate cuvintele cheie pe care cumpărătorele le caută. A doua zi aveam 12 mesaje.",
    items: ["Titluri cu brand + model + talie", "Descrieri care evidențiază starea exactă", "Taguri cu termeni de căutare populari pe Vinted RO"],
    rating: 5,
    plan: "Pro",
  },
  {
    name: "Andrei T.",
    location: "București",
    platform: "OLX",
    category: "Electronice",
    avatar: "AT",
    color: "#60a5fa",
    before: "Prețuri sub-evaluate, negocieri lungi",
    after: "Preț corect din prima",
    metric: "+35%",
    metricLabel: "preț obținut",
    story:
      "Vindeam laptopuri și telefoane second-hand, dar nu știam exact cât să cer. Subevaluam de frică să nu stea mult pe platformă. Estimatorul de preț al AnunțAI mi-a arătat intervalul realist pentru fiecare dispozitiv — cu justificare clară. Acum postez cu un preț corect și nu mai negociez de la prețuri mici.",
    items: ["Interval preț RON bazat pe piața reală", "Descrieri tehnice generate din poze", "Titluri cu specificații exacte (RAM, stocare, stare)"],
    rating: 5,
    plan: "Pro+",
  },
  {
    name: "Familia Ionescu",
    location: "Timișoara",
    platform: "OLX + Facebook Marketplace",
    category: "Mobilă & Casă",
    avatar: "FI",
    color: "#a78bfa",
    before: "1–2 anunțuri/săptămână (prea obositor)",
    after: "8–10 anunțuri/săptămână",
    metric: "5×",
    metricLabel: "mai repede per anunț",
    story:
      "Renovam apartamentul și aveam zeci de obiecte de vândut. Scriam câte un anunț și oboseam rapid. Cu AnunțAI fotografiam obiectul, în 10 secunde aveam titlu, descriere și taguri gata. Am postat 35 de anunțuri în 3 zile și am vândut aproape tot în două săptămâni.",
    items: ["Anunțuri multiple generate rapid", "Adaptare automată pentru OLX vs. Facebook", "Descrieri care inspiră încredere cumpărătorilor"],
    rating: 5,
    plan: "Business",
  },
  {
    name: "Diana M.",
    location: "Iași",
    platform: "Vinted",
    category: "Sneakers & Streetwear",
    avatar: "DM",
    color: "#34d399",
    before: "Incertitudine: original sau replică?",
    after: "Preț corect pentru fiecare categorie",
    metric: "100%",
    metricLabel: "transparență la cumpărători",
    story:
      "Vând atât sneakers originali cât și replici (cu mențiune clară în anunț). Problema era că nu știam exact cât să cer pentru fiecare. AnunțAI are un selector special: Original / Replică / Necunoscut. Prețurile estimate diferă radical — și sunt realiste față de ce se vinde efectiv pe platformă.",
    items: ["Selector tip produs: Original / Replică / Necunoscut", "Prețuri calibrate pe piața românească", "Titluri clare care setează așteptările corecte"],
    rating: 5,
    plan: "Pro",
  },
];

const CASES_EN = [
  {
    name: "Mirela P.",
    location: "Cluj-Napoca",
    platform: "Vinted",
    category: "Clothes & Accessories",
    avatar: "MP",
    color: "#d4991a",
    before: "3–5 days until first offer",
    after: "Under 24 hours",
    metric: "+280%",
    metricLabel: "more views",
    story:
      "I'd been selling second-hand clothes on Vinted for 2 years, but my listings weren't getting traction. I wrote short descriptions without much thought. I tried AnunțAI with a leather jacket and it generated a title with all the keywords buyers search for. The next day I had 12 messages.",
    items: ["Titles with brand + model + size", "Descriptions highlighting exact condition", "Tags with popular search terms on Vinted RO"],
    rating: 5,
    plan: "Pro",
  },
  {
    name: "Andrei T.",
    location: "Bucharest",
    platform: "OLX",
    category: "Electronics",
    avatar: "AT",
    color: "#60a5fa",
    before: "Underpriced items, long negotiations",
    after: "Right price from the start",
    metric: "+35%",
    metricLabel: "higher selling price",
    story:
      "I was selling second-hand laptops and phones but never knew exactly how much to ask. I underpriced out of fear they'd sit forever. AnunțAI's price estimator showed me the realistic range for each device — with clear justification. Now I post with a correct price and don't negotiate from low.",
    items: ["RON price range based on real market data", "Technical descriptions generated from photos", "Titles with exact specs (RAM, storage, condition)"],
    rating: 5,
    plan: "Pro+",
  },
  {
    name: "The Ionescu Family",
    location: "Timișoara",
    platform: "OLX + Facebook Marketplace",
    category: "Furniture & Home",
    avatar: "FI",
    color: "#a78bfa",
    before: "1–2 listings/week (too exhausting)",
    after: "8–10 listings/week",
    metric: "5×",
    metricLabel: "faster per listing",
    story:
      "We were renovating our apartment and had dozens of items to sell. Writing one listing at a time was exhausting. With AnunțAI we'd photograph the item and in 10 seconds had title, description, and tags ready. We posted 35 listings in 3 days and sold almost everything in two weeks.",
    items: ["Multiple listings generated quickly", "Automatic adaptation for OLX vs. Facebook", "Descriptions that inspire buyer confidence"],
    rating: 5,
    plan: "Business",
  },
  {
    name: "Diana M.",
    location: "Iași",
    platform: "Vinted",
    category: "Sneakers & Streetwear",
    avatar: "DM",
    color: "#34d399",
    before: "Uncertainty: original or replica?",
    after: "Correct price for each category",
    metric: "100%",
    metricLabel: "buyer transparency",
    story:
      "I sell both original sneakers and replicas (clearly stated in the listing). The problem was not knowing how much to charge for each. AnunțAI has a special selector: Original / Replica / Unknown. Estimated prices differ radically — and are realistic compared to what actually sells on the platform.",
    items: ["Product type selector: Original / Replica / Unknown", "Prices calibrated to the Romanian market", "Clear titles that set correct expectations"],
    rating: 5,
    plan: "Pro",
  },
];

export default async function CaseStudiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isRo = locale === "ro";
  const cases = isRo ? CASES_RO : CASES_EN;

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 24px 80px" }}>
        <Link href={`/${locale}`} style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "48px", textDecoration: "none" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={16} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "17px", color: "var(--color-foreground)" }}>
            Anunț<span style={{ color: "var(--primary-light)" }}>AI</span>
          </span>
        </Link>

        <div style={{ marginBottom: "56px" }}>
          <div style={{ display: "inline-block", background: "rgba(212,153,26,0.1)", border: "1px solid rgba(212,153,26,0.25)", borderRadius: "100px", padding: "6px 16px", marginBottom: "20px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--primary-light)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {isRo ? "Rezultate reale" : "Real results"}
            </span>
          </div>
          <h1 style={{ fontFamily: "Rubik, sans-serif", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, marginBottom: "16px", color: "var(--color-foreground)", lineHeight: 1.15 }}>
            {isRo ? "Vânzătorii care vând mai repede cu AnunțAI" : "Sellers who sell faster with AnunțAI"}
          </h1>
          <p style={{ color: "var(--color-muted-foreground)", fontSize: "16px", lineHeight: 1.7, maxWidth: "620px" }}>
            {isRo
              ? "Povești reale de la vânzători din toată România — de la haine second-hand la electronice și mobilă."
              : "Real stories from sellers across Romania — from second-hand clothes to electronics and furniture."}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {cases.map((c, i) => (
            <div key={i} className="card cs-card" style={{ padding: "36px", position: "relative", overflow: "hidden" }}>
              {/* Accent bar */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${c.color} 0%, transparent 100%)` }} />

              {/* Header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${c.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Rubik, sans-serif", fontWeight: 800, fontSize: "14px", color: c.color, flexShrink: 0 }}>
                    {c.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "16px", color: "var(--color-foreground)" }}>{c.name}</div>
                    <div style={{ fontSize: "13px", color: "var(--color-muted-foreground)" }}>{c.location} · {c.platform} · {c.category}</div>
                    <div style={{ display: "flex", gap: "2px", marginTop: "4px" }}>
                      {Array.from({ length: c.rating }).map((_, j) => <Star key={j} size={11} color="#d4991a" fill="#d4991a" />)}
                    </div>
                  </div>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", background: "rgba(212,153,26,0.08)", border: "1px solid rgba(212,153,26,0.2)", borderRadius: "100px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary-light)" }}>Plan {c.plan}</span>
                </div>
              </div>

              {/* Before / After */}
              <div className="cs-ba-grid" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "12px", alignItems: "center", marginBottom: "24px" }}>
                <div style={{ padding: "16px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "10px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>{isRo ? "Înainte" : "Before"}</div>
                  <div style={{ fontSize: "13px", color: "var(--color-foreground)", lineHeight: 1.4 }}>{c.before}</div>
                </div>
                <span className="cs-ba-arrow" style={{ display: "flex", justifyContent: "center" }}>
                  <ArrowRight size={16} color="var(--color-muted-foreground)" />
                </span>
                <div style={{ padding: "16px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "10px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>{isRo ? "După" : "After"}</div>
                  <div style={{ fontSize: "13px", color: "var(--color-foreground)", lineHeight: 1.4 }}>{c.after}</div>
                </div>
              </div>

              {/* Metric highlight */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", background: `${c.color}0f`, border: `1px solid ${c.color}33`, borderRadius: "10px", marginBottom: "20px" }}>
                <TrendingUp size={18} color={c.color} />
                <span style={{ fontFamily: "Rubik, sans-serif", fontWeight: 800, fontSize: "22px", color: c.color }}>{c.metric}</span>
                <span style={{ fontSize: "14px", color: "var(--color-muted-foreground)" }}>{c.metricLabel}</span>
              </div>

              {/* Story */}
              <p style={{ fontSize: "14px", color: "var(--color-muted-foreground)", lineHeight: 1.75, marginBottom: "20px", fontStyle: "italic" }}>
                &ldquo;{c.story}&rdquo;
              </p>

              {/* Features used */}
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-foreground)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {isRo ? "Ce a ajutat cel mai mult" : "What helped most"}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {c.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "var(--color-muted-foreground)" }}>
                      <Clock size={13} color={c.color} style={{ flexShrink: 0, marginTop: "2px" }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="card" style={{ marginTop: "48px", padding: "40px 32px", textAlign: "center", background: "linear-gradient(135deg, rgba(212,153,26,0.08) 0%, rgba(168,111,14,0.04) 100%)" }}>
          <h2 style={{ fontFamily: "Rubik, sans-serif", fontSize: "22px", fontWeight: 700, marginBottom: "10px", color: "var(--color-foreground)" }}>
            {isRo ? "Vrei și tu rezultate ca acestea?" : "Want results like these?"}
          </h2>
          <p style={{ color: "var(--color-muted-foreground)", fontSize: "14px", marginBottom: "24px" }}>
            {isRo ? "Încearcă gratuit — 1 anunț/zi, fără card." : "Try for free — 1 listing/day, no card."}
          </p>
          <Link href={`/${locale}/auth/signup`} className="btn-primary" style={{ textDecoration: "none", padding: "13px 32px", fontSize: "15px" }}>
            {isRo ? "Începe gratuit" : "Start for free"}
          </Link>
        </div>
      </div>
    </div>
  );
}
