import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const AINavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'backdrop-blur-md border-b border-gray-600/30' 
        : 'bg-transparent'
    }`} style={{ backgroundColor: isScrolled ? '#11161F' : 'transparent' }}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/30e628f9-6630-4c7b-83e9-1171c7f1c7f7.png" 
              alt="SENVIA" 
              className="h-10 w-auto filter drop-shadow-md"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('ai-offers')}
              className="text-slate-300 hover:text-[#00C3FF] transition-colors duration-300 font-medium"
            >
              Soluções
            </button>
            <button 
              onClick={() => scrollToSection('benefits')}
              className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 font-medium"
            >
              Benefícios
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 font-medium"
            >
              Clientes
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 font-medium"
            >
              FAQ
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 font-medium"
            >
              Sobre
            </button>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              onClick={() => scrollToSection('contact')}
              className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 border-0 text-white" style={{ backgroundColor: '#00C3FF' }}
            >
              Começar Agora
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50 py-4">
            <div className="space-y-4">
              <button 
                onClick={() => scrollToSection('ai-offers')}
                className="block w-full text-left text-slate-300 hover:text-cyan-400 transition-colors duration-300 font-medium py-2"
              >
                Soluções
              </button>
              <button 
                onClick={() => scrollToSection('benefits')}
                className="block w-full text-left text-slate-300 hover:text-cyan-400 transition-colors duration-300 font-medium py-2"
              >
                Benefícios
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="block w-full text-left text-slate-300 hover:text-cyan-400 transition-colors duration-300 font-medium py-2"
              >
                Clientes
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="block w-full text-left text-slate-300 hover:text-cyan-400 transition-colors duration-300 font-medium py-2"
              >
                FAQ
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="block w-full text-left text-slate-300 hover:text-cyan-400 transition-colors duration-300 font-medium py-2"
              >
                Sobre
              </button>
              <Button 
                onClick={() => scrollToSection('contact')}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 border-0 mt-4"
              >
                Começar Agora
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AINavbar;