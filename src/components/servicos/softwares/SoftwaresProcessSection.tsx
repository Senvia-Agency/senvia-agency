import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ClipboardList, PenTool, Code2, Rocket } from 'lucide-react';

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Levantamento de Requisitos",
    desc: "Mapeamos os seus processos, identificamos bottlenecks e definimos o scope funcional e técnico do projeto.",
  },
  {
    icon: PenTool,
    step: "02",
    title: "Arquitetura & Design",
    desc: "Desenhamos a arquitetura do sistema, protótipos de UI/UX e definimos a stack tecnológica ideal.",
  },
  {
    icon: Code2,
    step: "03",
    title: "Desenvolvimento Ágil",
    desc: "Sprints quinzenais com entregas incrementais. Código limpo, testes automatizados e revisões contínuas.",
  },
  {
    icon: Rocket,
    step: "04",
    title: "Deploy & Suporte",
    desc: "Lançamento em produção, formação da equipa, monitorização e suporte técnico contínuo incluído.",
  },
];

const SoftwaresProcessSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-background" ref={ref}>
      <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <motion.span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-4"
            initial={{ opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.2 }}>
            Como Trabalhamos
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Da ideia à <span className="gradient-text-animated">produção</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Um processo estruturado e transparente em 4 fases.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="relative p-6 rounded-2xl border border-border hover:border-primary/30 bg-card/50 backdrop-blur-sm transition-all duration-500 group text-center"
            >
              <motion.span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full bg-primary text-primary-foreground">
                {step.step}
              </motion.span>

              <div className="relative z-10 pt-4">
                <motion.div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 mx-auto group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-7 h-7 text-primary" />
                </motion.div>

                <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>

              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SoftwaresProcessSection;
