import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code2, TrendingUp, Shield, Cpu, HeadphonesIcon, Plug } from 'lucide-react';

const differentials = [
  { icon: Code2, title: "Código Limpo", desc: "Arquitetura sólida, bem documentada e fácil de manter. Sem dívida técnica escondida." },
  { icon: TrendingUp, title: "Escalabilidade", desc: "Sistemas preparados para crescer consigo. De 10 a 10.000 utilizadores sem reescrever." },
  { icon: Shield, title: "Segurança", desc: "Encriptação, autenticação robusta e boas práticas de segurança em cada camada." },
  { icon: Cpu, title: "Tecnologias Modernas", desc: "React, Node.js, TypeScript, PostgreSQL e cloud. Stack atual e comprovada." },
  { icon: HeadphonesIcon, title: "Suporte Dedicado", desc: "Equipa técnica disponível pós-lançamento. Manutenção, atualizações e evolução contínua." },
  { icon: Plug, title: "Integração Total", desc: "Conectamos com os seus sistemas existentes: ERPs, CRMs, gateways de pagamento e mais." },
];

const SoftwaresDifferentialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-background" ref={ref}>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <motion.span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-4"
            initial={{ opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.2 }}>
            Porquê a SENVIA
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Engenharia com <span className="gradient-text-animated">excelência</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Não entregamos apenas software. Entregamos soluções que resolvem problemas reais.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {differentials.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="p-6 rounded-2xl border border-border hover:border-primary/30 bg-card/50 backdrop-blur-sm transition-all duration-500 group"
            >
              <motion.div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-6 h-6 text-primary" />
              </motion.div>
              <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SoftwaresDifferentialsSection;
