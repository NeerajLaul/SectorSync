import { useState } from "react";
import { LandingHero } from "./LandingHero";
import { Features } from "./Features";
import { Benefits } from "./Benefits";
import { Testimonials } from "./Testimonials";
import { Pricing } from "./Pricing";
import { FAQ } from "./FAQ";
import { Footer } from "./Footer";
import { DemoModal } from "./DemoModal";

interface LandingPageProps {
  onStartAssessment: () => void;
}

export function LandingPage({ onStartAssessment }: LandingPageProps) {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const handleWatchDemo = () => {
    setIsDemoOpen(true);
  };

  const handleStartFromDemo = () => {
    setIsDemoOpen(false);
    onStartAssessment();
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        <LandingHero 
          onStartAssessment={onStartAssessment}
          onWatchDemo={handleWatchDemo}
        />
        <Features />
        <Benefits />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
      
      <DemoModal 
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onStartAssessment={handleStartFromDemo}
      />
    </div>
  );
}
