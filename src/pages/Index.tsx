
import { useEffect } from "react";
import AINavbar from '@/components/ai/AINavbar';
import AIHeroSection from '@/components/ai/AIHeroSection';
import AIOffersSection from '@/components/ai/AIOffersSection';
import AIProcessSection from '@/components/ai/AIProcessSection';
import AITransformSection from '@/components/ai/AITransformSection';
import AITestimonialsSection from '@/components/ai/AITestimonialsSection';
import AIFAQSection from '@/components/ai/AIFAQSection';
import AIAboutSection from '@/components/ai/AIAboutSection';
import AIContactSection from '@/components/ai/AIContactSection';
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
      <div id="faq">
        <AIFAQSection />
      </div>
      <div id="testimonials">
        <AITestimonialsSection />
      </div>
      <AIContactSection />
      <AIFooter />
      <ScrollToTop />
      <ScrollAnimator />
    </div>
  );
};

export default Index;
