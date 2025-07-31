import { ArrowRight, Globe, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const ModernHeroSection = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-senvia-900/5">
      {/* Geometric background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-2 h-20 bg-gradient-to-b from-senvia-400 to-transparent opacity-30"></div>
        <div className="absolute top-40 right-32 w-20 h-2 bg-gradient-to-r from-primary to-transparent opacity-30"></div>
        <div className="absolute bottom-32 left-1/4 w-1 h-32 bg-gradient-to-b from-accent to-transparent opacity-20"></div>
        <div className="absolute bottom-20 right-20 w-32 h-1 bg-gradient-to-l from-senvia-400 to-transparent opacity-20"></div>
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      
      <div className="container mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card/30 border border-senvia-500/10 backdrop-blur-sm mb-12"
          >
            <div className="w-2 h-2 bg-senvia-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground font-medium">Tecnologia Premium • Portugal</span>
          </motion.div>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-light mb-8 leading-tight tracking-tight"
          >
            <span className="font-extralight text-muted-foreground">Criamos</span>
            <br />
            <span className="bg-gradient-to-r from-senvia-400 via-primary to-accent bg-clip-text text-transparent font-medium">
              Experiências Digitais
            </span>
            <br />
            <span className="font-extralight text-muted-foreground">Excepcionais</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-4xl mx-auto leading-relaxed font-light"
          >
            Landing Pages de alta conversão, Funis de Vendas otimizados e Automações Empresariais 
            que transformam visitantes em clientes e processos em resultados.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
          >
            <Button
              size="lg"
              onClick={scrollToContact}
              className="group relative px-10 py-4 bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 text-black font-medium text-lg border border-senvia-400/20 shadow-lg hover:shadow-senvia-400/20"
            >
              <span className="relative z-10 flex items-center gap-3">
                Iniciar Projeto
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="px-10 py-4 border-senvia-400/20 text-senvia-400 hover:bg-senvia-400/5 text-lg font-light backdrop-blur-sm"
            >
              Ver Portfolio
            </Button>
          </motion.div>

          {/* Core Services Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {[
              { 
                icon: Globe, 
                title: "Landing Pages", 
                desc: "Design premium focado em conversão"
              },
              { 
                icon: TrendingUp, 
                title: "Funis de Vendas", 
                desc: "Estratégias otimizadas para resultados"
              },
              { 
                icon: Zap, 
                title: "Automações", 
                desc: "Processos inteligentes e eficientes"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                className="group p-8 rounded-3xl bg-card/20 border border-senvia-500/10 backdrop-blur-sm hover:border-senvia-400/30 transition-all duration-500"
              >
                <service.icon className="w-10 h-10 text-senvia-400 mb-6 mx-auto group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-medium text-xl mb-3 text-foreground">{service.title}</h3>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Minimal scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-0.5 h-12 bg-gradient-to-b from-senvia-400/50 to-transparent">
          <div className="w-0.5 h-3 bg-senvia-400 animate-pulse"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default ModernHeroSection;