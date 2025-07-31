
import { useEffect } from "react";
import FuturisticNavbar from "../components/modern/FuturisticNavbar";
import ModernHeroSection from "../components/modern/ModernHeroSection";
import SystemsSection from "../components/modern/SystemsSection";
import ProcessSection from "../components/modern/ProcessSection";
import ResultsSection from "../components/modern/ResultsSection";
import ContactSection from "../components/modern/ContactSection";
import ModernFooter from "../components/modern/ModernFooter";
import ScrollToTop from "../components/ScrollToTop";
import ScrollAnimator from "../components/ScrollAnimator";


const Index = () => {
  useEffect(() => {
    // Update document title
    document.title = "SENVIA Agency | Marketing & Tecnologia";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <FuturisticNavbar />
      <ModernHeroSection />
      <SystemsSection />
      <ProcessSection />
      <ResultsSection />
      <ContactSection />
      <ModernFooter />
      <ScrollToTop />
      <ScrollAnimator />
    </div>
  );
};

export default Index;
