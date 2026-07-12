import { ArrowRight, Play, TrendingUp, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const RevolutionHeroSection = () => {
  const scrollToContact = () => {
    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="revolução" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container mx-auto px-6 text-center z-10 relative pt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto"
        >
          {/* Revolucionário Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm mb-12"
          >
            <Zap className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-primary font-bold text-lg tracking-wide">REVOLUÇÃO DIGITAL 2024</span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mb-10"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none">
              <span className="block text-foreground mb-4">
                A MÁQUINA
              </span>
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                DE GERAR
              </span>
              <span className="block text-foreground">
                CLIENTES
              </span>
            </h1>
            <div className="text-2xl md:text-4xl text-muted-foreground font-light mt-6 max-w-4xl mx-auto">
              Que transforma <span className="text-primary font-bold">visitantes anônimos</span> em 
              <span className="text-accent font-bold"> clientes pagantes</span> automaticamente
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mb-12"
          >
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-black text-primary mb-3">847%</div>
              <div className="text-muted-foreground font-medium">ROI MÉDIO</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-black text-accent mb-3">2.4M</div>
              <div className="text-muted-foreground font-medium">LEADS GERADOS</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-black text-primary mb-3">365</div>
              <div className="text-muted-foreground font-medium">DIAS/ANO ATIVO</div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Button
                size="lg"
                onClick={scrollToContact}
                className="group relative px-16 py-8 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-2xl rounded-2xl shadow-2xl hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-4">
                  ATIVAR MÁQUINA
                  <ArrowRight className="w-8 h-8 transition-transform group-hover:translate-x-3" />
                </span>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="group px-12 py-8 text-xl font-bold border-2 border-foreground/20 hover:border-primary rounded-2xl transition-all duration-300"
              >
                <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                VER DEMONSTRAÇÃO
              </Button>
            </div>
            
            <div className="text-muted-foreground font-medium text-lg">
              ✅ Setup em 24h • ✅ Sem pagamentos antecipados • ✅ Garantia total
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto"
          >
            {[
              { icon: TrendingUp, title: "Crescimento Garantido", desc: "847% ROI médio comprovado" },
              { icon: Users, title: "2.400+ Empresas", desc: "Já usam nossa tecnologia" },
              { icon: Zap, title: "Implementação Express", desc: "Online em menos de 24 horas" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 + index * 0.2 }}
                className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105"
              >
                <item.icon className="w-12 h-12 text-primary mb-6 mx-auto" />
                <div className="text-foreground font-bold mb-3 text-xl">{item.title}</div>
                <div className="text-muted-foreground">{item.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default RevolutionHeroSection;