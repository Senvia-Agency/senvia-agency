import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Flame, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
      if (current >= numericValue) { setCount(numericValue); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [numericValue]);

  return <span>{prefix}{count}{suffix}</span>;
};

const FloatingParticles = () => {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 4 + 2, duration: Math.random() * 10 + 10, delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full bg-primary/30"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -100, 0], x: [0, Math.random() * 50 - 25, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

const Hero2Section = () => {
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
        mouseX.set(e.clientX - (rect.left + rect.width / 2));
        mouseY.set(e.clientY - (rect.top + rect.height / 2));
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToContact = () => {
    document.getElementById('software-house')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20 aurora-bg">
      <div className="absolute inset-0 gradient-animate" />
      <FloatingParticles />
      <motion.div className="absolute inset-0 opacity-[0.03]"
        animate={{ backgroundPosition: ['0px 0px', '60px 60px'] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`, backgroundSize: '60px 60px' }}
      />

      {/* Blobs */}
      <motion.div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blob blur-3xl"
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 blob blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], x: [0, -40, 0], y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10" ref={containerRef}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center lg:text-left">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6 shimmer">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary">AI Software House</span>
            </motion.div>

            <motion.h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
              <span>Software Inteligente.</span>
              <br />
              <motion.span className="gradient-text-animated inline-block" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                Resultados Reais.
              </motion.span>
            </motion.h1>

            <motion.p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              Eliminamos curiosos do seu funil, automatizamos as suas vendas e construímos software à medida. O <strong className="text-primary text-glow-pulse">SENVIA OS</strong> é o CRM com IA que a sua empresa precisa.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={scrollToPricing} size="lg" className="group text-base px-8 py-6 bg-primary hover:bg-primary/90 glow-pulse relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Começar Teste Grátis
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={scrollToContact} size="lg" variant="outline" className="text-base px-8 py-6 border-primary/30 hover:bg-primary/10">
                  Falar com Especialista
                </Button>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
              className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start">
              {[
                { value: "+50", suffix: "", label: "Projetos Entregues" },
                { value: "+90", suffix: "%", label: "Taxa de Satisfação" },
                { value: "24", suffix: "h", label: "Suporte Dedicado" },
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + i * 0.2 }} whileHover={{ scale: 1.1, y: -5 }} className="text-center lg:text-left cursor-default">
                  <p className="text-2xl font-bold text-foreground"><AnimatedCounter value={stat.value} suffix={stat.suffix} /></p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Dashboard Mockup */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
            className="relative" style={{ perspective: 1000 }}>
            <motion.div style={{ rotateX, rotateY }} className="relative">
              <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden glass-premium floating">
                <div className="bg-muted/50 px-6 py-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div className="w-3 h-3 rounded-full bg-red-500" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                    <motion.div className="w-3 h-3 rounded-full bg-yellow-500" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} />
                    <motion.div className="w-3 h-3 rounded-full bg-green-500" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">SENVIA OS</span>
                </div>
                <div className="p-6 space-y-4">
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, type: "spring" }}>
                    <motion.div animate={{ boxShadow: ['0 0 0 0 rgba(34,197,94,0.4)', '0 0 0 15px rgba(34,197,94,0)', '0 0 0 0 rgba(34,197,94,0)'] }}
                      transition={{ duration: 2, repeat: Infinity }} className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <motion.div className="bg-green-500 rounded-full p-2" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, delay: 2, repeat: Infinity, repeatDelay: 3 }}>
                          <Flame className="h-5 w-5 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-foreground">Novo Lead Qualificado</span>
                            <motion.span className="text-xs text-muted-foreground" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>Agora</motion.span>
                          </div>
                          <p className="text-sm text-foreground mb-2">João Silva — Clínica Dental Plus</p>
                          <motion.span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full font-medium" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}>🔥 Quente</motion.span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 47, label: "Leads Mês", color: "text-primary" },
                      { value: 32, label: "Qualificados", color: "text-green-500" },
                      { value: 82, label: "Conversão", color: "text-foreground", suffix: "%" },
                    ].map((stat, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.8 + i * 0.1 }} className="bg-muted/30 rounded-lg p-3 text-center">
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}{stat.suffix || ''}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              <motion.div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/30 rounded-full blur-3xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 4, repeat: Infinity }} />
              <motion.div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-3xl"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 5, repeat: Infinity }} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero2Section;
