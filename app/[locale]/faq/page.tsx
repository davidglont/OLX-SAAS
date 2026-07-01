"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { ChevronDown, Zap, ArrowLeft } from "lucide-react";

const FAQ_RO = [
  {
    q: "Ce este AnunțAI și cum funcționează?",
    a: "AnunțAI este un asistent AI specializat pentru marketplace-urile românești (OLX, Vinted, Facebook Marketplace). Încarci o poză cu produsul tău, iar AI-ul generează automat un titlu optimizat, o descriere persuasivă și taguri relevante — în 10 secunde.",
  },
  {
    q: "Ce platforme sunt suportate?",
    a: "AnunțAI generează anunțuri optimizate pentru OLX, Vinted și Facebook Marketplace. Textele sunt adaptate stilului fiecărei platforme: mai scurt și direct pentru OLX, mai detaliat pentru Vinted.",
  },
  {
    q: "Cât de accurate sunt estimările de preț?",
    a: "Estimatorul de preț analizează categoria, starea și descrierea produsului folosind date de piață românești. Oferă un interval realist (min-max RON/EUR), nu un preț fix. Pentru produse rare sau de colecție, verifică și pe OLX.ro înainte de postare.",
  },
  {
    q: "Funcționează și pentru replica / produse second-hand?",
    a: "Da. La estimatorul de preț poți selecta tipul produsului: Original, Replică sau Necunoscut. AI-ul ajustează prețul estimat în funcție de categoria aleasă — replicele primesc un interval de 5-15% din prețul originalului.",
  },
  {
    q: "Câte analize pot face pe zi?",
    a: "Planul Free include 1 analiză/zi. Planul Pro include 3/zi, Pro+ include 5/zi, iar Business include 15/zi. Limitele se resetează zilnic la miezul nopții.",
  },
  {
    q: "Ce se întâmplă dacă îmi expir limita zilnică?",
    a: "Vei primi un mesaj de eroare care îți va indica câte analize ai rămas. Poți face upgrade la un plan superior oricând sau poți reveni a doua zi după resetare.",
  },
  {
    q: "Datele mele și pozele sunt salvate?",
    a: "Pozele sunt procesate exclusiv pentru analiza curentă și nu sunt stocate pe serverele noastre după generarea anunțului. Anunțurile generate (text) sunt salvate în contul tău pentru a le putea accesa ulterior.",
  },
  {
    q: "AnunțAI respectă GDPR?",
    a: "Da. Sunt colectate doar datele necesare funcționării (email, nume, anunțuri generate). Nu vindem date terților. Poți solicita ștergerea completă a contului trimițând un email la contact@anuntai.ro.",
  },
  {
    q: "Pot anula abonamentul oricând?",
    a: "Da, poți anula oricând din pagina Contul Meu → secțiunea abonament. Accesul la funcțiile premium rămâne activ până la sfârșitul perioadei plătite.",
  },
  {
    q: "Ce metode de plată sunt acceptate?",
    a: "Plata se face prin Stripe, care acceptă carduri Visa, Mastercard și American Express. Plățile sunt procesate securizat — AnunțAI nu stochează datele cardului tău.",
  },
  {
    q: "Există perioadă de probă gratuită?",
    a: "Planul Free este disponibil permanent (fără card) și include 1 analiză/zi. Nu există o perioadă de probă separată, dar poți testa gratuit înainte de a decide dacă faci upgrade.",
  },
  {
    q: "Cum îl contactez pe support?",
    a: "Trimite un email la contact@anuntai.ro. Răspundem în maxim 24 de ore în zilele lucrătoare. Utilizatorii Business beneficiază de suport prioritar cu răspuns în 4 ore.",
  },
];

