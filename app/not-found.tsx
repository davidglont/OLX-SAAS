import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="ro">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#0a0a0f", color: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center", padding: "40px 24px" }}>
          <div style={{ fontSize: "80px", fontWeight: 800, background: "linear-gradient(135deg, #d4991a 0%, #a86f0e 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>
            404
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, margin: "16px 0 8px" }}>Pagina nu a fost găsită</h1>
          <p style={{ color: "#94a3b8", marginBottom: "32px" }}>Linkul accesat nu există sau a fost mutat.</p>
          <Link href="/ro" style={{ background: "linear-gradient(135deg, #d4991a 0%, #a86f0e 100%)", color: "white", textDecoration: "none", padding: "12px 28px", borderRadius: "10px", fontWeight: 600 }}>
            Înapoi acasă
          </Link>
        </div>
      </body>
    </html>
  );
}
