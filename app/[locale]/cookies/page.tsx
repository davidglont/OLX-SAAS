import Link from "next/link";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function CookiesPage({ params }: Props) {
  const { locale } = await params;
  const isRo = locale === "ro";

  const sections = isRo ? [
    {
      title: "Ce sunt cookie-urile?",
      body: "Cookie-urile sunt fișiere text mici stocate pe dispozitivul tău când vizitezi un site web. Ele permit site-ului să își amintească preferințele tale și să funcționeze corect.",
    },
    {
      title: "Cookie-uri esențiale",
      body: "Aceste cookie-uri sunt necesare pentru funcționarea platformei. Nu pot fi dezactivate. Includ: sesiunea de autentificare (next-auth.session-token), preferința de limbă și token CSRF de securitate.",
    },
    {
      title: "Cookie-uri funcționale",
      body: "Cookie-uri care memorează preferințele tale: tema interfeței, consimțământul pentru cookie-uri (anuntai_cookie_consent). Durata: 12 luni.",
    },
    {
      title: "Cookie-uri analitice",
      body: "Dacă accepti, folosim cookie-uri analitice anonimizate pentru a înțelege cum este utilizată platforma și pentru a o îmbunătăți. Nu colectăm date cu caracter personal prin aceste cookie-uri.",
    },
    {
      title: "Cookie-uri de la terți",
      body: "Platforma poate include servicii de la terți (ex: Stripe pentru plăți) care pot plasa propriile cookie-uri. Consultați politicile lor de confidențialitate pentru detalii.",
    },
    {
      title: "Cum poți controla cookie-urile?",
      body: "Poți accepta sau refuza cookie-urile non-esențiale prin bannerul afișat la prima vizită. De asemenea, poți șterge cookie-urile din setările browserului oricând. Rețineți că dezactivarea cookie-urilor esențiale poate afecta funcționalitatea platformei.",
    },
    {
      title: "Durata cookie-urilor",
      body: "Cookie-urile de sesiune sunt șterse când închizi browserul. Cookie-urile persistente rămân pe dispozitiv conform duratei specificate: sesiunea de autentificare (30 de zile), preferințele (12 luni).",
    },
    {
      title: "Contact",
      body: "Pentru întrebări despre utilizarea cookie-urilor, ne poți contacta la: contact@anuntai.ro",
    },
  ] : [
    {
      title: "What are cookies?",
      body: "Cookies are small text files stored on your device when you visit a website. They allow the site to remember your preferences and function correctly.",
    },
    {
      title: "Essential cookies",
      body: "These cookies are necessary for the platform to function. They cannot be disabled. They include: authentication session (next-auth.session-token), language preference, and CSRF security token.",
    },
    {
      title: "Functional cookies",
      body: "Cookies that remember your preferences: interface theme, cookie consent (anuntai_cookie_consent). Duration: 12 months.",
    },
    {
      title: "Analytics cookies",
      body: "If you consent, we use anonymized analytics cookies to understand how the platform is used and to improve it. We do not collect personal data through these cookies.",
    },
    {
      title: "Third-party cookies",
      body: "The platform may include third-party services (e.g., Stripe for payments) that may place their own cookies. Please consult their privacy policies for details.",
    },
    {
      title: "How to control cookies?",
      body: "You can accept or decline non-essential cookies through the banner displayed on your first visit. You can also delete cookies from your browser settings at any time. Note that disabling essential cookies may affect platform functionality.",
    },
    {
      title: "Cookie duration",
      body: "Session cookies are deleted when you close your browser. Persistent cookies remain on your device for the specified duration: authentication session (30 days), preferences (12 months).",
    },
    {
      title: "Contact",
      body: "For questions about cookie usage, you can contact us at: contact@anuntai.ro",
    },
  ];

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "80px 28px 120px" }}>
      <div style={{ marginBottom: "12px" }}>
        <Link href={`/${locale}`} style={{ fontSize: "13px", color: "var(--primary-light)", textDecoration: "none" }}>
          ← {isRo ? "Înapoi acasă" : "Back home"}
        </Link>
      </div>

      <h1 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,42px)", color: "var(--color-foreground)", marginBottom: "12px", lineHeight: 1.1 }}>
        {isRo ? "Politica Cookie" : "Cookie Policy"}
      </h1>
      <p style={{ fontSize: "13px", color: "var(--color-muted-foreground)", marginBottom: "48px" }}>
        {isRo ? "Ultima actualizare: Iunie 2025" : "Last updated: June 2025"}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
        {sections.map((s, i) => (
          <div key={i}>
            <h2 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "17px", color: "var(--color-foreground)", marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "8px", background: "rgba(212,153,26,0.12)", border: "1px solid rgba(212,153,26,0.22)", fontSize: "12px", fontWeight: 800, color: "var(--primary-light)", flexShrink: 0 }}>
                {i + 1}
              </span>
              {s.title}
            </h2>
            <p style={{ fontSize: "14px", color: "var(--color-muted-foreground)", lineHeight: 1.8 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
