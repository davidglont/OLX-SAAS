"use client";

import { useSession, signOut } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Zap, Menu, X, ChevronDown, LogOut, LayoutDashboard, User } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const otherLocale = locale === "ro" ? "en" : "ro";
  const switchedPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/tool`, label: t("tool") },
    { href: `/${locale}/pricing`, label: t("pricing") },
  ];

  return (
    <header
      style={{
        background: "rgba(250, 245, 255, 0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href={`/${locale}`} style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={18} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, fontSize: "18px", color: "var(--color-foreground)" }}>
            Anunț<span style={{ color: "var(--color-primary)" }}>AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "8px" }} className="hidden-mobile">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 500,
                color: pathname === link.href ? "var(--color-primary)" : "var(--color-muted-foreground)",
                background: pathname === link.href ? "rgba(124, 58, 237, 0.08)" : "transparent",
                transition: "all 0.15s",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Language switcher */}
          <button
            onClick={() => router.push(switchedPath)}
            style={{
              padding: "4px 10px",
              borderRadius: "8px",
              border: "1.5px solid var(--color-border)",
              background: "white",
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "Rubik, sans-serif",
              color: "var(--color-muted-foreground)",
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
          >
            {otherLocale.toUpperCase()}
          </button>

          {session ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 12px",
                  borderRadius: "10px",
                  border: "1.5px solid var(--color-border)",
                  background: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--color-foreground)",
                }}
              >
                {session.user?.image ? (
                  <img src={session.user.image} alt="" width={24} height={24} style={{ borderRadius: "50%" }} />
                ) : (
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "white", fontSize: "11px", fontWeight: 700 }}>
                      {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                    </span>
                  </div>
                )}
                <ChevronDown size={14} />
              </button>

              {userMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    background: "white",
                    border: "1px solid var(--color-border)",
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px rgba(124,58,237,0.12)",
                    minWidth: "180px",
                    overflow: "hidden",
                    zIndex: 100,
                  }}
                >
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--color-border)" }}>
                    <div style={{ fontSize: "13px", fontWeight: 600 }}>{session.user?.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--color-muted-foreground)" }}>{session.user?.email}</div>
                  </div>
                  {[
                    { href: `/${locale}/dashboard`, label: t("dashboard"), icon: <LayoutDashboard size={14} /> },
                    { href: `/${locale}/account`, label: t("account"), icon: <User size={14} /> },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setUserMenuOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", fontSize: "14px", color: "var(--color-foreground)", textDecoration: "none", transition: "background 0.1s" }}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => { signOut({ callbackUrl: `/${locale}` }); setUserMenuOpen(false); }}
                    style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", fontSize: "14px", color: "var(--color-destructive)", background: "none", border: "none", cursor: "pointer", width: "100%", borderTop: "1px solid var(--color-border)" }}
                  >
                    <LogOut size={14} />
                    {t("logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <Link href={`/${locale}/auth/login`} style={{ padding: "8px 16px", borderRadius: "10px", fontSize: "14px", fontWeight: 500, color: "var(--color-primary)", textDecoration: "none" }}>
                {t("login")}
              </Link>
              <Link
                href={`/${locale}/auth/signup`}
                className="btn-primary"
                style={{ padding: "8px 18px", fontSize: "14px" }}
              >
                {t("signup")}
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "none", background: "none", border: "none", color: "var(--color-foreground)", padding: "4px" }}
            className="show-mobile"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div style={{ borderTop: "1px solid var(--color-border)", background: "white", padding: "12px 24px 16px" }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{ display: "block", padding: "10px 0", fontSize: "15px", fontWeight: 500, color: pathname === link.href ? "var(--color-primary)" : "var(--color-foreground)", textDecoration: "none", borderBottom: "1px solid var(--color-border)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>
    </header>
  );
}
