import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, ArrowUp, Instagram, Facebook } from 'lucide-react';

// Logo oficial do X
const XLogo = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor"
  >
    <path d="M14.258 10.152L23.176 0h-2.113l-7.747 8.813L7.133 0H0l9.352 13.328L0 23.973h2.113l8.176-9.309 6.531 9.309h7.133zm-2.895 3.293l-.949-1.328L2.875 1.56h3.246l6.086 8.523.945 1.328 7.91 11.078h-3.246zm0 0"/>
  </svg>
);

const AIFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; // Offset para compensar navbar fixa
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-700/50">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <img 
                src="/lovable-uploads/30e628f9-6630-4c7b-83e9-1171c7f1c7f7.png" 
                alt="SENVIA" 
                className="h-12 w-auto filter drop-shadow-md"
              />
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Revolucionamos negócios com inteligência artificial. Transformamos visões em realidade digital.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-slate-300">
                <Mail className="w-4 h-4 mr-3 text-cyan-400" />
                <span className="text-sm">geral@senvia.pt</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Phone className="w-4 h-4 mr-3 text-cyan-400" />
                <span className="text-sm">+351 939 135 114</span>
              </div>
              <div className="flex items-center text-slate-300">
                <MapPin className="w-4 h-4 mr-3 text-cyan-400" />
                <span className="text-sm">Portugal</span>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="mt-6">
              <h4 className="text-white font-medium text-sm mb-4">Siga-nos</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://www.instagram.com/senvia_agency/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 p-2 rounded-full transition-all duration-300 transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a 
                  href="https://www.facebook.com/senvia.agency" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 p-2 rounded-full transition-all duration-300 transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a 
                  href="https://x.com/Senvia_Agency" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 p-2 rounded-full transition-all duration-300 transform hover:scale-110"
                  aria-label="X"
                >
                  <XLogo className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Navegação</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm"
                >
                  Sobre
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('ai-offers')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm"
                >
                  Serviços
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('transform')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm"
                >
                  Benefícios
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm"
                >
                  FAQ
                </button>
              </li>
              <li>
                <a 
                  href="mailto:geral@senvia.pt"
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Começar Agora</h3>
            <p className="text-slate-300 mb-8 text-sm leading-relaxed">
              Transforme o seu negócio com IA personalizada. Agende uma consultoria.
            </p>
            <Button 
              onClick={() => scrollToSection('pricing')}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-3xl font-bold text-lg shadow-2xl transition-all duration-300 transform hover:scale-105 border-0"
            >
              Agendar Consultoria
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700/50 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm mb-4 md:mb-0">
            © 2025 SENVIA. Todos os direitos reservados.
          </p>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 text-sm">
              Política de Privacidade
            </a>
            <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 text-sm">
              Termos de Serviço
            </a>
            <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 text-sm">
              Livro de Reclamações
            </a>
            <button 
              onClick={scrollToTop}
              className="bg-slate-700/50 hover:bg-slate-700 text-white p-2 rounded-full transition-all duration-300 transform hover:scale-110"
              aria-label="Voltar ao topo"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AIFooter;