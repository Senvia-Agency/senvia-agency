import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Brain, Clock, Plug, BarChart3, MessageCircle, Globe } from 'lucide-react';

const differentials = [
  { icon: Brain, title: "IA Avançada", desc: "Modelos de linguagem de última geração que compreendem contexto e respondem de forma natural e precisa." },
  { icon: Clock, title: "Disponível 24/7", desc: "O seu chatbot nunca dorme. Atendimento contínuo, sem pausas, fins de semana ou feriados." },
  { icon: Plug, title: "Integração Total", desc: "Conecta com os seus sistemas: CRM, ERP, e-commerce, calendários, email e muito mais." },
  { icon: BarChart3, title: "Analytics em Tempo Real", desc: "Dashboard completo com métricas de conversas, satisfação, conversões e oportunidades de melhoria." },
  { icon: MessageCircle, title: "Respostas Naturais", desc: "Conversas fluidas e humanas, sem respostas robóticas. O seu chatbot fala como a sua equipa." },
  { icon: Globe, title: "Multicanal", desc: "Um único chatbot presente no site, WhatsApp, Instagram, Facebook Messenger e mais canais." },
];

const ChatbotsDifferentialsSection = () => {
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
            O que nos <span className="gradient-text-animated">diferencia</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Não criamos chatbots genéricos. Desenvolvemos assistentes inteligentes treinados para o seu negócio.
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

export default ChatbotsDifferentialsSection;
