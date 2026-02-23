import { motion } from 'framer-motion';
import { ArrowRight, Code2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SoftwaresHeroSection = () => {
  const handleCTA = () => window.open('https://app.senvia.pt/c/senvia-agency/formulario-lp', '_blank');

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-background pt-24 aurora-bg">
      <div className="absolute inset-0 gradient-animate" />

      <motion.div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/8 blob blur-3xl"
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/8 blob blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], x: [0, -40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-6 shimmer">
            <Code2 className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-400">Software à Medida</span>
          </motion.div>

          <motion.h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
            Software que Move{' '}
            <br />
            <motion.span className="gradient-text-animated inline-block pb-2 pr-1"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
              o Seu Negócio
            </motion.span>
          </motion.h1>

          <motion.p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            Sistemas de gestão, portais de clientes, APIs e aplicações web complexas. Construímos o <strong className="text-foreground">motor digital</strong> que a sua empresa precisa para escalar.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleCTA} size="lg" className="group text-base px-8 py-6 bg-primary hover:bg-primary/90 glow-pulse">
                <Sparkles className="mr-2 h-5 w-5" />
                Pedir Orçamento
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SoftwaresHeroSection;
