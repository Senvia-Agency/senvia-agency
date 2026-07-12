import { useState, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

const Navbar = memo(() => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleLogoClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  }, []);

  const handleScheduleConsultation = useCallback(() => {
    scrollToSection('contacto');
  }, [scrollToSection]);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-gradient-to-r from-senvia-600 to-senvia-500 rounded-full px-8 py-3 shadow-lg backdrop-blur-md">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold text-senvia-400 glow" onClick={handleLogoClick} style={{
              textShadow: '0 0 10px #00bcd4, 0 0 20px #00bcd4, 0 0 30px #00bcd4'
            }}>
              SENVIA
            </Link>
            
            <button 
              onClick={() => scrollToSection('sobre')}
              className="text-white hover:text-senvia-100 transition-colors cursor-pointer font-medium"
            >
              Sobre
            </button>
            <button 
              onClick={() => scrollToSection('servicos')}
              className="text-white hover:text-senvia-100 transition-colors cursor-pointer font-medium"
            >
              Serviços
            </button>
            <button 
              onClick={() => scrollToSection('beneficios')}
              className="text-white hover:text-senvia-100 transition-colors cursor-pointer font-medium"
            >
              Benefícios
            </button>
            <button 
              onClick={() => scrollToSection('depoimentos')}
              className="text-white hover:text-senvia-100 transition-colors cursor-pointer font-medium"
            >
              Depoimentos
            </button>
            <a
              href="/blog"
              class="text-white hover:text-senvia-100 transition-colors cursor-pointer font-medium inline-flex items-center gap-1"
            >
              Blog
            </a>
            <button 
              onClick={() => scrollToSection('contacto')}
              className="text-white hover:text-senvia-100 transition-colors cursor-pointer font-medium"
            >
              Contacto
            </button>
            
            {/* Consultation Button */}
            <Button 
              onClick={handleScheduleConsultation}
              className="bg-white text-senvia-600 hover:bg-senvia-50 font-medium px-6 py-2 rounded-full"
            >
              Agendar Consultoria
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed top-4 left-4 right-4 z-50">
        <div className="bg-gradient-to-r from-senvia-600 to-senvia-500 rounded-full px-6 py-3 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between w-full">
            {/* Logo Mobile */}
            <Link to="/" className="text-xl font-bold text-senvia-400 glow" onClick={handleLogoClick} style={{
              textShadow: '0 0 10px #00bcd4, 0 0 20px #00bcd4, 0 0 30px #00bcd4'
            }}>
              SENVIA
            </Link>
            
            {/* Menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-senvia-100 p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Mobile Menu Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2">
              <div className="bg-gradient-to-r from-senvia-600 to-senvia-500 rounded-2xl px-4 py-4 space-y-2 shadow-lg">
                <button
                  onClick={() => scrollToSection('sobre')}
                  className="block w-full text-left px-3 py-2 text-white hover:text-senvia-100 transition-colors rounded-lg hover:bg-white/10"
                >
                  Sobre
                </button>
                <button
                  onClick={() => scrollToSection('servicos')}
                  className="block w-full text-left px-3 py-2 text-white hover:text-senvia-100 transition-colors rounded-lg hover:bg-white/10"
                >
                  Serviços
                </button>
                <button
                  onClick={() => scrollToSection('beneficios')}
                  className="block w-full text-left px-3 py-2 text-white hover:text-senvia-100 transition-colors rounded-lg hover:bg-white/10"
                >
                  Benefícios
                </button>
                <button
                  onClick={() => scrollToSection('depoimentos')}
                  className="block w-full text-left px-3 py-2 text-white hover:text-senvia-100 transition-colors rounded-lg hover:bg-white/10"
                >
                  Depoimentos
                </button>
                <a
                  href="/blog"
                  class="block w-full text-left px-3 py-2 text-white hover:text-senvia-100 transition-colors rounded-lg hover:bg-white/10"
                >
                  Blog
                </a>
                <button
                  onClick={() => scrollToSection('contacto')}
                  className="block w-full text-left px-3 py-2 text-white hover:text-senvia-100 transition-colors rounded-lg hover:bg-white/10"
                >
                  Contacto
                </button>
                
                <div className="pt-2">
                  <Button 
                    onClick={handleScheduleConsultation}
                    className="w-full bg-white text-senvia-600 hover:bg-senvia-50 font-medium rounded-lg"
                  >
                    Agendar Consultoria
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;