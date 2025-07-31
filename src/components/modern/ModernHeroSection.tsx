import { ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const ModernHeroSection = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Futuristic background with animated elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-senvia-950">
        {/* Animated grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute inset-0">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            className="absolute top-1/4 left-1/4 w-64 h-64 border border-senvia-400/30 rounded-full"
          />
          <motion.div
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 0.15, rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/3 right-1/4 w-32 h-32 border border-senvia-500/40"
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          />
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 0.2, x: 100 }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bottom-1/3 left-1/6 w-48 h-1 bg-gradient-to-r from-transparent via-senvia-400 to-transparent"
          />
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-senvia-400 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute bottom-32 left-32 w-6 h-6 bg-accent rounded-full blur-md animate-pulse"></div>
        <div className="absolute top-1/2 left-20 w-2 h-2 bg-primary rounded-full blur-sm animate-pulse"></div>
      </div>
      
      <div className="container mx-auto px-4 text-center z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto"
        >
          {/* Futuristic status badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black/40 border border-senvia-400/30 backdrop-blur-xl mb-16 shadow-2xl"
          >
            <div className="relative">
              <div className="w-3 h-3 bg-senvia-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-senvia-400 rounded-full animate-ping"></div>
            </div>
            <span className="text-senvia-300 font-mono text-sm tracking-wider">SYSTEM ONLINE • LEIRIA, PORTUGAL</span>
          </motion.div>

          {/* Main title with futuristic effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-thin mb-6 leading-none tracking-tighter">
              <span className="block text-gray-400 font-extralight">CONVERSÕES</span>
              <span className="block bg-gradient-to-r from-senvia-400 via-senvia-300 to-white bg-clip-text text-transparent font-light">
                AUTOMATIZADAS
              </span>
              <span className="block text-gray-500 font-ultralight text-2xl md:text-4xl lg:text-5xl mt-4">
                EM 24H
              </span>
            </h1>
            
            {/* Tech-style subtitle */}
            <div className="text-senvia-300 font-mono text-sm md:text-base tracking-widest opacity-80 mb-8">
              [LANDING_PAGES] • [SALES_FUNNELS] • [AUTOMATION]
            </div>
          </motion.div>

          {/* Value proposition with metrics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mb-16"
          >
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Sistemas premium que convertem <span className="text-senvia-400 font-semibold">3x mais visitantes</span> em clientes pagantes
            </p>
            
            {/* Performance metrics */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-senvia-400 mb-2">300%</div>
                <div className="text-sm text-gray-400 font-mono">AUMENTO CONVERSÃO</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-senvia-400 mb-2">24H</div>
                <div className="text-sm text-gray-400 font-mono">ENTREGA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-senvia-400 mb-2">ROI</div>
                <div className="text-sm text-gray-400 font-mono">GARANTIDO</div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="space-y-8"
          >
            <Button
              size="lg"
              onClick={scrollToContact}
              className="group relative px-16 py-6 bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 text-black font-bold text-xl border-2 border-senvia-300 shadow-2xl hover:shadow-senvia-400/50 transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-4">
                INICIAR AGORA • GRÁTIS
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
              </span>
            </Button>
            
            <div className="text-sm text-gray-400 font-mono">
              CONSULTORIA GRATUITA • SEM COMPROMISSO • RESULTADOS GARANTIDOS
            </div>
          </motion.div>

          {/* Quick benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto"
          >
            {[
              { icon: Zap, text: "Setup em 24h", desc: "Implementação imediata" },
              { icon: TrendingUp, text: "ROI Garantido", desc: "Ou devolvemos o dinheiro" },
              { icon: Shield, text: "Suporte Premium", desc: "Acompanhamento contínuo" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                className="p-6 rounded-xl bg-black/30 border border-senvia-500/20 backdrop-blur-sm hover:border-senvia-400/40 transition-all duration-300"
              >
                <item.icon className="w-8 h-8 text-senvia-400 mb-4 mx-auto" />
                <div className="text-white font-semibold mb-2">{item.text}</div>
                <div className="text-gray-400 text-sm">{item.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="text-senvia-400 font-mono text-xs tracking-widest">SCROLL</div>
          <div className="w-px h-16 bg-gradient-to-b from-senvia-400 to-transparent">
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: 32 }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
              className="w-px h-4 bg-senvia-400"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ModernHeroSection;