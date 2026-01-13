import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = '' }: { value: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const prefix = value.replace(/[0-9]/g, '').replace(suffix, '');
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [numericValue]);
  
  return <span>{prefix}{count}{suffix}</span>;
};

// Floating Particles Component
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  
  const rotateX = useTransform(y, [-300, 300], [5, -5]);
  const rotateY = useTransform(x, [-300, 300], [-5, 5]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handleCTA = () => {
    window.open('https://app.senvia.pt/c/senvia-agency/formulario-lp', '_blank');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20 aurora-bg">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-animate" />
      
      {/* Floating particles */}
      <FloatingParticles />
      
      {/* Animated grid pattern */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03]"
        animate={{
          backgroundPosition: ['0px 0px', '60px 60px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Morphing blobs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blob blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 blob blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10" ref={containerRef}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6 shimmer"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary">Landing Pages + IA</span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Só fale com quem
              </motion.span>
              <br />
              <motion.span 
                className="gradient-text-animated inline-block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                quer comprar.
              </motion.span>
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              Chega de leads frios. A <strong className="text-primary text-glow-pulse">SENVIA</strong> cria o seu funil de vendas e integra inteligência artificial para filtrar os curiosos. <strong className="text-foreground">A sua equipa só recebe oportunidades reais.</strong>
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleCTA}
                  size="lg"
                  className="group text-base px-8 py-6 bg-primary hover:bg-primary/90 glow-pulse relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Quero uma Máquina de Vendas
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Quick stats with counter animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start"
            >
              {[
                { value: "+90", suffix: "%", label: "Taxa de Qualificação" },
                { value: "-70", suffix: "%", label: "Tempo Perdido" },
                { value: "24", suffix: "h", label: "Resposta Automática" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + index * 0.2, duration: 0.5 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="text-center lg:text-left cursor-default"
                >
                  <p className="text-2xl font-bold text-foreground">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Visual Mockup with 3D effect */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="relative perspective-1000"
            style={{ perspective: 1000 }}
          >
            <motion.div
              style={{ rotateX, rotateY }}
              className="relative"
            >
              {/* SENVIA OS Dashboard Mockup */}
              <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden glass-premium floating">
                {/* Dashboard Header */}
                <div className="bg-muted/50 px-6 py-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-red-500"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-yellow-500"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    />
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-green-500"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">SENVIA OS</span>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 space-y-4">
                  {/* Notification - Animated */}
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 1.5, duration: 0.6, type: "spring" }}
                    className="relative"
                  >
                    <motion.div
                      animate={{ 
                        boxShadow: [
                          '0 0 0 0 rgba(34, 197, 94, 0.4)', 
                          '0 0 0 15px rgba(34, 197, 94, 0)', 
                          '0 0 0 0 rgba(34, 197, 94, 0)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-4">
                        <motion.div 
                          className="bg-green-500 rounded-full p-2"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5, delay: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                          <Flame className="h-5 w-5 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-foreground">Novo Lead</span>
                            <motion.span 
                              className="text-xs text-muted-foreground"
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              Agora
                            </motion.span>
                          </div>
                          <p className="text-sm text-foreground mb-2">João Silva</p>
                          <div className="flex items-center gap-2">
                            <motion.span 
                              className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full font-medium"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              🔥 Quente
                            </motion.span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 23, label: "Leads Hoje", color: "text-primary" },
                      { value: 18, label: "Quentes", color: "text-green-500" },
                      { value: 78, label: "Conversão", color: "text-foreground", suffix: "%" },
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.8 + index * 0.1, duration: 0.4 }}
                        whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--muted) / 0.5)" }}
                        className="bg-muted/30 rounded-lg p-3 text-center transition-colors cursor-default"
                      >
                        <p className={`text-2xl font-bold ${stat.color}`}>
                          {stat.value}{stat.suffix || ''}
                        </p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent Leads List */}
                  <div className="space-y-2">
                    {[
                      { initials: "MS", name: "Maria Santos", status: "Morno", statusColor: "bg-yellow-500/20 text-yellow-400" },
                      { initials: "PC", name: "Pedro Costa", status: "Frio", statusColor: "bg-blue-500/20 text-blue-400" },
                    ].map((lead, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2.2 + index * 0.15, duration: 0.4 }}
                        whileHover={{ x: 5, backgroundColor: "hsl(var(--muted) / 0.4)" }}
                        className="flex items-center justify-between p-3 bg-muted/20 rounded-lg transition-all cursor-default"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${index === 0 ? 'bg-primary/20' : 'bg-blue-500/20'} flex items-center justify-center text-xs font-medium ${index === 0 ? 'text-primary' : 'text-blue-400'}`}>
                            {lead.initials}
                          </div>
                          <span className="text-sm text-foreground">{lead.name}</span>
                        </div>
                        <span className={`text-xs ${lead.statusColor} px-2 py-1 rounded-full`}>{lead.status}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <motion.div 
                className="absolute -top-4 -right-4 w-24 h-24 bg-primary/30 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div 
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />

              {/* Orbiting elements */}
              <motion.div
                className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full shadow-lg"
                animate={{
                  x: [0, 20, 0, -20, 0],
                  y: [0, -20, 0, 20, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ boxShadow: '0 0 20px hsl(var(--primary))' }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2"
        >
          <motion.div 
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
