
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
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
    document.title = "Landing Pages Inteligentes | SENVIA";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Landing Pages Inteligentes | SENVIA - Criação de Páginas Profissionais</title>
        <meta name="description" content="Criamos landing pages inteligentes e profissionais que convertem visitantes em clientes. Estrutura completa com formulários, CRM e automação para o seu negócio." />
        <meta name="keywords" content="landing pages, páginas de captura, marketing digital, conversão, CRM, automação, SENVIA" />
        <meta property="og:title" content="Landing Pages Inteligentes | SENVIA - Criação de Páginas Profissionais" />
        <meta property="og:description" content="Criamos landing pages inteligentes e profissionais que convertem visitantes em clientes. Estrutura completa com formulários, CRM e automação para o seu negócio." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.senvia.pt/landing-pages" />
        <meta property="og:image" content="https://www.senvia.pt/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Landing Pages Inteligentes | SENVIA" />
        <meta name="twitter:description" content="Criamos landing pages inteligentes e profissionais que convertem visitantes em clientes." />
        <meta name="twitter:image" content="https://www.senvia.pt/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png" />
        <link rel="canonical" href="https://www.senvia.pt/landing-pages" />
      </Helmet>
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
