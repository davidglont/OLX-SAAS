import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import BeforeAfter from "@/components/landing/BeforeAfter";
import SocialProof from "@/components/landing/SocialProof";
import PricingSection from "@/components/landing/PricingSection";

export default function LandingPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Hero />
        <HowItWorks />
        <BeforeAfter />
        <SocialProof />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
