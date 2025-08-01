
import { useEffect } from "react";
import AINavbar from '@/components/ai/AINavbar';
import AIHeroSection from '@/components/ai/AIHeroSection';
import AIOffersSection from '@/components/ai/AIOffersSection';
import AIProcessSection from '@/components/ai/AIProcessSection';
import AITransformSection from '@/components/ai/AITransformSection';
import AIPricingSection from '@/components/ai/AIPricingSection';

import AIFAQSection from '@/components/ai/AIFAQSection';
import AIAboutSection from '@/components/ai/AIAboutSection';

import AIFooter from '@/components/ai/AIFooter';
import ScrollToTop from "../components/ScrollToTop";
import ScrollAnimator from "../components/ScrollAnimator";

const Index = () => {
  useEffect(() => {
    // Update document title
    document.title = "SENVIA Agency | Inteligência Artificial para Negócios";
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#11161F' }}>
      <AINavbar />
      <AIHeroSection />
      <div id="about">
        <AIAboutSection />
      </div>
      <div id="ai-offers">
        <AIOffersSection />
      </div>
      <div id="process">
        <AIProcessSection />
      </div>
      <div id="transform">
        <AITransformSection />
      </div>
      <div id="pricing">
        <AIPricingSection />
      </div>
      <div id="faq">
        <AIFAQSection />
      </div>
      <AIFooter />
      <ScrollToTop />
      <ScrollAnimator />
    </div>
  );
};

export default Index;
