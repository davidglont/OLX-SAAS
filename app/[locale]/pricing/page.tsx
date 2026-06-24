import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PricingSection from "@/components/landing/PricingSection";

export default function PricingPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <Header />
      <main style={{ flex: 1 }}>
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
