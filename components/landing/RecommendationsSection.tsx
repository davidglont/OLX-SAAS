"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { Camera, Type, DollarSign, Clock, Heart, Tag, MessageCircle, TrendingUp } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const tips = [
  {
    icon: Camera,
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.2)",
    title: { ro: "Fotografia conteaza", en: "Photography matters" },
    desc:  { ro: "Fundalul alb sau neutru creste vizualizarile cu pana la 34%. Fotografiaza la lumina naturala, fara blitz direct.", en: "White or neutral backgrounds boost views by up to 34%. Shoot in natural light, no direct flash." },
    stat:  { ro: "+34% vizualizari", en: "+34% views" },
  },
  {
    icon: Type,
    color: "#EC4899",
    bg: "rgba(236,72,153,0.1)",
    border: "rgba(236,72,153,0.2)",
    title: { ro: "Titlul SEO perfect", en: "Perfect SEO title" },
    desc:  { ro: "Pune brand-ul si modelul exact pe primul loc. Cumparatorii cauta iPhone 13 Pro, nu telefon bun de vanzare.", en: "Put the exact brand and model first. Buyers search for iPhone 13 Pro, not good phone for sale." },
    stat:  { ro: "2x mai multe cautari", en: "2x more searches" },
  },
  {
    icon: DollarSign,
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.2)",
    title: { ro: "Pretul psihologic", en: "Psychological pricing" },
    desc:  { ro: "499 RON vinde mai repede decat 500 RON. Lasa loc de negociere: listeaza cu 10-15% mai mult decat pretul minim acceptat.", en: "499 RON sells faster than 500 RON. Leave room to negotiate: list 10-15% above your minimum accepted price." },
    stat:  { ro: "Vinde 23% mai rapid", en: "Sells 23% faster" },
  },
  {
    icon: Clock,
    color: "#F0B429",
    bg: "rgba(240,180,41,0.1)",
    border: "rgba(240,180,41,0.2)",
    title: { ro: "Timing optim", en: "Optimal timing" },
    desc:  { ro: "Posteaza marti-joi intre 18:00-21:00 cand traficul OLX/Vinted este la maxim. Sambata dimineata functioneaza bine pentru electronice.", en: "Post Tuesday-Thursday between 18:00-21:00 when OLX/Vinted traffic peaks. Saturday morning works well for electronics." },
    stat:  { ro: "3x mai multa vizibilitate", en: "3x more visibility" },
  },
  {
    icon: Heart,
    color: "#EF4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.2)",
    title: { ro: "Descriere onesta", en: "Honest description" },
    desc:  { ro: "Mentioneaza defectele mici - cumparatorii apreciaza transparenta. Vanzatorii onesti primesc recenzii mai bune si vand mai repede.", en: "Mention small defects - buyers appreciate honesty. Honest sellers get better reviews and sell faster." },
    stat:  { ro: "89% recenzii pozitive", en: "89% positive reviews" },
  },
  {
    icon: Tag,
    color: "#06B6D4",
    bg: "rgba(6,182,212,0.1)",
    border: "rgba(6,182,212,0.2)",
    title: { ro: "Taguri strategice", en: "Strategic tags" },
    desc:  { ro: "Foloseste 8-12 taguri mixate: brand exact + categorie generala + sinonime + stare. iPhone si iphone sunt taguri diferite pe OLX.", en: "Use 8-12 mixed tags: exact brand + broad category + synonyms + condition. iPhone and iphone are different tags on OLX." },
    stat:  { ro: "+65% gasit in cautari", en: "+65% search discovery" },
  },
  {
    icon: MessageCircle,
    color: "#38BDF8",
    bg: "rgba(56,189,248,0.1)",
    border: "rgba(56,189,248,0.2)",
    title: { ro: "Raspunde rapid la mesaje", en: "Reply fast to messages" },
    desc:  { ro: "Cumparatorii serioasi trimit mesaje la mai multi vanzatori simultan. Cel care raspunde primul in 30 de minute castiga vanzarea in 70% din cazuri.", en: "Serious buyers message multiple sellers at once. The one who replies first within 30 minutes wins the sale in 70% of cases." },
    stat:  { ro: "70% din vanzari", en: "70% of sales" },
  },
  {
    icon: TrendingUp,
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.2)",
    title: { ro: "Pretul corect de la inceput", en: "Right price from the start" },
    desc:  { ro: "Anunturile cu pret real primesc de 2.4x mai multe mesaje. Scaderile ulterioare semnaleaza disperare si atrag oferte si mai mici.", en: "Listings with a real price get 2.4x more messages. Later price drops signal desperation and attract even lower offers." },
    stat:  { ro: "2.4x mai multe mesaje", en: "2.4x more messages" },
  },
];

export default function RecommendationsSection() {
  const locale = useLocale();
  const isRo = locale === "ro";
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: headRef.current, start: "top 85%" } });

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 90%" },
            delay: (i % 4) * 0.08 });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: "100px 28px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "600px", height: "1px", background: "linear-gradient(to right, transparent, rgba(212,153,26,0.3), transparent)" }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
        <div ref={headRef} style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 16px", borderRadius: "20px", background: "rgba(212,153,26,0.1)", border: "1px solid rgba(212,153,26,0.2)", marginBottom: "20px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--primary-light)", fontFamily: "Rubik,sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {isRo ? "Sfaturi pro" : "Pro tips"}
            </span>
          </div>
          <h2 className="display-text" style={{ fontSize: "clamp(28px,3.5vw,46px)", color: "var(--color-foreground)", marginBottom: "16px" }}>
            {isRo ? "Secrete de la vanzatori de top" : "Secrets from top sellers"}
          </h2>
          <p style={{ fontSize: "16px", color: "var(--color-muted-foreground)", maxWidth: "520px", margin: "0 auto" }}>
            {isRo
              ? "Sfaturi dovedite care fac diferenta intre un anunt ignorat si unul care vinde in ore."
              : "Proven tips that make the difference between an ignored listing and one that sells in hours."}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {tips.map((tip, i) => {
            const Icon = tip.icon;
            return (
              <div
                key={i}
                ref={el => { cardsRef.current[i] = el; }}
                style={{
                  padding: "28px",
                  borderRadius: "18px",
                  background: "rgba(13,13,34,0.6)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  backdropFilter: "blur(12px)",
                  transition: "border-color 0.25s, transform 0.25s",
                  cursor: "default",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = tip.border;
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: tip.bg, border: `1px solid ${tip.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={20} color={tip.color} />
                  </div>
                  <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", background: tip.bg, border: `1px solid ${tip.border}`, color: tip.color, fontFamily: "Rubik, sans-serif", fontWeight: 700 }}>
                    {isRo ? tip.stat.ro : tip.stat.en}
                  </span>
                </div>
                <h3 style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "16px", color: "var(--color-foreground)", marginBottom: "10px" }}>
                  {isRo ? tip.title.ro : tip.title.en}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--color-muted-foreground)", lineHeight: 1.7 }}>
                  {isRo ? tip.desc.ro : tip.desc.en}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}