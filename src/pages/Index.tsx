
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
import { renderCanvas } from "@/components/ui/hero-designali";

const Index = () => {
  useEffect(() => {
    // Update document title
    document.title = "SENVIA Agency | Marketing & Tecnologia";
    
    // Initialize canvas effect for the entire page
    renderCanvas();
  }, []);

  return (
    <div className="min-h-screen">
      <MetaPixel />
      <canvas
        className="pointer-events-none fixed inset-0 mx-auto -z-10"
        id="canvas"
      ></canvas>
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
