import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Brain, Zap, Users, HeadsetIcon } from 'lucide-react';

const differentials = [
  {
    icon: Brain,
    title: "IA em Tudo",
    desc: "Inteligência Artificial integrada em cada solução que construímos. Não é um add-on — é o DNA do nosso trabalho.",
    stat: "100%",
    statLabel: "AI-powered",
  },
  {
    icon: Zap,
    title: "Entrega Rápida",
    desc: "Semanas, não meses. A nossa stack moderna e metodologia ágil permitem entregas até 5x mais rápidas que o tradicional.",
    stat: "5x",
    statLabel: "Mais rápido",
  },
  {
    icon: Users,
    title: "Equipa Dedicada",
    desc: "Cada projeto tem uma equipa focada. Nada de recursos partilhados ou atenção diluída. O seu projeto é a nossa prioridade.",
    stat: "1:1",
    statLabel: "Foco total",
  },
  {
    icon: HeadsetIcon,
    title: "Suporte Contínuo",
    desc: "O nosso trabalho não acaba na entrega. Suporte pós-projeto, monitorização e evolução contínua do seu sistema.",
    stat: "24h",
    statLabel: "Tempo de resposta",
  },
];

const SenviaWhyUsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="porque-nos" className="py-24 md:py-32 relative overflow-hidden" ref={ref}>
      {/* Aurora bg */}
      <div className="absolute inset-0 aurora-bg" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <motion.span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-4"
            initial={{ opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.2 }}>
            Porque a SENVIA
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            O que nos torna <span className="gradient-text-animated">diferentes</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Não somos mais uma software house. Somos engenheiros que pensam como empresários.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {differentials.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative p-8 rounded-2xl border border-border bg-card/50 glass-premium hover:border-primary/30 transition-all duration-300 cursor-default group text-center"
            >
              <div className="absolute inset-0 rounded-2xl spotlight opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: [0, -15, 15, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 mx-auto group-hover:bg-primary/20 transition-colors"
                >
                  <item.icon className="w-7 h-7 text-primary" />
                </motion.div>

                <motion.p className="text-3xl font-bold gradient-text-animated mb-1"
                  initial={{ scale: 0.5 }} animate={isInView ? { scale: 1 } : {}} transition={{ delay: 0.3 + i * 0.1, type: "spring" }}>
                  {item.stat}
                </motion.p>
                <p className="text-xs text-muted-foreground mb-4">{item.statLabel}</p>

                <h3 className="text-lg font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SenviaWhyUsSection;
