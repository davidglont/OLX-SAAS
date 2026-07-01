import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Target, Shield, Lightbulb, Users, ArrowLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isRo = locale === "ro";
  return {
    title: isRo ? "Despre noi — AnunțAI" : "About us — AnunțAI",
    description: isRo
      ? "AnunțAI a fost creat pentru vânzătorii români care vor să economisească timp și să vândă mai repede pe OLX și Vinted."
      : "AnunțAI was created for Romanian sellers who want to save time and sell faster on OLX and Vinted.",
  };
}

const STATS = [
  { value: "10s", label_ro: "pentru un anunț complet", label_en: "for a complete listing" },
  { value: "3×", label_ro: "mai multe vizualizări în medie", label_en: "more views on average" },
  { value: "100%", label_ro: "conform GDPR", label_en: "GDPR compliant" },
  { value: "24/7", label_ro: "disponibil oricând", label_en: "always available" },
];

const VALUES_RO = [
  { icon: Target, title: "Simplitate", body: "Un formular, o poză, un anunț gata de publicat. Fără complicații, fără setup lung." },
  { icon: Lightbulb, title: "Inteligență aplicată", body: "AI-ul nostru înțelege piața românească — prețuri locale, terminologie specifică, platformele OLX și Vinted." },
  { icon: Shield, title: "Confidențialitate", body: "Pozele nu sunt stocate. Datele tale nu sunt vândute. Conformitate GDPR completă." },
  { icon: Users, title: "Pentru vânzătorii români", body: "Construit specific pentru marketplace-urile din România, cu înțelegere profundă a cumpărătorilor locali." },
];

const VALUES_EN = [
  { icon: Target, title: "Simplicity", body: "One form, one photo, one listing ready to publish. No complexity, no lengthy setup." },
  { icon: Lightbulb, title: "Applied intelligence", body: "Our AI understands the Romanian market — local prices, specific terminology, OLX and Vinted platforms." },
  { icon: Shield, title: "Privacy", body: "Photos are not stored. Your data is not sold. Full GDPR compliance." },
  { icon: Users, title: "For Romanian sellers", body: "Built specifically for Romania's marketplaces, with deep understanding of local buyers." },
];

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isRo = locale === "ro";
  const values = isRo ? VALUES_RO : VALUES_EN;

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "60px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "64px", flexWrap: "wrap", gap: "12px" }}>
          <Link href={`/${locale}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none", color: "var(--color-muted-foreground)", fontSize: "14px", fontWeight: 500, padding: "8px 14px", borderRadius: "10px", border: "1px solid var(--color-border)", background: "rgba(255,255,255,0.03)" }}>
            <ArrowLeft size={15} />
            {isRo ? "Acasă" : "Home"}
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

        {/* Hero */}
        <div style={{ marginBottom: "64px" }}>
          <div style={{ display: "inline-block", background: "rgba(212,153,26,0.1)", border: "1px solid rgba(212,153,26,0.25)", borderRadius: "100px", padding: "6px 16px", marginBottom: "20px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--primary-light)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {isRo ? "Povestea noastră" : "Our story"}
            </span>
          </div>
          <h1 style={{ fontFamily: "Rubik, sans-serif", fontSize: "clamp(30px, 5vw, 46px)", fontWeight: 800, marginBottom: "20px", color: "var(--color-foreground)", lineHeight: 1.15 }}>
            {isRo ? "Creat pentru vânzătorii care apreciază timpul lor" : "Built for sellers who value their time"}
          </h1>
          <p style={{ fontSize: "17px", color: "var(--color-muted-foreground)", lineHeight: 1.75, maxWidth: "640px" }}>
            {isRo
              ? "AnunțAI s-a născut dintr-o frustrare reală: scrierea unui anunț bun pe OLX dura 20-30 de minute — titlu, descriere, taguri, preț estimat. Acum durează 10 secunde. Am construit un instrument care înțelege piața românească și vorbește pe limba cumpărătorilor locali."
              : "AnunțAI was born from a real frustration: writing a good listing on OLX took 20–30 minutes — title, description, tags, estimated price. Now it takes 10 seconds. We built a tool that understands the Romanian market and speaks the language of local buyers."}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "64px" }}>
          {STATS.map((s) => (
            <div key={s.value} className="card" style={{ padding: "24px 20px", textAlign: "center" }}>
              <div style={{ fontFamily: "Rubik, sans-serif", fontSize: "36px", fontWeight: 800, background: "linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "13px", color: "var(--color-muted-foreground)", marginTop: "6px", lineHeight: 1.4 }}>
                {isRo ? s.label_ro : s.label_en}
              </div>
            </div>
          ))}
        </div>

        {/* Values */}
        <h2 style={{ fontFamily: "Rubik, sans-serif", fontSize: "22px", fontWeight: 700, marginBottom: "24px", color: "var(--color-foreground)" }}>
          {isRo ? "Valorile noastre" : "Our values"}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "64px" }}>
          {values.map((v) => (
            <div key={v.title} className="card" style={{ padding: "28px 24px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(212,153,26,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                <v.icon size={20} color="var(--primary-light)" />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "16px", marginBottom: "8px", color: "var(--color-foreground)" }}>{v.title}</h3>
              <p style={{ fontSize: "14px", color: "var(--color-muted-foreground)", lineHeight: 1.65 }}>{v.body}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="card" style={{ padding: "40px 32px", textAlign: "center", background: "linear-gradient(135deg, rgba(212,153,26,0.08) 0%, rgba(168,111,14,0.04) 100%)" }}>
          <h2 style={{ fontFamily: "Rubik, sans-serif", fontSize: "22px", fontWeight: 700, marginBottom: "10px", color: "var(--color-foreground)" }}>
            {isRo ? "Gata să vinzi mai rapid?" : "Ready to sell faster?"}
          </h2>
          <p style={{ color: "var(--color-muted-foreground)", fontSize: "14px", marginBottom: "24px" }}>
            {isRo ? "Încearcă gratuit — fără card de credit." : "Try for free — no credit card required."}
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={`/${locale}/auth/signup`} className="btn-primary" style={{ textDecoration: "none", padding: "12px 28px" }}>
              {isRo ? "Creează cont gratuit" : "Create free account"}
            </Link>
            <Link href={`/${locale}/pricing`} style={{ textDecoration: "none", padding: "12px 24px", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--color-foreground)", fontWeight: 600, fontSize: "14px" }}>
              {isRo ? "Vezi planurile" : "View plans"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
