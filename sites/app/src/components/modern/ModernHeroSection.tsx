import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const ModernHeroSection = () => {
  const scrollToContact = () => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-card to-muted">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      
      <div className="container mx-auto px-6 text-center z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-5xl mx-auto"
        >
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-xl mb-12"
          >
            <div className="relative">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 bg-primary rounded-full animate-ping"></div>
            </div>
            <span className="text-primary font-mono text-sm tracking-wider">SISTEMA ATIVO • LEIRIA, PORTUGAL</span>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-none">
              <span className="block text-foreground">
                CLONE DIGITAL
              </span>
              <span className="block text-gradient">
                QUE VENDE 24/7
              </span>
              <span className="block text-muted-foreground text-3xl md:text-5xl lg:text-6xl font-light mt-4">
                ENQUANTO VOCÊ DORME
              </span>
            </h1>
          </motion.div>

          {/* Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mb-12"
          >
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
              Transformamos visitantes em clientes com <span className="text-primary font-bold">Landing Pages</span>, 
              <span className="text-accent font-bold"> Funis de Vendas</span> e 
              <span className="text-primary font-bold"> Automações</span> que convertem 300% mais
            </p>
            
            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-primary mb-2">300%</div>
                <div className="text-sm text-muted-foreground font-mono uppercase tracking-wide">Mais Conversões</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-accent mb-2">24h</div>
                <div className="text-sm text-muted-foreground font-mono uppercase tracking-wide">Implementação</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-primary mb-2">ROI</div>
                <div className="text-sm text-muted-foreground font-mono uppercase tracking-wide">Garantido</div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="space-y-6"
          >
            <Button
              size="lg"
              onClick={scrollToContact}
              className="group relative px-12 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xl rounded-xl shadow-2xl hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-3">
                INICIAR AGORA - GRÁTIS
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
              </span>
            </Button>
            
            <div className="text-sm text-muted-foreground font-mono uppercase tracking-widest">
              CONSULTORIA GRATUITA • RESULTADOS GARANTIDOS • SEM COMPROMISSO
            </div>
          </motion.div>

          {/* Quick Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto"
          >
            {[
              { icon: Zap, text: "Setup Imediato", desc: "Sistema online em 24h" },
              { icon: TrendingUp, text: "ROI Comprovado", desc: "300% mais conversões" },
              { icon: Shield, text: "Garantia Total", desc: "Ou devolvemos o dinheiro" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border backdrop-blur-sm hover:border-primary/50 transition-all duration-300"
              >
                <item.icon className="w-8 h-8 text-primary mb-4 mx-auto" />
                <div className="text-foreground font-bold mb-2 text-lg">{item.text}</div>
                <div className="text-muted-foreground text-sm">{item.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="text-primary font-mono text-xs tracking-widest uppercase">Scroll</div>
          <div className="w-px h-16 bg-gradient-to-b from-primary to-transparent">
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: 32 }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
              className="w-px h-4 bg-primary"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ModernHeroSection;