import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
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
        { icon: Snowflake, label: "Frio: Automação (nutrição)", color: "blue" }
      ],
      color: "primary"
    }
  ];

  return (
    <section id="metodo" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            O Método SENVIA
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Como transformamos o seu
            <br />
            <span className="text-primary">processo de vendas</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent -translate-x-1/2" />

          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.2, duration: 0.6 }}
                className={`relative md:grid md:grid-cols-2 md:gap-12 items-center ${
                  index % 2 === 0 ? '' : 'md:direction-rtl'
                }`}
              >
                {/* Step number indicator */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary text-primary-foreground items-center justify-center font-bold text-sm z-10">
                  {step.number}
                </div>

                {/* Content */}
                <div className={`${index % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16 md:col-start-2'}`}>
                  <div className={`bg-card border border-border rounded-2xl p-8 ${index % 2 === 0 ? '' : 'md:direction-ltr'}`}>
                    <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className={index % 2 === 0 ? 'md:text-right' : ''}>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">{step.subtitle}</span>
                        <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                      </div>
                    </div>
                    
                    <p className={`text-muted-foreground ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      {step.description}
                    </p>

                    {step.actions && (
                      <div className={`mt-4 flex flex-col gap-2 ${index % 2 === 0 ? 'md:items-end' : 'md:items-start'}`}>
                        {step.actions.map((action, actionIndex) => (
                          <div
                            key={actionIndex}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${
                              action.color === 'orange' 
                                ? 'bg-orange-500/10 text-orange-400' 
                                : 'bg-blue-500/10 text-blue-400'
                            }`}
                          >
                            <action.icon className="h-4 w-4" />
                            <span className="text-sm font-medium">{action.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
