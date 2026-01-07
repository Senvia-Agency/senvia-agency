
import { useEffect } from "react";
import Footer from "../components/Footer";
import HeroSection from "../components/landing/HeroSection";
import ProblemSection from "../components/landing/ProblemSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import ProcessSection from "../components/landing/ProcessSection";
import FAQSection from "../components/landing/FAQSection";
import ContactFormSection from "../components/landing/ContactFormSection";

const LandingPages = () => {
  useEffect(() => {
    // Set page title
    document.title = "Landing Pages Inteligentes | SENVIA - Ecossistemas de Vendas";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Implementamos Ecossistemas de Vendas que transformam tráfego pago em receita previsível. Landing Pages Inteligentes com IA, CRM e Automação de elite.');
    }
    
    // Update Open Graph meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Landing Pages Inteligentes | SENVIA - Ecossistemas de Vendas');
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Implementamos Ecossistemas de Vendas que transformam tráfego pago em receita previsível. Landing Pages Inteligentes com IA, CRM e Automação de elite.');
    }
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', 'https://www.senvia.pt/landing-pages');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <ProcessSection />
      <FAQSection />
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default LandingPages;
