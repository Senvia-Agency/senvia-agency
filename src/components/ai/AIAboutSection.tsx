import React from 'react';
import { Rocket, Target, Zap } from 'lucide-react';

const AIAboutSection = () => {
  return (
    <section className="py-20" style={{ backgroundColor: '#11161F' }}>
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Sobre a
              <span className="block text-[#00C3FF]">
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
                <div className="w-12 h-12 rounded-full bg-[#00C3FF] flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Inovação Constante</h3>
                  <p className="text-slate-400 text-sm">Sempre à frente das tendências tecnológicas</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#00C3FF] flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Foco em Resultados</h3>
                  <p className="text-slate-400 text-sm">ROI mensurável em cada implementação</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#00C3FF] flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Entrega Rápida</h3>
                  <p className="text-slate-400 text-sm">Soluções eficientes do conceito à produção</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Side */}
          <div className="relative">
            {/* Main Card */}
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-600/30 backdrop-blur-sm">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00C3FF] mb-2">100+</div>
                  <p className="text-slate-300 text-sm">Projectos Concluídos</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00C3FF] mb-2">98%</div>
                  <p className="text-slate-300 text-sm">Clientes Satisfeitos</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00C3FF] mb-2">24/7</div>
                  <p className="text-slate-300 text-sm">Suporte Disponível</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00C3FF] mb-2">ROI</div>
                  <p className="text-slate-300 text-sm">Garantido</p>
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
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#00C3FF] rounded-full opacity-20 blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#00C3FF] rounded-full opacity-10 blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAboutSection;