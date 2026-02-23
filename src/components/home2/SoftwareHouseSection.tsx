import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code2, Globe, Cpu, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: Code2,
    title: "Desenvolvimento de Software à Medida",
    desc: "Sistemas de gestão interna, portais de clientes e aplicações específicas para o seu processo. Nós construímos o motor que a sua empresa precisa.",
    cta: "Pedir Orçamento",
  },
  {
    icon: Globe,
    title: "Sites, Landing Pages & E-commerces",
    desc: "Plataformas robustas, rápidas e desenhadas para converter cliques em dinheiro. Design premium com performance de topo.",
    cta: "Ver Portfólio",
  },
  {
    icon: Cpu,
    title: "Automação de Processos Empresariais",
    desc: "Conectamos os seus sistemas. De chatbots inteligentes a integrações complexas que poupam centenas de horas humanas.",
    cta: "Agendar Diagnóstico",
  },
];

const SoftwareHouseSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleCTA = () => {
    window.open('https://app.senvia.pt/c/senvia-agency/formulario-lp', '_blank');
  };

  return (
    <section id="software-house" className="py-24 md:py-32 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 aurora-bg" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Code2 className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">Software House & Engenharia</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Construímos o que a sua <span className="gradient-text-animated">empresa imaginar</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Para além do SENVIA OS, somos uma software house completa. Desenvolvimento, automação e design de alto nível.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, i) => (
            <motion.div key={service.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
              whileHover={{ y: -12 }}
              className="group relative"
            >
              <div className="relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-500 h-full flex flex-col glass-premium overflow-hidden">
                {/* Shimmer overlay */}
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex-1 flex flex-col">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring" }}
                    className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors glow-pulse">
                    <service.icon className="w-8 h-8 text-primary" />
                  </motion.div>

                  <h3 className="text-xl font-bold text-foreground mb-4">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-8 flex-1">{service.desc}</p>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button onClick={handleCTA} variant="outline" className="w-full group/btn border-primary/30 hover:bg-primary/10 hover:border-primary/50">
                      {service.cta}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SoftwareHouseSection;
