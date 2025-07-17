import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductsHero from "../components/produtos/ProductsHero";
import AutomationShowcase from "../components/produtos/AutomationShowcase";
import TechnologySection from "../components/produtos/TechnologySection";
import ValueProposition from "../components/produtos/ValueProposition";
import PricingSection from "../components/produtos/PricingSection";
import CTASection from "../components/produtos/CTASection";
import MetaPixel from "../components/MetaPixel";

const Produtos = () => {
  useEffect(() => {
    document.title = "Produtos SENVIA - Automação Inteligente para Seu Negócio";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Descubra os produtos SENVIA: soluções completas de automação, CRM e captação de leads. Tecnologia inovadora que revoluciona seu negócio digital.');
    }
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Produtos SENVIA - Automação Inteligente para Seu Negócio');
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Descubra os produtos SENVIA: soluções completas de automação, CRM e captação de leads. Tecnologia inovadora que revoluciona seu negócio digital.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <MetaPixel />
      <Navbar />
      <ProductsHero />
      <AutomationShowcase />
      <TechnologySection />
      <ValueProposition />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Produtos;