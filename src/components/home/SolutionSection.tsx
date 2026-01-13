import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, Brain, Zap, Flame, Snowflake } from 'lucide-react';

const SolutionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      number: "01",
      icon: Target,
      title: "A Captura",
      subtitle: "Landing Pages",
      description: "Desenvolvemos páginas focadas num único objetivo: conversão. Design premium, copy persuasivo e velocidade máxima.",
      color: "primary"
    },
    {
      number: "02",
      icon: Brain,
      title: "O Filtro",
      subtitle: "SENVIA OS",
      description: "Não usamos formulários burros. A nossa IA analisa as respostas do lead em tempo real, cruzando dados para medir a intenção de compra.",
      color: "primary"
    },
    {
      number: "03",
      icon: Zap,
      title: "A Ação",
      subtitle: "Venda Focada",
      description: "O seu time recebe o lead já classificado.",
      actions: [
        { icon: Flame, label: "Quente: Ligar agora", color: "orange" },
        { icon: Snowflake, label: "Frio: Agendar", color: "blue" }
      ],
      color: "primary"
    }
  ];

  return (
    <section id="metodo" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span 
            className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 shimmer"
            whileHover={{ scale: 1.05 }}
          >
            O Método SENVIA
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Como transformamos o seu
            <br />
            <span className="gradient-text-animated">processo de vendas</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Animated connection line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 overflow-hidden">
            <motion.div
              className="w-full h-full bg-gradient-to-b from-primary via-primary/50 to-transparent"
              initial={{ scaleY: 0, originY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            />
            
            {/* Animated pulse along the line */}
            <motion.div
              className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-primary/80 to-transparent"
              animate={{
                y: ['-100%', '500%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 1,
              }}
            />
          </div>

          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.3, duration: 0.7, type: "spring" }}
                className={`relative md:grid md:grid-cols-2 md:gap-12 items-center ${
                  index % 2 === 0 ? '' : 'md:direction-rtl'
                }`}
              >
                {/* Step number indicator with glow */}
                <motion.div 
                  className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-primary text-primary-foreground items-center justify-center font-bold text-sm z-10"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={isInView ? { scale: 1, rotate: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.3, duration: 0.5, type: "spring" }}
                  whileHover={{ scale: 1.2 }}
                  style={{
                    boxShadow: '0 0 30px hsl(var(--primary) / 0.5)',
                  }}
                >
                  <motion.span
                    animate={{ 
                      textShadow: [
                        '0 0 0px hsl(var(--primary-foreground))',
                        '0 0 10px hsl(var(--primary-foreground))',
                        '0 0 0px hsl(var(--primary-foreground))',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {step.number}
                  </motion.span>
                </motion.div>

                {/* Content */}
                <div className={`${index % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16 md:col-start-2'}`}>
                  <motion.div 
                    className={`bg-card border border-border rounded-2xl p-8 ${index % 2 === 0 ? '' : 'md:direction-ltr'} relative overflow-hidden group`}
                    whileHover={{ 
                      y: -5,
                      boxShadow: '0 20px 40px hsl(var(--primary) / 0.15)',
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} relative z-10`}>
                      <motion.div 
                        className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <step.icon className="h-6 w-6 text-primary" />
                      </motion.div>
                      <div className={index % 2 === 0 ? 'md:text-right' : ''}>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">{step.subtitle}</span>
                        <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                      </div>
                    </div>
                    
                    <p className={`text-muted-foreground ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} relative z-10`}>
                      {step.description}
                    </p>

                    {step.actions && (
                      <div className={`mt-4 flex flex-col gap-2 ${index % 2 === 0 ? 'md:items-end' : 'md:items-start'} relative z-10`}>
                        {step.actions.map((action, actionIndex) => (
                          <motion.div
                            key={actionIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 1 + actionIndex * 0.2 }}
                            whileHover={{ scale: 1.05, x: 5 }}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg cursor-default ${
                              action.color === 'orange' 
                                ? 'bg-orange-500/10 text-orange-400' 
                                : 'bg-blue-500/10 text-blue-400'
                            }`}
                          >
                            <motion.div
                              animate={action.color === 'orange' ? {
                                scale: [1, 1.2, 1],
                              } : {
                                rotate: [0, 10, -10, 0],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <action.icon className="h-4 w-4" />
                            </motion.div>
                            <span className="text-sm font-medium">{action.label}</span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Empty column for alternating layout */}
                <div className={`hidden md:block ${index % 2 === 0 ? '' : 'col-start-1 row-start-1'}`} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
