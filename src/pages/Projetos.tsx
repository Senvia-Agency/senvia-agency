
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PortfolioSection from "../components/PortfolioSection";


const Projetos = () => {
  return (
    <div className="min-h-screen">
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-background via-background to-senvia-500/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Nossos Projetos</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Explore o nosso portfólio e descubra como transformamos ideias em experiências digitais de sucesso. 
              Cada projeto é uma história de inovação e resultados excepcionais.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <PortfolioSection />

      <Footer />
    </div>
  );
};

export default Projetos;
