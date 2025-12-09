import { useState } from "react";
import { LandingHero } from "../components/LandingHero";
import { Features } from "../components/Features";
import { Benefits } from "../components/Benefits";
import { Testimonials } from "../components/Testimonials";
import { FAQ } from "../components/FAQ";
import { Footer } from "../components/layout/Footer";
import { DemoModal } from "../components/DemoModal";

interface IndexPageProps {
  onStartAssessment: () => void;
}

export function IndexPage({ onStartAssessment }: IndexPageProps) {
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
