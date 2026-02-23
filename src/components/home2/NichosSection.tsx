import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Stethoscope, HardHat, Wifi, ShoppingBag, Building2 } from 'lucide-react';

const nichos = [
  {
    icon: Stethoscope,
    title: "Clínicas & Saúde",
    desc: "Gestão de pacientes, agendamentos e faturação clínica integrada.",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: HardHat,
    title: "Construção & Obras",
    desc: "Orçamentos, acompanhamento de obra e controlo de custos em tempo real.",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: Wifi,
    title: "Telecomunicações",
    desc: "Pipeline de vendas, gestão de contratos e comissões automáticas.",
    gradient: "from-blue-500/20 to-indigo-500/20",
  },
  {
    icon: ShoppingBag,
    title: "E-commerce",
    desc: "Catálogo de produtos, checkout integrado e gestão de encomendas.",
    gradient: "from-pink-500/20 to-rose-500/20",
  },
  {
    icon: Building2,
    title: "Imobiliário",
    desc: "Gestão de imóveis, leads qualificados e propostas automáticas.",
    gradient: "from-violet-500/20 to-purple-500/20",
  },
];

const NichosSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="nichos" className="py-24 md:py-32 relative overflow-hidden bg-background" ref={ref}>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Feito para o <span className="gradient-text-animated">seu setor</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            O SENVIA OS adapta-se ao seu nicho com fluxos, templates e automações específicas para o seu negócio.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {nichos.map((nicho, i) => (
            <motion.div key={nicho.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.03 }}
              className={`relative p-8 rounded-2xl border border-border bg-gradient-to-br ${nicho.gradient} backdrop-blur-sm hover:border-primary/40 transition-all duration-300 cursor-default group`}
            >
              <div className="absolute inset-0 rounded-2xl spotlight opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <motion.div whileHover={{ rotate: [0, -15, 15, 0] }} transition={{ duration: 0.5 }}
                  className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <nicho.icon className="w-7 h-7 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground mb-3">{nicho.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{nicho.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NichosSection;
