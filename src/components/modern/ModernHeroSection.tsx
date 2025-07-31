import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const ModernHeroSection = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-950 to-blue-950">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
        
        {/* Floating Elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 border border-cyan-400/30 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 0.2, rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 right-1/4 w-48 h-48 border border-blue-400/30"
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
        />
        
        {/* Glowing Orbs */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-cyan-400 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute bottom-32 left-32 w-6 h-6 bg-blue-500 rounded-full blur-md animate-pulse"></div>
        <div className="absolute top-1/2 left-20 w-2 h-2 bg-cyan-300 rounded-full blur-sm animate-pulse"></div>
      </div>
      
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
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-cyan-500/10 border border-cyan-400/30 backdrop-blur-xl mb-12"
          >
            <div className="relative">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
            </div>
            <span className="text-cyan-300 font-mono text-sm tracking-wider">SISTEMA ATIVO • LEIRIA, PORTUGAL</span>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-none">
              <span className="block bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
                SISTEMAS
              </span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent">
                DE CONVERSÃO
              </span>
              <span className="block text-gray-400 text-3xl md:text-5xl lg:text-6xl font-light mt-4">
                EM 24 HORAS
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
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Transformamos visitantes em clientes com <span className="text-cyan-400 font-bold">Landing Pages</span>, 
              <span className="text-blue-400 font-bold"> Funis de Vendas</span> e 
              <span className="text-cyan-300 font-bold"> Automações</span> que convertem 300% mais
            </p>
            
            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-cyan-400 mb-2">300%</div>
                <div className="text-sm text-gray-400 font-mono uppercase tracking-wide">Mais Conversões</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-blue-400 mb-2">24h</div>
                <div className="text-sm text-gray-400 font-mono uppercase tracking-wide">Implementação</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-cyan-300 mb-2">ROI</div>
                <div className="text-sm text-gray-400 font-mono uppercase tracking-wide">Garantido</div>
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
              className="group relative px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xl rounded-xl border-2 border-cyan-300 shadow-2xl hover:shadow-cyan-400/50 transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-3">
                INICIAR AGORA - GRÁTIS
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
              </span>
            </Button>
            
            <div className="text-sm text-gray-400 font-mono uppercase tracking-widest">
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
                className="p-6 rounded-xl bg-black/40 border border-cyan-500/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300"
              >
                <item.icon className="w-8 h-8 text-cyan-400 mb-4 mx-auto" />
                <div className="text-white font-bold mb-2 text-lg">{item.text}</div>
                <div className="text-gray-400 text-sm">{item.desc}</div>
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
          <div className="text-cyan-400 font-mono text-xs tracking-widest uppercase">Scroll</div>
          <div className="w-px h-16 bg-gradient-to-b from-cyan-400 to-transparent">
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: 32 }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
              className="w-px h-4 bg-cyan-400"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ModernHeroSection;