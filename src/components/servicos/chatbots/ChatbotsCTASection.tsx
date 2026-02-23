import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ChatbotsCTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const handleCTA = () => window.open('https://app.senvia.pt/c/senvia-agency/formulario-lp', '_blank');

  return (
    <section className="py-24 md:py-32 relative overflow-hidden" ref={ref}>
      <motion.div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Diagnóstico Gratuito
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Pronto para automatizar o seu{' '}
            <span className="gradient-text-animated">atendimento?</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Agende um diagnóstico gratuito. Vamos analisar os seus processos e mostrar como um chatbot com IA pode transformar o seu negócio.
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={handleCTA} size="lg" className="group text-base px-10 py-6 bg-primary hover:bg-primary/90 glow-pulse">
              Agendar Diagnóstico Gratuito
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ChatbotsCTASection;
