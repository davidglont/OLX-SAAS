import { notFound } from "next/navigation";
import Link from "next/link";
import { Shield } from "lucide-react";

interface Props {
  params: Promise<{ locale: string }>;
}

const CONTENT = {
  ro: {
    title: "Politica de Confidențialitate",
    updated: "Ultima actualizare: 24 Iunie 2026",
    sections: [
      {
        heading: "1. Informații pe care le colectăm",
        body: "Colectăm adresa de email, numele și imaginea de profil (prin Google OAuth) pentru a crea și gestiona contul tău. Stocăm anunțurile generate de tine și istoricul utilizării zilnice (număr de anunțuri create).",
      },
      {
        heading: "2. Cum folosim informațiile",
        body: "Informațiile tale sunt folosite exclusiv pentru: furnizarea serviciului AnunțAI, gestionarea abonamentului (Stripe), limitarea utilizării conform planului ales și îmbunătățirea calității AI-ului. Nu vindem datele tale niciunei terțe părți.",
      },
      {
        heading: "3. Procesarea imaginilor",
        body: "Imaginile pe care le încarci sunt transmise API-ului Anthropic (Claude) pentru analiză și sunt procesate exclusiv în memorie. Nu stocăm imaginile pe serverele noastre după procesare.",
      },
      {
        heading: "4. Stripe și plăți",
        body: "Plățile sunt procesate de Stripe Inc. Nu stocăm date de card pe serverele noastre. Stripe poate colecta informații conform propriei politici de confidențialitate disponibile la stripe.com/privacy.",
      },
      {
        heading: "5. Cookie-uri și sesiuni",
        body: "Folosim cookie-uri HTTPOnly securizate pentru gestionarea sesiunilor de autentificare (NextAuth.js). Nu folosim cookie-uri de tracking sau publicitate.",
      },
      {
        heading: "6. Drepturile tale (GDPR)",
        body: "Ai dreptul la: acces la datele tale, rectificare, ștergere ('dreptul de a fi uitat'), portabilitate și opoziție față de procesare. Pentru exercitarea acestor drepturi, contactează-ne la davidglodean576@gmail.com.",
      },
      {
        heading: "7. Retenția datelor",
        body: "Contul și datele tale sunt păstrate atât timp cât contul este activ. La ștergerea contului, toate datele personale sunt șterse în 30 de zile.",
      },
      {
        heading: "8. Contact",
        body: "Pentru orice întrebare legată de confidențialitate, contactează-ne la: davidglodean576@gmail.com",
      },
    ],
    back: "Înapoi acasă",
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: June 24, 2026",
    sections: [
      {
        heading: "1. Information we collect",
        body: "We collect your email address, name and profile picture (via Google OAuth) to create and manage your account. We store listings you generate and daily usage history (number of listings created).",
      },
      {
        heading: "2. How we use your information",
        body: "Your information is used exclusively for: providing the AnunțAI service, managing your subscription (Stripe), enforcing usage limits per plan, and improving AI quality. We do not sell your data to any third party.",
      },
      {
        heading: "3. Image processing",
        body: "Images you upload are sent to Anthropic's API (Claude) for analysis and are processed exclusively in memory. We do not store images on our servers after processing.",
      },
      {
        heading: "4. Stripe and payments",
        body: "Payments are processed by Stripe Inc. We do not store card data on our servers. Stripe may collect information per their own privacy policy available at stripe.com/privacy.",
      },
      {
        heading: "5. Cookies and sessions",
        body: "We use secure HTTPOnly cookies for authentication session management (NextAuth.js). We do not use tracking or advertising cookies.",
      },
      {
        heading: "6. Your rights (GDPR)",
        body: "You have the right to: access your data, rectification, erasure ('right to be forgotten'), portability and objection to processing. To exercise these rights, contact us at davidglodean576@gmail.com.",
      },
      {
        heading: "7. Data retention",
        body: "Your account and data are kept as long as the account is active. Upon account deletion, all personal data is deleted within 30 days.",
      },
      {
        heading: "8. Contact",
        body: "For any privacy-related questions, contact us at: davidglodean576@gmail.com",
      },
    ],
    back: "Back home",
  },
};

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const content = CONTENT[locale as "ro" | "en"];
  if (!content) notFound();

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", paddingTop: "96px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 28px" }}>

        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px", borderRadius: "20px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", marginBottom: "20px" }}>
            <Shield size={13} color="var(--primary-light)" />
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
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
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
