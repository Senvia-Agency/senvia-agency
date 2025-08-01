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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Soluções inteligentes
            <span className="block text-[#00C3FF]">
              sob medida para a sua empresa
            </span>
          </h2>
        </div>

        {/* Pricing Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-gray-600/30 backdrop-blur-sm hover:bg-gray-700/20 transition-all duration-300 transform hover:scale-105 group relative overflow-hidden" style={{ backgroundColor: '#1A1F28' }}>
            <CardContent className="p-12 text-center">
              {/* Pricing Info */}
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">
                  IA para Atendimento ou Automação de Fluxos
                </h3>
                <div className="mb-4">
                  <div className="text-5xl font-bold text-[#00C3FF] mb-1">
                    desde 800€
                  </div>
                  <p className="text-lg text-slate-300 mb-3">
                    taxa de desenvolvimento da IA
                  </p>
                  <div className="text-2xl font-semibold text-slate-300">
                    + 200€/mês
                  </div>
                  <p className="text-sm text-slate-400">
                    manutenção, actualização e melhoria
                  </p>
                </div>
                
                {/* Features List */}
                <ul className="space-y-4 mb-8 max-w-md mx-auto">
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-[#00C3FF] mr-3 flex-shrink-0" />
                    <span className="text-base">Personalizado para a sua empresa</span>
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-[#00C3FF] mr-3 flex-shrink-0" />
                    <span className="text-base">Integrado aos seus sistemas internos</span>
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-[#00C3FF] mr-3 flex-shrink-0" />
                    <span className="text-base">Treinamento de IA avançado</span>
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-[#00C3FF] mr-3 flex-shrink-0" />
                    <span className="text-base">Aprendizado contínuo e melhoria</span>
                  </li>
                </ul>
              </div>
              
              {/* CTA Button */}
              <Button 
                onClick={() => setIsModalOpen(true)}
                size="lg" 
                className="px-8 py-4 text-xl font-semibold rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 text-white" 
                style={{ backgroundColor: '#00C3FF' }}
              >
                Agendar Consultoria
                <ArrowRight className="ml-2 w-6 h-6" />
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