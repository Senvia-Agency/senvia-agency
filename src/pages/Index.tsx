
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import ModernHeroSection from "../components/modern/ModernHeroSection";
import TechStackSection from "../components/modern/TechStackSection";
import ModernServicesSection from "../components/modern/ModernServicesSection";
import InnovationSection from "../components/modern/InnovationSection";
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
      <Navbar />
      <ModernHeroSection />
      <TechStackSection />
      <ModernServicesSection />
      <InnovationSection />
      <ContactSection />
      <ModernFooter />
      <ScrollToTop />
      <ScrollAnimator />
    </div>
  );
};

export default Index;