const FAQ_EN = [
  {
    q: "What is AnunțAI and how does it work?",
    a: "AnunțAI is an AI assistant specialized for Romanian marketplaces (OLX, Vinted, Facebook Marketplace). You upload a photo of your product, and the AI automatically generates an optimized title, a persuasive description, and relevant tags — in 10 seconds.",
  },
  {
    q: "Which platforms are supported?",
    a: "AnunțAI generates optimized listings for OLX, Vinted, and Facebook Marketplace. Texts are adapted to each platform's style: shorter and direct for OLX, more detailed for Vinted.",
  },
  {
    q: "How accurate are the price estimates?",
    a: "The price estimator analyzes the category, condition, and description using Romanian market data. It provides a realistic range (min-max RON/EUR), not a fixed price. For rare or collectible items, also check OLX.ro before posting.",
  },
  {
    q: "Does it work for replicas / second-hand products?",
    a: "Yes. In the price estimator you can select the product type: Original, Replica, or Unknown. The AI adjusts the estimated price accordingly — replicas get a range of 5-15% of the original's price.",
  },
  {
    q: "How many analyses can I do per day?",
    a: "Free plan includes 1 analysis/day. Pro includes 3/day, Pro+ includes 5/day, and Business includes 15/day. Limits reset daily at midnight.",
  },
  {
    q: "Are my data and photos saved?",
    a: "Photos are processed exclusively for the current analysis and are not stored on our servers after the listing is generated. Generated listings (text) are saved to your account for future access.",
  },
  {
    q: "Is AnunțAI GDPR compliant?",
    a: "Yes. Only the data necessary for operation is collected (email, name, generated listings). We don't sell data to third parties. You can request full account deletion by emailing contact@anuntai.ro.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, you can cancel anytime from My Account → subscription section. Premium feature access remains active until the end of the paid period.",
  },
  {
    q: "What payment methods are accepted?",
    a: "Payment is processed through Stripe, which accepts Visa, Mastercard, and American Express. Payments are securely processed — AnunțAI does not store your card data.",
  },
  {
    q: "Is there a free trial?",
    a: "The Free plan is permanently available (no card required) and includes 1 analysis/day. There is no separate trial period, but you can test for free before deciding to upgrade.",
  },
];

export default function FAQPage() {
  const locale = useLocale();
  const faqs = locale === "ro" ? FAQ_RO : FAQ_EN;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "48px", flexWrap: "wrap", gap: "12px" }}>
          <Link href={`/${locale}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none", color: "var(--color-muted-foreground)", fontSize: "14px", fontWeight: 500, padding: "8px 14px", borderRadius: "10px", border: "1px solid var(--color-border)", background: "rgba(255,255,255,0.03)" }}>
            <ArrowLeft size={15} />
            {locale === "ro" ? "Acasă" : "Home"}
          </Link>
          <Link href={`/${locale}`} style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={14} color="white" fill="white" />
            </div>
            <span style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "16px", color: "var(--color-foreground)" }}>
              Anunț<span style={{ color: "var(--primary-light)" }}>AI</span>
            </span>
          </Link>
        </div>

        <h1 style={{ fontFamily: "Rubik, sans-serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, marginBottom: "12px", color: "var(--color-foreground)" }}>
          {locale === "ro" ? "Întrebări frecvente" : "Frequently asked questions"}
        </h1>
        <p style={{ color: "var(--color-muted-foreground)", fontSize: "16px", marginBottom: "48px", lineHeight: 1.6 }}>
          {locale === "ro"
            ? "Găsești răspunsuri la cele mai comune întrebări mai jos. Dacă nu găsești ce cauți, scrie-ne la contact@anuntai.ro."
            : "Find answers to the most common questions below. If you can't find what you're looking for, email us at contact@anuntai.ro."}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {faqs.map((item, i) => (
            <div key={i} className="card" style={{ padding: 0, overflow: "hidden", borderRadius: "12px" }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: "20px 24px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}
              >
                <span style={{ fontWeight: 600, fontSize: "15px", color: "var(--color-foreground)", lineHeight: 1.4 }}>{item.q}</span>
                <ChevronDown size={18} color="var(--color-muted-foreground)" style={{ flexShrink: 0, transform: open === i ? "rotate(180deg)" : "none", transition: "transform 200ms ease" }} />
              </button>
              {open === i && (
                <div style={{ padding: "0 24px 20px", fontSize: "14px", color: "var(--color-muted-foreground)", lineHeight: 1.7, borderTop: "1px solid var(--border)" }}>
                  <p style={{ margin: "16px 0 0" }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: "48px", padding: "32px", textAlign: "center", background: "linear-gradient(135deg, rgba(212,153,26,0.08) 0%, rgba(168,111,14,0.04) 100%)" }}>
          <h2 style={{ fontFamily: "Rubik, sans-serif", fontSize: "20px", fontWeight: 700, marginBottom: "8px", color: "var(--color-foreground)" }}>
            {locale === "ro" ? "Ai o altă întrebare?" : "Have another question?"}
          </h2>
          <p style={{ color: "var(--color-muted-foreground)", fontSize: "14px", marginBottom: "20px" }}>
            {locale === "ro" ? "Suntem disponibili prin email, de luni până vineri." : "We're available by email, Monday through Friday."}
          </p>
          <a
            href="mailto:contact@anuntai.ro"
            className="btn-primary"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", padding: "11px 24px" }}
          >
            contact@anuntai.ro
          </a>
        </div>
      </div>
    </div>
  );
}
