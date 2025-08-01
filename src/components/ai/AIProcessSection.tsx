import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
const AIProcessSection = () => {
  const processSteps = [{
    number: "01",
    title: "Análise Completa",
    description: "Investigamos profundamente seus processos operacionais para descobrir oportunidades onde a IA pode revolucionar e otimizar tarefas"
  }, {
    number: "02", 
    title: "Desenvolvimento & Implementação",
    description: "Criamos e incorporamos tecnologias de inteligência artificial diretamente em seus sistemas existentes"
  }, {
    number: "03",
    title: "Aperfeiçoamento Contínuo",
    description: "Monitoramos, ajustamos e evoluímos constantemente suas soluções de IA para máxima performance"
  }];
  return <section className="py-20" style={{
    backgroundColor: '#11161F'
  }}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Conheça o Nosso
            <span className="block text-[#00C3FF] mt-1 sm:mt-2">
              Processo
            </span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Process Steps */}
          <div className="space-y-8">
            {processSteps.map((step, index) => {
            return <motion.div key={index} initial={{
              opacity: 0,
              x: -50
            }} whileInView={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.6,
              delay: index * 0.2
            }} viewport={{
              once: true
            }} className="flex items-start space-x-6">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#00C3FF] flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                      {step.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                      {step.description}
                    </p>
                  </div>
                </motion.div>;
          })}
          </div>

          {/* Visual Simulation */}
          <div className="relative">
            {/* Main Container */}
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-600/30 backdrop-blur-sm relative overflow-hidden">
              {/* Dynamic Process Flow */}
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-white mb-8 text-center">
              </h4>

                {/* Central Hub */}
                <div className="relative flex items-center justify-center">
                  {/* Main Central Circle */}
                  <motion.div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center relative z-10" animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: ["0 0 20px rgba(0, 195, 255, 0.3)", "0 0 30px rgba(0, 195, 255, 0.6)", "0 0 20px rgba(0, 195, 255, 0.3)"]
                }} transition={{
                  duration: 2,
                  repeat: Infinity
                }}>
                    <div className="text-white font-bold text-sm">IA</div>
                  </motion.div>

                  {/* Orbiting Step Circles */}
                  {processSteps.map((step, index) => {
                  const angle = index * 120 - 90; // 120 degrees apart, starting from top
                  const radius = 80;
                  const x = Math.cos(angle * Math.PI / 180) * radius;
                  const y = Math.sin(angle * Math.PI / 180) * radius;
                  return <motion.div key={index} className="absolute w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center border-2 border-[#00C3FF]" style={{
                    left: `calc(50% + ${x}px - 24px)`,
                    top: `calc(50% + ${y}px - 24px)`
                  }} animate={{
                    rotate: [0, 360]
                  }} transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.5
                  }}>
                        <span className="text-xs font-bold text-[#00C3FF]">{step.number}</span>
                        
                        {/* Connecting Lines */}
                        <motion.div className="absolute w-0.5 bg-gradient-to-r from-[#00C3FF] to-transparent" style={{
                      height: `${radius - 10}px`,
                      transformOrigin: 'bottom',
                      transform: `rotate(${angle + 180}deg)`,
                      bottom: '50%',
                      left: '50%'
                    }} animate={{
                      opacity: [0.3, 0.8, 0.3]
                    }} transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3
                    }} />
                      </motion.div>;
                })}
                </div>

                {/* Process Status */}
                <div className="mt-12 space-y-3">
                  {processSteps.map((step, index) => <motion.div key={index} className="flex items-center space-x-3" initial={{
                  opacity: 0,
                  x: 20
                }} whileInView={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  duration: 0.5,
                  delay: index * 0.2
                }} viewport={{
                  once: true
                }}>
                      <motion.div className="w-2 h-2 bg-[#00C3FF] rounded-full" animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }} transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.5
                  }} />
                      <span className="text-slate-300 text-sm">{step.title}</span>
                      <motion.div className="flex-1 h-0.5 bg-slate-700 rounded-full overflow-hidden" initial={{
                    width: 0
                  }} whileInView={{
                    width: "100%"
                  }} transition={{
                    duration: 1,
                    delay: index * 0.3
                  }} viewport={{
                    once: true
                  }}>
                        <motion.div className="h-full bg-[#00C3FF]" animate={{
                      width: ["0%", "100%", "0%"]
                    }} transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5
                    }} />
                      </motion.div>
                    </motion.div>)}
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#00C3FF] rounded-full opacity-20 blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500 rounded-full opacity-10 blur-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default AIProcessSection;