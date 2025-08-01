import React from 'react';
import { motion } from 'framer-motion';
import { Search, Code, RefreshCw, CheckCircle } from 'lucide-react';

const AIProcessSection = () => {
  const processSteps = [
    {
      number: "01",
      icon: Search,
      title: "Análise Completa",
      description: "Investigamos profundamente seus processos operacionais para descobrir oportunidades onde a IA pode revolucionar e otimizar tarefas",
      color: "from-cyan-400 to-blue-500"
    },
    {
      number: "02", 
      icon: Code,
      title: "Desenvolvimento & Implementação",
      description: "Criamos e incorporamos tecnologias de inteligência artificial diretamente em seus sistemas existentes",
      color: "from-blue-500 to-purple-500"
    },
    {
      number: "03",
      icon: RefreshCw,
      title: "Aperfeiçoamento Contínuo",
      description: "Monitoramos, ajustamos e evoluímos constantemente suas soluções de IA para máxima performance",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="py-20" style={{ backgroundColor: '#11161F' }}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Conheça o Nosso
            <span className="block text-[#00C3FF]">
              Processo
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Uma metodologia comprovada para transformar seu negócio com inteligência artificial
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Process Steps */}
          <div className="space-y-8">
            {processSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-6"
                >
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center relative`}>
                      <IconComponent className="w-8 h-8 text-white" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#00C3FF] rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {step.number}
                      </div>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-lg">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Visual Simulation */}
          <div className="relative">
            {/* Main Container */}
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-600/30 backdrop-blur-sm relative overflow-hidden">
              {/* Animated Background */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 to-pink-500">
                  <motion.div
                    className="h-full bg-white/30"
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 3, repeat: Infinity }}
                    viewport={{ once: true }}
                  />
                </div>
              </div>

              {/* Process Visualization */}
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-white mb-6 text-center">
                  Processo em Ação
                </h4>

                {/* Step Indicators */}
                <div className="space-y-6">
                  {processSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.3 }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-4"
                    >
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${step.color}`} />
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${step.color}`}
                          initial={{ width: "0%" }}
                          whileInView={{ width: "100%" }}
                          transition={{ duration: 1, delay: index * 0.4 }}
                          viewport={{ once: true }}
                        />
                      </div>
                      <CheckCircle className="w-5 h-5 text-[#00C3FF]" />
                    </motion.div>
                  ))}
                </div>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#00C3FF] mb-1">2-4</div>
                    <p className="text-slate-300 text-sm">Semanas</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#00C3FF] mb-1">24/7</div>
                    <p className="text-slate-300 text-sm">Suporte</p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#00C3FF] rounded-full opacity-20 blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500 rounded-full opacity-10 blur-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIProcessSection;