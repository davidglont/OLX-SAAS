import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import BeforeAfter from "@/components/landing/BeforeAfter";
import SocialProof from "@/components/landing/SocialProof";
import RecommendationsSection from "@/components/landing/RecommendationsSection";
import UrgencyBanner from "@/components/landing/UrgencyBanner";
import PricingSection from "@/components/landing/PricingSection";

export default function LandingPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <Header />
      <main id="main-content" style={{ flex: 1 }}>
        <Hero />
        <HowItWorks />
        <BeforeAfter />
        <SocialProof />
        <RecommendationsSection />
        <UrgencyBanner />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}