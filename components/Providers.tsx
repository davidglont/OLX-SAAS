"use client";

import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";

const SmoothScroll = dynamic(() => import("@/components/effects/SmoothScroll"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/effects/CustomCursor"), { ssr: false });
const CookieBanner = dynamic(() => import("@/components/effects/CookieBanner"), { ssr: false });

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SmoothScroll />
      <CustomCursor />
      <CookieBanner />
      {children}
    </SessionProvider>
  );
}
