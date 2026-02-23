import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users, UserCheck, FileText, TrendingUp, Wallet, Calendar, Megaphone, ShoppingCart, Receipt, Bot, Zap } from 'lucide-react';

const modules = [
  { icon: Users, label: "Leads", desc: "Capture e qualifique automaticamente" },
  { icon: UserCheck, label: "Clientes", desc: "Gestão completa de carteira" },
  { icon: FileText, label: "Propostas", desc: "Crie e envie em minutos" },
  { icon: TrendingUp, label: "Vendas", desc: "Pipeline visual e KPIs" },
  { icon: Wallet, label: "Financeiro", desc: "Receitas, despesas e fluxo" },
  { icon: Calendar, label: "Agenda", desc: "Calendário integrado" },
  { icon: Megaphone, label: "Marketing", desc: "Campanhas e relatórios" },
  { icon: ShoppingCart, label: "E-commerce", desc: "Loja e catálogo online" },
  { icon: Receipt, label: "Faturação", desc: "InvoiceXpress integrado" },
];

const SenviaOSSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="senvia-os" className="py-24 md:py-32 relative overflow-hidden bg-background" ref={ref}>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Bot className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">IA Integrada + Automações</span>
            <Zap className="w-4 h-4 text-primary" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Um CRM. <span className="gradient-text-animated">Todos os módulos.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            O SENVIA OS centraliza toda a gestão do seu negócio num único sistema inteligente. Sem ferramentas dispersas. Sem caos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, i) => (
            <motion.div key={mod.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300 glass-premium cursor-default"
            >
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
                >
                  <mod.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{mod.label}</h3>
                <p className="text-sm text-muted-foreground">{mod.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SenviaOSSection;
