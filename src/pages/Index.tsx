
import { useEffect } from "react";
import UltraModernNavbar from "../components/modern/UltraModernNavbar";
import RevolutionHeroSection from "../components/modern/RevolutionHeroSection";
import ProcessRevolutionSection from "../components/modern/ProcessRevolutionSection";
import ProofSection from "../components/modern/ProofSection";
import UltraModernContactSection from "../components/modern/UltraModernContactSection";
import RevolutionFooter from "../components/modern/RevolutionFooter";
import ScrollToTop from "../components/ScrollToTop";
import ScrollAnimator from "../components/ScrollAnimator";


const Index = () => {
  useEffect(() => {
    // Update document title
    document.title = "SENVIA Agency | Marketing & Tecnologia";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <UltraModernNavbar />
      <RevolutionHeroSection />
      <ProcessRevolutionSection />
      <ProofSection />
      <UltraModernContactSection />
      <RevolutionFooter />
      <ScrollToTop />
      <ScrollAnimator />
    </div>
  );
};

export default Index;
