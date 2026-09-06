import type { ReactNode } from "react";

import { AppDownloadBanner } from "@/components/landing/AppDownloadBanner";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { ContactUs } from "@/components/landing/ContactUs";
import { HeritageSpotlight } from "@/components/landing/HeritageSpotlight";
import { Hero } from "@/components/landing/Hero";
import { HomeCampaign } from "@/components/landing/HomeCampaign";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { MapExplorerPreview } from "@/components/landing/MapExplorerPreview";
import { PersonaExplorer } from "@/components/landing/PersonaExplorer";
import { ProviderCTA } from "@/components/landing/ProviderCTA";
import { SearchSection } from "@/components/landing/SearchSection";
import { Testimonials } from "@/components/landing/Testimonials";
import { TrustBar } from "@/components/landing/TrustBar";

export default function HomePage(): ReactNode {
  return (
    <>
      <Hero />
      <SearchSection />
      <PersonaExplorer />
      <TrustBar />
      <HomeCampaign />
      <BentoGrid />
      <MapExplorerPreview />
      <HeritageSpotlight />
      <HowItWorks />
      <AppDownloadBanner />
      <ProviderCTA />
      <Testimonials />
      <ContactUs />
    </>
  );
}
