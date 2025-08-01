import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Zap, ArrowRight, CheckCircle, MessageCircle, Settings, Users, Workflow } from 'lucide-react';
import AIModal from './AIModal';

const AIOffersSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const offers = [
    {
      icon: Bot,
      title: "IA para Atendimento 24/7",
      description: "Automação inteligente para atendimento, suporte, vendas, agendamento e muito mais! Reduzindo custos e aumentando a eficiência, nossos agentes de IA interagem com clientes, captam leads e integram-se aos seus sistemas internos para otimizar cada contato.",
      features: ["WhatsApp Business integrado", "Qualificação automática de leads", "Atendimento multicanal", "Integração com sistemas internos"],
      decorativeIcons: [MessageCircle, Users, Bot]
    },
    {
      icon: Zap,
      title: "Automação de Fluxos",
      description: "Elimine tarefas manuais e ganhe agilidade operacional. Integramos seus sistemas, como CRM e ERP, garantindo processos fluidos, precisos e totalmente automatizados, permitindo que sua equipa foque no que realmente importa.",
      features: ["Integração CRM e ERP", "Processos automatizados", "Redução de tarefas manuais", "Otimização operacional"],
      decorativeIcons: [Workflow, Settings, Zap]
    }
  ];

  return (
    <section id="ai-offers" className="py-20" style={{ backgroundColor: '#11161F' }}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Soluções de IA que
            <span className="block text-[#00C3FF]">
              Revolucionam Negócios
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Transforme sua empresa com inteligência artificial que trabalha 24/7 para gerar mais vendas e otimizar processos
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {offers.map((offer, index) => {
            const IconComponent = offer.icon;
            return (
              <Card key={index} className="border-gray-600/30 backdrop-blur-sm hover:bg-gray-700/20 transition-all duration-500 transform hover:scale-[1.02] group relative overflow-hidden" style={{ backgroundColor: '#1A1F28' }}>
                <CardContent className="p-12 relative">
                  {/* Decorative Background Elements */}
                  <div className="absolute top-4 right-4 opacity-10">
                    {offer.decorativeIcons.map((DecorIcon, idx) => (
                      <DecorIcon 
                        key={idx} 
                        className="w-8 h-8 text-[#00C3FF] absolute" 
                        style={{ 
                          top: `${idx * 15}px`, 
                          right: `${idx * 12}px`,
                          transform: `rotate(${idx * 15}deg)`
                        }} 
                      />
                    ))}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-3xl font-bold text-white mb-6 leading-tight">
                    {offer.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-slate-300 mb-8 leading-relaxed text-lg">
                    {offer.description}
                  </p>
                  
                  {/* Features */}
                  <ul className="space-y-4">
                    {offer.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-slate-300">
                        <CheckCircle className="w-5 h-5 text-[#00C3FF] mr-3 flex-shrink-0" />
                        <span className="text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Glow Effect */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00C3FF] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Button 
            onClick={() => setIsModalOpen(true)}
            size="lg" 
            className="px-8 py-4 text-xl font-semibold rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 text-white" 
            style={{ backgroundColor: '#00C3FF' }}
          >
            Agendar Consultoria
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </div>
      </div>
      
      {/* AI Modal */}
      <AIModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  );
};

export default AIOffersSection;