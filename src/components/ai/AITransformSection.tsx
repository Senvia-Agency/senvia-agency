import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingDown, Clock, Zap, Timer } from 'lucide-react';

const AITransformSection = () => {
  const benefits = [
    {
      icon: TrendingDown,
      title: "Redução de custos em até 40%",
      description: "Automatize tarefas repetitivas, reduza a necessidade de equipa operacional e direccione os seus recursos para áreas estratégicas.",
      color: "text-green-400"
    },
    {
      icon: Clock,
      title: "Produtividade 24/7",
      description: "Os seus processos continuam a funcionar mesmo fora do horário comercial. Os nossos agentes de IA garantem operação contínua e respostas instantâneas.",
      color: "text-blue-400"
    },
    {
      icon: Zap,
      title: "Escalabilidade Inteligente",
      description: "Soluções que crescem junto com o seu negócio, adaptando-se automaticamente ao aumento de procura sem necessidade de intervenção manual.",
      color: "text-purple-400"
    },
    {
      icon: Timer,
      title: "Resultados Imediatos",
      description: "Implementações rápidas com resultados mensuráveis em semanas, não meses, garantindo retorno sobre investimento e aumento de eficiência mais rápido.",
      color: "text-orange-400"
    }
  ];

  return (
    <section className="py-20" style={{ backgroundColor: '#11161F' }}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Transforme a sua empresa
            <span className="block text-[#00C3FF] mt-1 sm:mt-2">
              com IA de alto desempenho
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Descubra como a inteligência artificial pode revolucionar os seus processos de negócio
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card key={index} className="border-gray-600/30 backdrop-blur-sm hover:bg-gray-700/20 transition-all duration-300 transform hover:scale-105 group" style={{ backgroundColor: '#1A1F28' }}>
                <CardContent className="p-8">
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {benefit.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-slate-300 leading-relaxed text-lg">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AITransformSection;