import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Zap, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

const AIOffersSection = () => {
  const offers = [
    {
      icon: Bot,
      title: "IA para Atendimento 24/7",
      description: "Chatbots inteligentes que atendem, qualificam e convertem leads automaticamente",
      result: "Aumente 30% suas conversões",
      features: ["WhatsApp Business integrado", "Qualificação automática de leads", "Transferência inteligente para humanos"],
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      icon: Zap,
      title: "Automações de Vendas com CRM",
      description: "Pipeline de vendas automatizado com follow-ups inteligentes e nurturing",
      result: "Reduza 70% do trabalho manual",
      features: ["CRM integrado", "Follow-ups automáticos", "Pipelines personalizados"],
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: TrendingUp,
      title: "Previsões de Mercado com IA",
      description: "Análise preditiva de tendências e comportamento de clientes",
      result: "Antecipe 90% das oportunidades",
      features: ["Análise preditiva", "Relatórios em tempo real", "Insights automatizados"],
      gradient: "from-purple-500 to-pink-600"
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
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {offers.map((offer, index) => {
            const IconComponent = offer.icon;
            return (
              <Card key={index} className="border-gray-600/30 backdrop-blur-sm hover:bg-gray-700/20 transition-all duration-300 transform hover:scale-105 group h-full flex flex-col" style={{ backgroundColor: '#1A1F28' }}>
                <CardContent className="p-8 flex flex-col h-full">
                  {/* Icon with gradient background */}
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#00C3FF' }}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {offer.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-slate-300 mb-4 leading-relaxed">
                    {offer.description}
                  </p>
                  
                  {/* Result Highlight */}
                  <div className="inline-block px-4 py-2 rounded-full text-white font-semibold text-sm mb-6" style={{ backgroundColor: '#00C3FF' }}>
                    {offer.result}
                  </div>
                  
                  {/* Features */}
                  <ul className="space-y-2 mb-6 flex-grow">
                    {offer.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-slate-300">
                        <CheckCircle className="w-4 h-4 text-[#00C3FF] mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* CTA Button */}
                  <Button className="w-full text-white border-0 group-hover:shadow-lg transition-all duration-300 mt-auto" style={{ backgroundColor: '#00C3FF' }}>
                    Agendar Consultoria
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Button size="lg" className="px-8 py-4 text-xl font-semibold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 text-white" style={{ backgroundColor: '#00C3FF' }}>
            Agendar Consultoria
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AIOffersSection;