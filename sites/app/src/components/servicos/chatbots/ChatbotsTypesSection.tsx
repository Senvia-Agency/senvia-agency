import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Headphones, UserCheck, HelpCircle, ShoppingBag } from 'lucide-react';

const chatbotTypes = [
  {
    icon: Headphones,
    title: "Atendimento ao Cliente",
    desc: "Respostas instantâneas às perguntas mais frequentes. Reduz o tempo de espera e melhora a satisfação do cliente.",
    features: ["Respostas Instantâneas", "Multi-Idioma", "Escalação Inteligente", "Histórico Completo"],
    gradient: "from-purple-500/20 to-violet-500/20",
    borderGlow: "hover:shadow-[0_0_30px_hsl(270_100%_50%/0.15)]",
  },
  {
    icon: UserCheck,
    title: "Qualificação de Leads",
    desc: "Identifica e qualifica potenciais clientes automaticamente, fazendo as perguntas certas no momento certo.",
    features: ["Perguntas Dinâmicas", "Lead Scoring", "Integração CRM", "Notificações em Tempo Real"],
    gradient: "from-blue-500/20 to-cyan-500/20",
    borderGlow: "hover:shadow-[0_0_30px_hsl(200_100%_50%/0.15)]",
  },
  {
    icon: HelpCircle,
    title: "FAQ Inteligente",
    desc: "Base de conhecimento alimentada por IA que aprende e evolui. Respostas contextuais e sempre atualizadas.",
    features: ["Aprendizagem Contínua", "Respostas Contextuais", "Auto-Atualização", "Analytics Detalhado"],
    gradient: "from-emerald-500/20 to-green-500/20",
    borderGlow: "hover:shadow-[0_0_30px_hsl(150_100%_50%/0.15)]",
  },
  {
    icon: ShoppingBag,
    title: "Assistente de Vendas",
    desc: "Guia os clientes no processo de compra, recomenda produtos e fecha vendas — tudo de forma automatizada.",
    features: ["Recomendações IA", "Upselling Automático", "Checkout Assistido", "Follow-up Inteligente"],
    gradient: "from-orange-500/20 to-amber-500/20",
    borderGlow: "hover:shadow-[0_0_30px_hsl(30_100%_50%/0.15)]",
  },
];

const ChatbotsTypesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-background" ref={ref}>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <motion.span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-4"
            initial={{ opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.2 }}>
            Tipos de Chatbots
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            O chatbot certo para <span className="gradient-text-animated">cada objetivo</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cada negócio tem necessidades únicas. Desenvolvemos chatbots especializados para o seu caso.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {chatbotTypes.map((type, i) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className={`relative p-8 rounded-2xl border border-border hover:border-primary/30 bg-gradient-to-br ${type.gradient} backdrop-blur-sm transition-all duration-500 group cursor-default ${type.borderGlow}`}
            >
              <div className="absolute inset-0 rounded-2xl spotlight opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors"
                >
                  <type.icon className="w-7 h-7 text-primary" />
                </motion.div>

                <h3 className="text-xl font-bold text-foreground mb-3">{type.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{type.desc}</p>

                <div className="flex flex-wrap gap-2">
                  {type.features.map((f) => (
                    <span key={f} className="text-xs px-3 py-1 rounded-full bg-muted/50 text-muted-foreground border border-border/50">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChatbotsTypesSection;
