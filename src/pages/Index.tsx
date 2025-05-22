
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import ToolsCarousel from "../components/ToolsCarousel";
import PortfolioSection from "../components/PortfolioSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import ScrollAnimator from "../components/ScrollAnimator";
import MetaPixel from "../components/MetaPixel";

const Index = () => {
  useEffect(() => {
    // Update document title
    document.title = "SENVIA Agency | Marketing & Tecnologia";
  }, []);

  return (
    <div className="min-h-screen">
      <MetaPixel />
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <ToolsCarousel />
      <ContactSection />
      <Footer />
      <ScrollToTop />
      <ScrollAnimator />
    </div>
  );
};

export default Index;
