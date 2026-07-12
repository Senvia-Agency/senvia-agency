import React from 'react';
import { Rocket, Target, Zap } from 'lucide-react';

const AIAboutSection = () => {
  return (
    <section className="py-20" style={{ backgroundColor: '#11161F' }}>
      <div className="container mx-auto px-6">
        {/* Centered Title */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Sobre a <span className="text-[#00C3FF]">SENVIA</span>
          </h2>
          <p className="text-lg text-[#00C3FF] mb-2 font-medium">
            Serviços Estratégicos para Negócios com Visão, Inovação e Automação
          </p>
        </div>
        
        {/* Centered Content */}
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm sm:text-base lg:text-xl text-slate-300 mb-6 sm:mb-8 leading-relaxed">
            A SENVIA é uma agência especializada em Inteligência Artificial e automações empresariais. 
            Desenvolvemos soluções personalizadas que transformam a forma como as empresas operam, vendem e se relacionam com clientes.
          </p>
          
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Com expertise em tecnologias de IA de última geração, criamos agentes inteligentes, automatizamos processos complexos 
            e integramos sistemas para maximizar a eficiência e os resultados do seu negócio.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AIAboutSection;