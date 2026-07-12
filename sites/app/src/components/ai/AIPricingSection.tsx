import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle } from 'lucide-react';
import AIModal from './AIModal';

const AIPricingSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <section className="py-20" style={{ backgroundColor: '#11161F' }}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Soluções inteligentes
            <span className="block text-[#00C3FF] mt-1 sm:mt-2">
              sob medida para a sua empresa
            </span>
          </h2>
        </div>

        {/* Pricing Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-gray-600/30 backdrop-blur-sm hover:bg-gray-700/20 transition-all duration-300 transform hover:scale-105 group relative overflow-hidden" style={{ backgroundColor: '#1A1F28' }}>
            <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
              {/* Pricing Info */}
              <div className="mb-8">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
                  IA para Atendimento ou Automação de Fluxos
                </h3>
                <div className="mb-4">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#00C3FF] mb-1">
                    desde 800€
                  </div>
                  <p className="text-sm sm:text-base lg:text-lg text-slate-300 mb-2 sm:mb-3">
                    taxa de desenvolvimento da IA
                  </p>
                  <div className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-300">
                    + 200€/mês
                  </div>
                  <p className="text-sm text-slate-400">
                    manutenção, actualização e melhoria
                  </p>
                </div>
                
                {/* Features List */}
                <ul className="space-y-2 mb-8 max-w-lg mx-auto">
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#00C3FF] mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base whitespace-nowrap">Personalizado para a sua empresa</span>
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#00C3FF] mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base whitespace-nowrap">Integrado aos seus sistemas internos</span>
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#00C3FF] mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base whitespace-nowrap">Treinamento de IA avançado</span>
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#00C3FF] mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base whitespace-nowrap">Aprendizado contínuo e melhoria</span>
                  </li>
                </ul>
              </div>
              
              {/* CTA Button */}
              <Button 
                onClick={() => setIsModalOpen(true)}
                size="lg" 
                className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-base sm:text-lg lg:text-xl font-semibold rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 text-white" 
                style={{ backgroundColor: '#00C3FF' }}
              >
                Agendar Consultoria
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </Button>
              
              {/* Glow Effect */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00C3FF] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* AI Modal */}
      <AIModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  );
};

export default AIPricingSection;