import { ArrowRight, Code, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const ModernHeroSection = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-senvia-900/10">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-senvia-400 to-senvia-600 opacity-20 blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-accent to-primary opacity-20 blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent opacity-30 blur-lg animate-pulse delay-500"></div>
      
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-senvia-500/20 backdrop-blur-sm mb-8"
          >
            <Zap className="w-4 h-4 text-senvia-400" />
            <span className="text-sm text-muted-foreground">Tecnologia de próxima geração</span>
          </motion.div>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            Transformamos{" "}
            <span className="bg-gradient-to-r from-senvia-400 via-primary to-accent bg-clip-text text-transparent">
              ideias
            </span>{" "}
            em{" "}
            <span className="bg-gradient-to-r from-accent via-primary to-senvia-400 bg-clip-text text-transparent">
              soluções digitais
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Desenvolvimento de software sob medida, automação inteligente e estratégias digitais 
            que impulsionam o crescimento do seu negócio com tecnologia de ponta.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button
              size="lg"
              onClick={scrollToContact}
              className="group relative px-8 py-4 bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 text-black font-semibold text-lg overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Começar projeto
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-senvia-400 to-senvia-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 border-senvia-400/30 text-senvia-400 hover:bg-senvia-400/10 text-lg"
            >
              Ver portfólio
            </Button>
          </motion.div>

          {/* Features preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: Code, title: "Desenvolvimento", desc: "Soluções sob medida" },
              { icon: Zap, title: "Automação", desc: "Processos inteligentes" },
              { icon: Target, title: "Estratégia", desc: "Resultados mensuráveis" }
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-card/30 border border-senvia-500/20 backdrop-blur-sm hover:bg-card/50 transition-all duration-300"
              >
                <feature.icon className="w-8 h-8 text-senvia-400 mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-senvia-400/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-senvia-400 rounded-full mt-2 animate-bounce"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default ModernHeroSection;