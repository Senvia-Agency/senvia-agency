
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

const LandingPages = () => {
  useEffect(() => {
    document.title = "Landing Pages Inteligentes | SENVIA";
  }, []);

  return (
    <div className="min-h-screen bg-background">
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
