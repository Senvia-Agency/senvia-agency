import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

const AIFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
                <span className="text-sm">contacto@senvia.pt</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Phone className="w-4 h-4 mr-3 text-cyan-400" />
                <span className="text-sm">+351 XXX XXX XXX</span>
              </div>
              <div className="flex items-center text-slate-300">
                <MapPin className="w-4 h-4 mr-3 text-cyan-400" />
                <span className="text-sm">Lisboa, Portugal</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Soluções de IA</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => scrollToSection('ai-offers')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm"
                >
                  IA para Atendimento 24/7
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('ai-offers')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm"
                >
                  Automações de Vendas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('ai-offers')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm"
                >
                  Previsões de Mercado
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('ai-offers')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm"
                >
                  CRM Inteligente
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Navegação</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => scrollToSection('benefits')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm"
                >
                  Benefícios
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('testimonials')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm"
                >
                  Testemunhos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm"
                >
                  Perguntas Frequentes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 text-sm"
                >
                  Sobre Nós
                </button>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Começar Agora</h3>
            <p className="text-slate-300 mb-6 text-sm leading-relaxed">
              Pronto para revolucionar o seu negócio? Fale connosco hoje mesmo.
            </p>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 border-0 mb-4"
            >
              Solicitar Consultoria
            </Button>
            <p className="text-slate-400 text-xs">
              Resposta garantida em 2 horas
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700/50 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm mb-4 md:mb-0">
            © 2024 SENVIA. Todos os direitos reservados.
          </p>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 text-sm">
              Política de Privacidade
            </a>
            <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 text-sm">
              Termos de Serviço
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