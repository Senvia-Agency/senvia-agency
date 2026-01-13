import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
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
    // Update document title (fallback)
    document.title = "SENVIA Agency | Inteligência Artificial para Negócios";
  }, []);

  return (
    <>
      <Helmet>
        <title>SENVIA Agency | Inteligência Artificial para Negócios</title>
        <meta name="description" content="Automatize o seu negócio com Agentes de IA. A SENVIA desenvolve soluções de inteligência artificial para atendimento, vendas e operações em Portugal." />
        <link rel="canonical" href="https://www.senvia.pt/" />
        <meta property="og:title" content="SENVIA Agency | Inteligência Artificial para Negócios" />
        <meta property="og:description" content="Automatize o seu negócio com Agentes de IA. A SENVIA desenvolve soluções de inteligência artificial para atendimento, vendas e operações." />
        <meta property="og:url" content="https://www.senvia.pt/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SENVIA Agency | Inteligência Artificial para Negócios" />
        <meta name="twitter:description" content="Automatize o seu negócio com Agentes de IA. Soluções de inteligência artificial para empresas em Portugal." />
      </Helmet>
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
    </>
  );
};

export default Index;
