
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import BenefitsSection from "../components/landing/BenefitsSection";
import BeforeAfterSection from "../components/landing/BeforeAfterSection";
import CTASection from "../components/landing/CTASection";
import ProcessSection from "../components/landing/ProcessSection";
import FAQSection from "../components/landing/FAQSection";
import ContactFormSection from "../components/landing/ContactFormSection";
import MetaPixel from "../components/MetaPixel";

const LandingPages = () => {
  useEffect(() => {
    // Set page title
    document.title = "Landing Pages Inteligentes | SENVIA - Criação de Páginas Profissionais";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Criamos landing pages inteligentes e profissionais que convertem visitantes em clientes. Estrutura completa com formulários, CRM e automação para o seu negócio.');
    }
    
    // Update Open Graph meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Landing Pages Inteligentes | SENVIA - Criação de Páginas Profissionais');
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Criamos landing pages inteligentes e profissionais que convertem visitantes em clientes. Estrutura completa com formulários, CRM e automação para o seu negócio.');
    }
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', 'https://www.senvia.pt/landing-pages');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <MetaPixel />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <BeforeAfterSection />
      <CTASection />
      <ProcessSection />
      <FAQSection />
      <ContactFormSection />
      <Footer />
    </div>
  );
};

export default LandingPages;
