import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Providers from "@/components/Providers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isRo = locale === "ro";

  const title = isRo
    ? "AnunțAI — Vinde de 3× mai repede pe OLX și Vinted"
    : "AnunțAI — Sell 3× faster on OLX and Vinted";

  const description = isRo
    ? "Încarci pozele, AI-ul face magia — titlu, descriere și taguri optimizate în 10 secunde. Anunțurile tale vor ieși în evidență."
    : "Upload your photos, AI does the magic — optimized title, description and tags in 10 seconds. Your listings will stand out.";

  return {
    title,
    description,
    keywords: isRo
      ? ["OLX", "Vinted", "AI", "anunțuri", "vânzare online", "optimizare", "AnunțAI"]
      : ["OLX", "Vinted", "AI", "listings", "marketplace", "optimize", "AnuntAI"],
    authors: [{ name: "AnunțAI" }],
    openGraph: {
      title,
      description,
      type: "website",
      locale: isRo ? "ro_RO" : "en_US",
      siteName: "AnunțAI",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();

  const isRo = locale === "ro";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AnunțAI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `https://anuntai.ro/${locale}`,
    description: isRo
      ? "Optimizează-ți anunțurile pe OLX și Vinted cu AI. Titlu, descriere și taguri perfecte în 10 secunde."
      : "Optimize your OLX and Vinted listings with AI. Perfect title, description and tags in 10 seconds.",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: "0",
      highPrice: "30",
      offerCount: "4",
    },
    inLanguage: isRo ? "ro" : "en",
    publisher: {
      "@type": "Organization",
      name: "AnunțAI",
      url: "https://anuntai.ro",
    },
  };

  return (
    <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
