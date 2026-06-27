"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ro">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#0a0a0f", color: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center", padding: "40px 24px" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>⚠</div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}>Ceva a mers prost</h1>
          <p style={{ color: "#94a3b8", marginBottom: "32px" }}>A apărut o eroare neașteptată. Echipa a fost notificată.</p>
          <button
            onClick={reset}
            style={{ background: "linear-gradient(135deg, #d4991a 0%, #a86f0e 100%)", color: "white", border: "none", padding: "12px 28px", borderRadius: "10px", fontWeight: 600, cursor: "pointer", fontSize: "15px" }}
          >
            Încearcă din nou
          </button>
        </div>
      </body>
    </html>
  );
}
