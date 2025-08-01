import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rocket, Target, Zap } from 'lucide-react';

const AIAboutSection = () => {
  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Sobre a
              <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                SENVIA
              </span>
            </h2>
            
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Na SENVIA, unimos a potência da inteligência artificial com automações personalizadas. 
              O nosso objectivo? Fazer pequenos negócios decolarem como foguetes, sem complicações.
            </p>
            
            <p className="text-lg text-slate-400 mb-8">
              Com tecnologia de ponta e foco em resultados, somos o parceiro que precisa para o futuro. 
              Não vendemos apenas software - entregamos transformação digital completa.
            </p>

            {/* Key Points */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Inovação Constante</h3>
                  <p className="text-slate-400 text-sm">Sempre à frente das tendências tecnológicas</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Foco em Resultados</h3>
                  <p className="text-slate-400 text-sm">ROI mensurável em cada implementação</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Implementação Rápida</h3>
                  <p className="text-slate-400 text-sm">Do conceito à produção em tempo recorde</p>
                </div>
              </div>
            </div>

            <Button 
              size="lg" 
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
            >
              Conhecer a Nossa História
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Visual Side */}
          <div className="relative">
            {/* Main Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 border border-slate-600/30 backdrop-blur-sm">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">500+</div>
                  <p className="text-slate-300 text-sm">Projectos Concluídos</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">98%</div>
                  <p className="text-slate-300 text-sm">Clientes Satisfeitos</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                  <p className="text-slate-300 text-sm">Suporte Disponível</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">48h</div>
                  <p className="text-slate-300 text-sm">Implementação Média</p>
                </div>
              </div>

              {/* Mission Statement */}
              <div className="text-center bg-slate-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">A Nossa Missão</h3>
                <p className="text-slate-300 leading-relaxed">
                  Democratizar o acesso à inteligência artificial para empresas de todos os tamanhos, 
                  transformando visões em realidade digital.
                </p>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20 blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20 blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAboutSection;