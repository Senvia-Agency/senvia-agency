import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle } from 'lucide-react';
import AIModal from './AIModal';

const AIOffersSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const offers = [
    {
      title: "IA para Atendimento 24/7",
      description: "Automação inteligente para atendimento, suporte, vendas, agendamento e muito mais! Reduzindo custos e aumentando a eficiência, nossos agentes de IA interagem com clientes, captam leads e integram-se aos seus sistemas internos para otimizar cada contato.",
      features: ["WhatsApp Business integrado", "Qualificação automática de leads", "Atendimento multicanal", "Integração com sistemas internos"]
    },
    {
      title: "Automação de Fluxos",
      description: "Elimine tarefas manuais e ganhe agilidade operacional. Integramos seus sistemas, como CRM e ERP, garantindo processos fluidos, precisos e totalmente automatizados, permitindo que sua equipa foque no que realmente importa.",
      features: ["Integração CRM e ERP", "Processos automatizados", "Redução de tarefas manuais", "Otimização operacional"]
    }
  ];

  return (
    <section id="ai-offers" className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor: '#11161F' }}>
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Soluções de IA que
            <span className="block text-[#00C3FF] mt-1 sm:mt-2">
              Revolucionam Negócios
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Transforme sua empresa com inteligência artificial que trabalha 24/7 para gerar mais vendas e otimizar processos
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12 lg:mb-16">
          {offers.map((offer, index) => (
            <div 
              key={index}
              className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-600/30 hover:border-[#00C3FF]/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#00C3FF]/20"
            >
              {/* Title */}
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 leading-tight">
                {offer.title}
              </h3>
              
              {/* Description */}
              <p className="text-sm sm:text-base text-slate-300 mb-4 sm:mb-6 leading-relaxed">
                {offer.description}
              </p>
              
              {/* Features */}
              <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {offer.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-slate-300">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#00C3FF] mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center px-2">
          <Button 
            onClick={() => setIsModalOpen(true)}
            size="lg" 
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg lg:text-xl font-semibold rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 text-white" 
            style={{ backgroundColor: '#00C3FF' }}
          >
            Agendar Consultoria
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </Button>
        </div>
      </div>
      
      {/* AI Modal */}
      <AIModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  );
};

export default AIOffersSection;