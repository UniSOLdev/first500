import { MarketingNav } from "@/components/layout/marketing-nav";
import { Footer } from "@/components/layout/footer";
import { MobileCta } from "@/components/layout/mobile-cta";
import { HeroSection } from "@/components/landing/hero-section";
import { TrustPoints } from "@/components/landing/trust-points";
import { PainSection } from "@/components/landing/pain-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { WhatYouGet } from "@/components/landing/what-you-get";
import { WhoThisIsFor } from "@/components/landing/who-this-is-for";
import { ValuePricing } from "@/components/landing/value-pricing";
import { FounderSection } from "@/components/landing/founder-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCta } from "@/components/landing/final-cta";
import { LandingAnalytics } from "@/components/landing/landing-analytics";

export default function LandingPage() {
  return (
    <>
      <LandingAnalytics />
      <MarketingNav />
      <main className="pb-24 md:pb-0">
        <HeroSection />
        <TrustPoints />
        <PainSection />
        <HowItWorks />
        <WhatYouGet />
        <WhoThisIsFor />
        <FounderSection />
        <ValuePricing />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
