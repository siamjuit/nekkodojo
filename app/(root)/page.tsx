"use client";

import LandingPage from "@/components/Landing Page/LandingPage";
import TrainingGrounds from "@/components/Landing Page/TrainingGrounds";
import SanctuaryMetrics from "@/components/Landing Page/SanctuaryMetrics";
import Footer from "@/components/Landing Page/Footer";
import dynamic from "next/dynamic";

const AboutHero = dynamic(() => import("@/components/Landing Page/Hero"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#0f0b0a]" />,
});

export default function Home() {
  return (
    <>
      <div className="relative min-h-screen w-full overflow-x-clip font-sans bg-[#0f0b0a] text-[#eaddcf]">
        <LandingPage />
        <AboutHero />
        <TrainingGrounds />
        <SanctuaryMetrics />
        <Footer />
      </div>
    </>
  );
}
