import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SmartFlowHeroSection from "../components/smartflow/SmartFlowHeroSection";
import SmartFlowDeliverablesSection from "../components/smartflow/SmartFlowDeliverablesSection";
import SmartFlowTimelineSection from "../components/smartflow/SmartFlowTimelineSection";
import SmartFlowDemoSection from "../components/smartflow/SmartFlowDemoSection";
import SmartFlowCaseStudySection from "../components/smartflow/SmartFlowCaseStudySection";
import SmartFlowPricingSection from "../components/smartflow/SmartFlowPricingSection";
import SmartFlowGuaranteeSection from "../components/smartflow/SmartFlowGuaranteeSection";
import SmartFlowCTASection from "../components/smartflow/SmartFlowCTASection";
import MetaPixel from "../components/MetaPixel";

const PacGrowth = () => {
  useEffect(() => {
    // Set page title
    document.title = "Site + n8n SmartFlow | SENVIA - Infraestrutura de Aquisição em 15 Dias";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Site ultrarrápido + automação n8n que responde leads em 60 segundos. Garantia de ≥20% mais oportunidades ou otimizamos grátis.');
    }
    
    // Update Open Graph meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Site + n8n SmartFlow | SENVIA - Infraestrutura de Aquisição em 15 Dias');
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Site ultrarrápido + automação n8n que responde leads em 60 segundos. Garantia de ≥20% mais oportunidades ou otimizamos grátis.');
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
      <SmartFlowHeroSection />
      <SmartFlowDeliverablesSection />
      <SmartFlowTimelineSection />
      <SmartFlowDemoSection />
      <SmartFlowCaseStudySection />
      <SmartFlowPricingSection />
      <SmartFlowGuaranteeSection />
      <SmartFlowCTASection />
      <Footer />
    </div>
  );
};

export default PacGrowth;