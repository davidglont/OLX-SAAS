import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Mail, Clock, MessageSquare, HelpCircle, ArrowLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isRo = locale === "ro";
  return {
    title: isRo ? "Contact — AnunțAI" : "Contact — AnunțAI",
    description: isRo
      ? "Contactează echipa AnunțAI. Răspundem în maxim 24 de ore în zilele lucrătoare."
      : "Contact the AnunțAI team. We respond within 24 hours on business days.",
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isRo = locale === "ro";

  const channels = [
    {
      icon: Mail,
      title: isRo ? "Email general" : "General email",
      value: "contact@anuntai.ro",
      href: "mailto:contact@anuntai.ro",
      desc: isRo ? "Întrebări generale, feedback, parteneriate" : "General questions, feedback, partnerships",
    },
    {
      icon: HelpCircle,
      title: "Support",
      value: "support@anuntai.ro",
      href: "mailto:support@anuntai.ro",
      desc: isRo ? "Probleme tehnice, erori, cont blocat" : "Technical issues, errors, locked account",
    },
    {
      icon: MessageSquare,
      title: isRo ? "GDPR / Date personale" : "GDPR / Personal data",
      value: "gdpr@anuntai.ro",
      href: "mailto:gdpr@anuntai.ro",
      desc: isRo ? "Solicitări de ștergere, export sau rectificare date" : "Deletion, export, or data rectification requests",
    },
  ];

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "48px", flexWrap: "wrap", gap: "12px" }}>
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

        <h1 style={{ fontFamily: "Rubik, sans-serif", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, marginBottom: "12px", color: "var(--color-foreground)" }}>
          {isRo ? "Contact" : "Contact us"}
        </h1>
        <p style={{ color: "var(--color-muted-foreground)", fontSize: "16px", lineHeight: 1.65, marginBottom: "48px" }}>
          {isRo
            ? "Suntem o echipă mică și răspundem personal la fiecare mesaj. Așteptarea medie este sub 24 de ore în zilele lucrătoare."
            : "We're a small team and personally respond to every message. Average wait is under 24 hours on business days."}
        </p>

        {/* Response time banner */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 18px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "12px", marginBottom: "36px" }}>
          <Clock size={16} color="#22c55e" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: "13px", color: "var(--color-foreground)" }}>
            {isRo
              ? "Timp mediu de răspuns: sub 24h (L–V). Business: sub 4h."
              : "Average response time: under 24h (M–F). Business plan: under 4h."}
          </span>
        </div>

        {/* Contact channels */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "48px" }}>
          {channels.map((ch) => (
            <a
              key={ch.href}
              href={ch.href}
              className="card"
              style={{ display: "flex", alignItems: "flex-start", gap: "16px", padding: "24px", textDecoration: "none", transition: "border-color 150ms" }}
            >
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(212,153,26,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ch.icon size={18} color="var(--primary-light)" />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--color-foreground)", marginBottom: "2px" }}>{ch.title}</div>
                <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--primary-light)", marginBottom: "4px" }}>{ch.value}</div>
                <div style={{ fontSize: "13px", color: "var(--color-muted-foreground)" }}>{ch.desc}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Legal info */}
        <div className="card" style={{ padding: "24px 28px" }}>
          <h2 style={{ fontFamily: "Rubik, sans-serif", fontSize: "16px", fontWeight: 700, marginBottom: "12px", color: "var(--color-foreground)" }}>
            {isRo ? "Informații legale" : "Legal information"}
          </h2>
          <div style={{ fontSize: "13px", color: "var(--color-muted-foreground)", lineHeight: 1.8 }}>
            <div><strong style={{ color: "var(--color-foreground)" }}>AnunțAI SRL</strong></div>
            <div>{isRo ? "Înregistrată în România" : "Registered in Romania"}</div>
            <div style={{ marginTop: "8px" }}>
              <Link href={`/${locale}/terms`} style={{ color: "var(--primary-light)", textDecoration: "none", fontWeight: 600 }}>
                {isRo ? "Termeni și Condiții" : "Terms & Conditions"}
              </Link>
              {" · "}
              <Link href={`/${locale}/privacy`} style={{ color: "var(--primary-light)", textDecoration: "none", fontWeight: 600 }}>
                {isRo ? "Politica de Confidențialitate" : "Privacy Policy"}
              </Link>
              {" · "}
              <Link href={`/${locale}/cookies`} style={{ color: "var(--primary-light)", textDecoration: "none", fontWeight: 600 }}>
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
