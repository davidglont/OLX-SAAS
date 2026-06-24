import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AnunțAI — Vinde mai repede pe OLX și Vinted",
  description:
    "Generează titluri, descrieri și taguri optimizate pentru anunțurile tale cu ajutorul AI. OLX, Vinted, rapid și simplu.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
