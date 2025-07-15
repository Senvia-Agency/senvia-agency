import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PacHeroSection from "../components/pac/PacHeroSection";
import PacProofSection from "../components/pac/PacProofSection";
import PacEligibilitySection from "../components/pac/PacEligibilitySection";
import PacCaseStudySection from "../components/pac/PacCaseStudySection";
import PacROICalculator from "../components/pac/PacROICalculator";
import PacPackagesSection from "../components/pac/PacPackagesSection";
import PacProcessSection from "../components/pac/PacProcessSection";
import PacGuaranteeSection from "../components/pac/PacGuaranteeSection";
import PacCTASection from "../components/pac/PacCTASection";
import MetaPixel from "../components/MetaPixel";

const PacGrowth = () => {
  useEffect(() => {
    // Set page title
    document.title = "PAC Growth | SENVIA - Dobre Sua Taxa de Conversão em 30 Dias";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Dobre a sua taxa de conversão em 30 dias sem aumentar um euro no tráfego. Landing Page + Automação com ROI garantido ou re-trabalhamos grátis.');
    }
    
    // Update Open Graph meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'PAC Growth | SENVIA - Dobre Sua Taxa de Conversão em 30 Dias');
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Dobre a sua taxa de conversão em 30 dias sem aumentar um euro no tráfego. Landing Page + Automação com ROI garantido ou re-trabalhamos grátis.');
    }
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', 'https://www.senvia.pt/pac-growth');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <MetaPixel />
      <Navbar />
      <PacHeroSection />
      <PacProofSection />
      <PacEligibilitySection />
      <PacCaseStudySection />
      <PacROICalculator />
      <PacPackagesSection />
      <PacProcessSection />
      <PacGuaranteeSection />
      <PacCTASection />
      <Footer />
    </div>
  );
};

export default PacGrowth;