"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Menu, X, ChevronDown, LogOut, LayoutDashboard, User, Shield, DollarSign, Type, BarChart2, Wrench, Settings, Info, HelpCircle, Mail, BookOpen } from "lucide-react";
import gsap from "gsap";
import AnnouncementBar from "@/components/landing/AnnouncementBar";

export default function Header() {
  const { data: session } = useSession();
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const isLandingPage = pathname === `/${locale}`;

  const otherLocale = locale === "ro" ? "en" : "ro";
  const switchedPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const companyLinks = [
    { href: `/${locale}/about`, label: locale === "ro" ? "Despre noi" : "About", icon: Info, color: "#60A5FA" },
    { href: `/${locale}/case-studies`, label: locale === "ro" ? "Studii de caz" : "Case Studies", icon: BookOpen, color: "#34D399" },
    { href: `/${locale}/faq`, label: "FAQ", icon: HelpCircle, color: "#F59E0B" },
    { href: `/${locale}/contact`, label: "Contact", icon: Mail, color: "#EC4899" },
  ];

  const toolLinks = [
    { href: `/${locale}/tool`, label: t("tool"), icon: Zap, color: "var(--primary-light)" },
    { href: `/${locale}/tool/price`, label: t("tool_price"), icon: DollarSign, color: "#10B981" },
    { href: `/${locale}/tool/titles`, label: t("tool_titles"), icon: Type, color: "#EC4899" },
    { href: `/${locale}/tool/check`, label: t("tool_check"), icon: BarChart2, color: "#8B5CF6" },
  ];

  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(headerRef.current,
      { y: -64, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 }
    );
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isToolActive = pathname.startsWith(`/${locale}/tool`);

  return (
    <div ref={headerRef} style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 900 }}>
      {isLandingPage && <AnnouncementBar />}
      <header
        style={{
          background: scrolled ? "rgba(6,6,16,0.82)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(139,92,246,0.15)" : "1px solid transparent",
          transition: "background 0.4s, backdrop-filter 0.4s, border-color 0.4s",
        }}
      >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 28px", height: "68px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <Link href={`/${locale}`} style={{ display: "flex", alignItems: "center", gap: "9px", textDecoration: "none" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(139,92,246,0.4)" }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "18px", color: "var(--color-foreground)", letterSpacing: "-0.01em" }}>
            {"Anunț"}<span style={{ color: "var(--primary-light)" }}>AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "4px" }} className="hidden-mobile">
          {/* Home */}
          <Link
            href={`/${locale}`}
            style={{
              padding: "7px 16px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: "Rubik, sans-serif",
              color: pathname === `/${locale}` ? "var(--primary-light)" : "var(--color-muted-foreground)",
              background: pathname === `/${locale}` ? "rgba(139,92,246,0.12)" : "transparent",
              border: pathname === `/${locale}` ? "1px solid rgba(139,92,246,0.25)" : "1px solid transparent",
              textDecoration: "none",
              transition: "color 0.2s, background 0.2s",
            }}
          >
            {t("home")}
          </Link>

          {/* Tools dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "7px 14px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "Rubik, sans-serif",
                color: isToolActive ? "var(--primary-light)" : "var(--color-muted-foreground)",
                background: isToolActive ? "rgba(139,92,246,0.12)" : "transparent",
                border: isToolActive ? "1px solid rgba(139,92,246,0.25)" : "1px solid transparent",
                cursor: "pointer",
                transition: "color 0.2s, background 0.2s",
              }}
            >
              <Wrench size={14} />
              {t("tools_menu")}
              <ChevronDown size={12} style={{ transition: "transform 0.2s", transform: toolsOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
            </button>

            {toolsOpen && (
              <div onClick={() => setToolsOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 800 }} />
            )}
            {toolsOpen && (
              <div style={{ position: "absolute", left: 0, top: "calc(100% + 10px)", background: "var(--surface-2)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "14px", minWidth: "220px", overflow: "hidden", zIndex: 900, boxShadow: "0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.1)" }}>
                {toolLinks.map((tl) => {
                  const TIcon = tl.icon;
                  const active = pathname === tl.href;
                  return (
                    <Link
                      key={tl.href}
                      href={tl.href}
                      onClick={() => setToolsOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 16px", fontSize: "13px", fontWeight: 500, color: active ? "var(--color-foreground)" : "var(--color-muted-foreground)", textDecoration: "none", background: active ? "rgba(139,92,246,0.08)" : "transparent", transition: "background 0.15s", borderBottom: "1px solid rgba(139,92,246,0.07)" }}
                    >
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "7px", background: `${tl.color}15`, flexShrink: 0 }}>
                        <TIcon size={13} color={tl.color} />
                      </span>
                      {tl.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pricing */}
          <Link
            href={`/${locale}/pricing`}
            style={{
              padding: "7px 16px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: "Rubik, sans-serif",
              color: pathname === `/${locale}/pricing` ? "var(--primary-light)" : "var(--color-muted-foreground)",
              background: pathname === `/${locale}/pricing` ? "rgba(139,92,246,0.12)" : "transparent",
              border: pathname === `/${locale}/pricing` ? "1px solid rgba(139,92,246,0.25)" : "1px solid transparent",
              textDecoration: "none",
              transition: "color 0.2s, background 0.2s",
            }}
          >
            {t("pricing")}
          </Link>

          {/* Company dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setCompanyOpen(!companyOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "7px 14px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "Rubik, sans-serif",
                color: "var(--color-muted-foreground)",
                background: "transparent",
                border: "1px solid transparent",
                cursor: "pointer",
                transition: "color 0.2s, background 0.2s",
              }}
            >
              {locale === "ro" ? "Companie" : "Company"}
              <ChevronDown size={12} style={{ transition: "transform 0.2s", transform: companyOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
            </button>

            {companyOpen && (
              <div onClick={() => setCompanyOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 800 }} />
            )}
            {companyOpen && (
              <div style={{ position: "absolute", left: 0, top: "calc(100% + 10px)", background: "var(--surface-2)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "14px", minWidth: "200px", overflow: "hidden", zIndex: 900, boxShadow: "0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.1)" }}>
                {companyLinks.map((cl) => {
                  const CIcon = cl.icon;
                  return (
                    <Link
                      key={cl.href}
                      href={cl.href}
                      onClick={() => setCompanyOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 16px", fontSize: "13px", fontWeight: 500, color: "var(--color-muted-foreground)", textDecoration: "none", transition: "background 0.15s", borderBottom: "1px solid rgba(139,92,246,0.07)" }}
                    >
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "7px", background: `${cl.color}15`, flexShrink: 0 }}>
                        <CIcon size={13} color={cl.color} />
                      </span>
                      {cl.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

          {/* Locale switcher */}
          <button
            onClick={() => router.push(switchedPath)}
            style={{
              padding: "5px 11px",
              borderRadius: "8px",
              border: "1px solid rgba(139,92,246,0.25)",
              background: "rgba(139,92,246,0.06)",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "Rubik, sans-serif",
              color: "var(--color-muted-foreground)",
              cursor: "pointer",
              letterSpacing: "0.04em",
              transition: "border-color 0.2s, background 0.2s",
            }}
          >
            {otherLocale.toUpperCase()}
          </button>

          {session ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px 6px 8px", borderRadius: "10px", border: "1px solid rgba(139,92,246,0.2)", background: "rgba(13,13,34,0.6)", cursor: "pointer" }}
              >
                {session.user?.image ? (
                  <img src={session.user.image} alt="" width={26} height={26} style={{ borderRadius: "50%", border: "1.5px solid rgba(139,92,246,0.4)" }} />
                ) : (
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#8B5CF6,#6D28D9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "white", fontSize: "11px", fontWeight: 700 }}>{session.user?.name?.[0]?.toUpperCase() ?? "U"}</span>
                  </div>
                )}
                <ChevronDown size={13} color="var(--color-muted-foreground)" />
              </button>

              {userMenuOpen && (
                <div onClick={() => setUserMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 800 }} />
              )}
              {userMenuOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 10px)", background: "var(--surface-2)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "14px", minWidth: "200px", overflow: "hidden", zIndex: 900, boxShadow: "0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.1)" }}>
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(139,92,246,0.1)" }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-foreground)" }}>{session.user?.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--color-muted-foreground)", marginTop: "2px" }}>{session.user?.email}</div>
                  </div>
                  {[
                    ...(session.user.role === "admin" ? [{ href: `/${locale}/admin`, label: "Admin Panel", icon: <Shield size={14} /> }] : []),
                    { href: `/${locale}/dashboard`, label: t("dashboard"), icon: <LayoutDashboard size={14} /> },
                    { href: `/${locale}/profile`, label: t("profile_settings"), icon: <Settings size={14} /> },
                    { href: `/${locale}/account`, label: t("account"), icon: <User size={14} /> },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setUserMenuOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 16px", fontSize: "14px", color: "var(--color-foreground)", textDecoration: "none" }}
                    >
                      <span style={{ color: "var(--primary-light)" }}>{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => { signOut({ callbackUrl: `/${locale}` }); setUserMenuOpen(false); }}
                    style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 16px", fontSize: "14px", color: "#EF4444", background: "none", border: "none", cursor: "pointer", width: "100%", borderTop: "1px solid rgba(139,92,246,0.1)" }}
                  >
                    <LogOut size={14} />
                    {t("logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="header-auth-desktop" style={{ display: "flex", gap: "8px" }}>
              <Link href={`/${locale}/auth/login`} style={{ padding: "8px 16px", borderRadius: "10px", fontSize: "14px", fontWeight: 500, fontFamily: "Rubik, sans-serif", color: "var(--color-muted-foreground)", textDecoration: "none", transition: "color 0.2s" }}>
                {t("login")}
              </Link>
              <Link href={`/${locale}/auth/signup`} className="btn-primary" style={{ padding: "9px 20px", fontSize: "14px" }}>
                {t("signup")}
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "none", background: "none", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "8px", color: "var(--color-foreground)", padding: "6px", cursor: "pointer" }}
            className="show-mobile"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{ background: "rgba(9,9,26,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(139,92,246,0.15)", padding: "16px 28px 24px" }}>
          <Link href={`/${locale}`} onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "12px 0", fontSize: "16px", fontWeight: 500, fontFamily: "Rubik, sans-serif", color: pathname === `/${locale}` ? "var(--primary-light)" : "var(--color-foreground)", textDecoration: "none", borderBottom: "1px solid rgba(139,92,246,0.1)" }}>
            {t("home")}
          </Link>
          {toolLinks.map((tl) => (
            <Link key={tl.href} href={tl.href} onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "12px 0", fontSize: "15px", fontWeight: 500, fontFamily: "Rubik, sans-serif", color: pathname === tl.href ? "var(--primary-light)" : "var(--color-foreground)", textDecoration: "none", borderBottom: "1px solid rgba(139,92,246,0.1)", paddingLeft: tl.href === `/${locale}/tool` ? "0" : "16px" }}>
              {tl.label}
            </Link>
          ))}
          <Link href={`/${locale}/pricing`} onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "12px 0", fontSize: "16px", fontWeight: 500, fontFamily: "Rubik, sans-serif", color: pathname === `/${locale}/pricing` ? "var(--primary-light)" : "var(--color-foreground)", textDecoration: "none", borderBottom: "1px solid rgba(139,92,246,0.1)" }}>
            {t("pricing")}
          </Link>
          {companyLinks.map((cl) => (
            <Link key={cl.href} href={cl.href} onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "12px 0 12px 16px", fontSize: "15px", fontWeight: 500, fontFamily: "Rubik, sans-serif", color: "var(--color-muted-foreground)", textDecoration: "none", borderBottom: "1px solid rgba(139,92,246,0.1)" }}>
              {cl.label}
            </Link>
          ))}
          {session ? (
            <div style={{ borderTop: "1px solid rgba(212,153,26,0.15)", marginTop: "8px", paddingTop: "16px" }}>
              <div style={{ fontSize: "12px", color: "var(--color-muted-foreground)", marginBottom: "10px", paddingLeft: "2px" }}>
                {session.user?.email}
              </div>
              {[
                ...(session.user.role === "admin" ? [{ href: `/${locale}/admin`, label: "Admin Panel" }] : []),
                { href: `/${locale}/dashboard`, label: t("dashboard") },
                { href: `/${locale}/profile`, label: t("profile_settings") },
                { href: `/${locale}/account`, label: t("account") },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  style={{ display: "block", padding: "11px 0", fontSize: "15px", fontWeight: 500, fontFamily: "Rubik, sans-serif", color: "var(--color-foreground)", textDecoration: "none", borderBottom: "1px solid rgba(212,153,26,0.08)" }}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => { signOut({ callbackUrl: `/${locale}` }); setMenuOpen(false); }}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 0", fontSize: "15px", color: "#EF4444", background: "none", border: "none", cursor: "pointer", fontFamily: "Rubik, sans-serif", fontWeight: 500, marginTop: "4px" }}
              >
                {t("logout")}
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <Link href={`/${locale}/auth/login`} className="btn-secondary" style={{ flex: 1, justifyContent: "center", padding: "11px" }}>
                {t("login")}
              </Link>
              <Link href={`/${locale}/auth/signup`} className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: "11px" }}>
                {t("signup")}
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
      </header>
    </div>
  );
}