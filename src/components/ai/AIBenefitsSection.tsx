import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, MessageSquare, BarChart3, Zap, Shield } from 'lucide-react';

const AIBenefitsSection = () => {
  const benefits = [
    {
      icon: Users,
      title: "Escalabilidade sem Equipa Extra",
      description: "Atenda milhares de clientes simultaneamente sem contratar mais funcionários",
      color: "text-cyan-400"
    },
    {
      icon: MessageSquare,
      title: "Integrações com WhatsApp e E-mail",
      description: "Conecte-se com seus clientes onde eles estão, de forma automática e inteligente",
      color: "text-green-400"
    },
    {
      icon: BarChart3,
      title: "Relatórios em Tempo Real",
      description: "Dashboards inteligentes com métricas que importam para o seu negócio",
      color: "text-blue-400"
    },
    {
      icon: Zap,
      title: "Resposta Instantânea 24/7",
      description: "Nunca perca um lead novamente, mesmo fora do horário comercial",
      color: "text-yellow-400"
    },
    {
      icon: Shield,
      title: "Segurança e Confiabilidade",
      description: "Dados protegidos com criptografia de nível empresarial e backup automático",
      color: "text-purple-400"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Porquê Escolher
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              a Nossa IA?
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Vantagens que fazem a diferença no seu negócio
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300 transform hover:scale-105 group">
                <CardContent className="p-8 text-center">
                  {/* Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center group-hover:bg-slate-700/70 transition-colors duration-300">
                      <IconComponent className={`w-8 h-8 ${benefit.color}`} />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-4">
                    {benefit.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-slate-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid md:grid-cols-4 gap-8 text-center">
          <div className="group">
            <div className="text-4xl font-bold text-cyan-400 mb-2 group-hover:scale-110 transition-transform duration-300">
              98%
            </div>
            <p className="text-slate-300">Taxa de Disponibilidade</p>
          </div>
          <div className="group">
            <div className="text-4xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-300">
              &lt;3s
            </div>
            <p className="text-slate-300">Tempo de Resposta</p>
          </div>
          <div className="group">
            <div className="text-4xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-300">
              250+
            </div>
            <p className="text-slate-300">Empresas Transformadas</p>
          </div>
          <div className="group">
            <div className="text-4xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform duration-300">
              500%
            </div>
            <p className="text-slate-300">ROI Médio</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIBenefitsSection;