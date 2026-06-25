import { notFound } from "next/navigation";
import Link from "next/link";
import { FileText } from "lucide-react";

interface Props {
  params: Promise<{ locale: string }>;
}

const CONTENT = {
  ro: {
    title: "Termeni și Condiții",
    updated: "Ultima actualizare: 24 Iunie 2026",
    sections: [
      {
        heading: "1. Acceptarea termenilor",
        body: "Prin utilizarea AnunțAI, ești de acord cu acești termeni. Dacă nu ești de acord, te rugăm să nu folosești serviciul.",
      },
      {
        heading: "2. Descrierea serviciului",
        body: "AnunțAI este un serviciu SaaS care utilizează inteligență artificială pentru a genera titluri, descrieri și taguri optimizate pentru anunțuri pe platforme de vânzare online (OLX, Vinted). Conținutul generat de AI este orientativ și utilizatorul este responsabil pentru verificarea și adaptarea acestuia.",
      },
      {
        heading: "3. Conturi și autentificare",
        body: "Ești responsabil pentru securitatea contului tău. Nu permite accesul altor persoane la contul tău. Informezi imediat în caz de utilizare neautorizată. Contul poate fi suspendat în caz de utilizare abuzivă.",
      },
      {
        heading: "4. Planuri și plăți",
        body: "Serviciul oferă planuri Free, Pro (€10/lună), Pro+ (€15/lună) și Business (€30/lună). Plățile se fac prin Stripe. Abonamentele se reînnoiesc automat. Poți anula oricând, anularea intrând în vigoare la finalul perioadei plătite. Nu oferim rambursări pentru perioadele parțiale.",
      },
      {
        heading: "5. Utilizare acceptabilă",
        body: "Serviciul poate fi utilizat exclusiv în scopuri legale. Este interzis: generarea de conținut fals sau înșelător, utilizarea automată (boți, scraping), încercarea de a accesa conturile altor utilizatori, suprasolicitarea infrastructurii.",
      },
      {
        heading: "6. Proprietatea conținutului",
        body: "Conținutul generat de AI (titluri, descrieri, taguri) îți aparține și îl poți utiliza fără restricții. AnunțAI nu revendică drepturi asupra conținutului generat pe baza imaginilor tale.",
      },
      {
        heading: "7. Limitarea răspunderii",
        body: "AnunțAI furnizează serviciul 'ca atare'. Nu garantăm că conținutul generat va duce la vânzări sau rezultate specifice. Nu suntem responsabili pentru daune indirecte, pierderi de profit sau pierderi de date.",
      },
      {
        heading: "8. Modificări ale serviciului",
        body: "Ne rezervăm dreptul de a modifica, suspenda sau întrerupe serviciul cu un preaviz de 30 de zile. Modificările termenilor vor fi comunicate prin email.",
      },
      {
        heading: "9. Legea aplicabilă",
        body: "Acești termeni sunt guvernați de legea română. Orice litigiu va fi soluționat de instanțele competente din România.",
      },
      {
        heading: "10. Contact",
        body: "Pentru întrebări legate de acești termeni: davidglodean576@gmail.com",
      },
    ],
    back: "Înapoi acasă",
  },
  en: {
    title: "Terms of Service",
    updated: "Last updated: June 24, 2026",
    sections: [
      {
        heading: "1. Acceptance of terms",
        body: "By using AnunțAI, you agree to these terms. If you disagree, please do not use the service.",
      },
      {
        heading: "2. Service description",
        body: "AnunțAI is a SaaS service that uses artificial intelligence to generate optimized titles, descriptions and tags for listings on online marketplaces (OLX, Vinted). AI-generated content is for guidance and the user is responsible for reviewing and adapting it.",
      },
      {
        heading: "3. Accounts and authentication",
        body: "You are responsible for the security of your account. Do not allow others to access your account. Notify us immediately of unauthorized use. Accounts may be suspended for abusive use.",
      },
      {
        heading: "4. Plans and payments",
        body: "The service offers Free, Pro (€10/mo), Pro+ (€15/mo) and Business (€30/mo) plans. Payments are processed via Stripe. Subscriptions renew automatically. You may cancel at any time; cancellation takes effect at the end of the paid period. No refunds for partial periods.",
      },
      {
        heading: "5. Acceptable use",
        body: "The service may only be used for lawful purposes. Prohibited: generating false or misleading content, automated use (bots, scraping), attempting to access other users' accounts, overloading infrastructure.",
      },
      {
        heading: "6. Content ownership",
        body: "AI-generated content (titles, descriptions, tags) belongs to you and may be used without restriction. AnunțAI does not claim rights over content generated from your images.",
      },
      {
        heading: "7. Limitation of liability",
        body: "AnunțAI provides the service 'as is'. We do not guarantee that generated content will lead to sales or specific results. We are not liable for indirect damages, lost profits or data loss.",
      },
      {
        heading: "8. Service changes",
        body: "We reserve the right to modify, suspend or discontinue the service with 30 days notice. Term changes will be communicated by email.",
      },
      {
        heading: "9. Governing law",
        body: "These terms are governed by Romanian law. Any dispute shall be resolved by the competent courts in Romania.",
      },
      {
        heading: "10. Contact",
        body: "For questions about these terms: davidglodean576@gmail.com",
      },
    ],
    back: "Back home",
  },
};

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  const content = CONTENT[locale as "ro" | "en"];
  if (!content) notFound();

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", paddingTop: "96px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 28px" }}>

        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px", borderRadius: "20px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", marginBottom: "20px" }}>
            <FileText size={13} color="var(--primary-light)" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--primary-light)", fontFamily: "Rubik,sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Legal
            </span>
          </div>
          <h1 className="display-text" style={{ fontSize: "clamp(28px,4vw,44px)", color: "var(--color-foreground)", marginBottom: "10px" }}>
            {content.title}
          </h1>
          <p style={{ fontSize: "13px", color: "var(--color-muted-foreground)" }}>{content.updated}</p>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {content.sections.map((s) => (
            <div key={s.heading} className="card" style={{ padding: "24px 28px" }}>
              <h2 style={{ fontFamily: "Rubik,sans-serif", fontWeight: 700, fontSize: "16px", color: "var(--color-foreground)", marginBottom: "12px" }}>
                {s.heading}
              </h2>
              <p style={{ fontSize: "14px", color: "var(--color-muted-foreground)", lineHeight: 1.75 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "48px" }}>
          <Link href={`/${locale}`} className="btn-secondary" style={{ fontSize: "14px", padding: "11px 24px" }}>
            ← {content.back}
          </Link>
        </div>
      </div>
    </div>
  );
}
