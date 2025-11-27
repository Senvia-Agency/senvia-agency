import { Bot, ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const PromoHero = () => {
  const scrollToForm = () => {
    document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent"></div>
      
      {/* Floating sparkles */}
      <motion.div
        className="absolute top-20 left-10 text-primary/30"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="h-8 w-8" />
      </motion.div>
      <motion.div
        className="absolute top-40 right-20 text-accent/30"
        animate={{ 
          y: [0, 20, 0],
          rotate: [360, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Sparkles className="h-6 w-6" />
      </motion.div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="px-6 py-2 bg-destructive/20 border border-destructive/50 rounded-full"
            >
              <span className="text-destructive font-bold">🔥 PROMOÇÃO LIMITADA - APENAS 5 VAGAS</span>
            </motion.div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            <span className="text-gradient">Agente IA</span> para o{" "}
            <br className="hidden md:block" />
            seu WhatsApp Business
          </motion.h1>

          {/* Robot Icon with enhanced animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              {/* Animated glow rings */}
              <motion.div
                className="absolute inset-0 bg-primary/30 blur-3xl rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute inset-0 bg-accent/20 blur-2xl rounded-full"
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              />
              
              {/* Robot container */}
              <motion.div
                className="relative bg-gradient-to-br from-primary/20 to-accent/20 p-8 rounded-3xl border border-primary/30 backdrop-blur-sm"
                animate={{ 
                  borderColor: ["hsl(var(--primary) / 0.3)", "hsl(var(--accent) / 0.5)", "hsl(var(--primary) / 0.3)"]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    y: [0, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Bot className="h-24 w-24 text-primary" />
                </motion.div>
                
                {/* Floating particles around robot */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-primary/40 rounded-full"
                    style={{
                      top: `${20 + i * 30}%`,
                      left: i % 2 === 0 ? '-10%' : '110%'
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Price */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <p className="text-muted-foreground mb-2">De €800 por apenas</p>
            <div className="flex items-center justify-center gap-4">
              <motion.span
                className="text-6xl md:text-7xl font-bold text-gradient"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                €500
              </motion.span>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Setup completo</p>
                <p className="text-xs text-muted-foreground">+ €50/mês servidor</p>
              </div>
            </div>
          </motion.div>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-6 mb-8"
          >
            {["Atendimento 24h", "Marcações automáticas", "Lembretes inteligentes"].map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  className="h-2 w-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
                <span className="text-foreground">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                size="lg"
                onClick={scrollToForm}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-primary/50 transition-all relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative">Garantir Minha Vaga</span>
                <ArrowDown className="ml-2 h-5 w-5 animate-bounce relative" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Urgency Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-sm text-muted-foreground mt-4"
          >
            ⏰ Oferta válida até <strong>18 de Dezembro de 2025</strong>
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default PromoHero;
