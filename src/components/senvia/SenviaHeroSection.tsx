import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Code2, Cpu, Globe, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';

const AnimatedCounter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count}{suffix}</span>;
};

const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 4 + 2, duration: Math.random() * 10 + 10, delay: Math.random() * 5,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full bg-primary/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -80, 0], opacity: [0, 0.8, 0], scale: [0, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

const OrbitingIcon = ({ icon: Icon, delay, radius, duration }: { icon: any; delay: number; radius: number; duration: number }) => (
  <motion.div
    className="absolute w-12 h-12 rounded-xl bg-card/80 border border-border/50 flex items-center justify-center backdrop-blur-sm"
    style={{ top: '50%', left: '50%' }}
    animate={{
      x: [radius * Math.cos(0), radius * Math.cos(Math.PI / 2), radius * Math.cos(Math.PI), radius * Math.cos(3 * Math.PI / 2), radius * Math.cos(0)],
      y: [radius * Math.sin(0), radius * Math.sin(Math.PI / 2), radius * Math.sin(Math.PI), radius * Math.sin(3 * Math.PI / 2), radius * Math.sin(0)],
      rotate: [0, 360],
    }}
    transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
  >
    <Icon className="w-5 h-5 text-primary" />
  </motion.div>
);

const SenviaHeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const y = useSpring(mouseY, { damping: 25, stiffness: 150 });
  const rotateX = useTransform(y, [-300, 300], [3, -3]);
  const rotateY = useTransform(x, [-300, 300], [-3, 3]);

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

  const handleCTA = () => window.open('https://app.senvia.pt/c/senvia-agency/formulario-lp', '_blank');
  const scrollToServices = () => document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' });

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
      <motion.div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 blob blur-3xl"
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/8 blob blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], x: [0, -40, 0], y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10" ref={containerRef}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center lg:text-left">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6 shimmer">
              <Cpu className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary">AI Software House</span>
            </motion.div>

            <motion.h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
              <span>Construímos o</span>
              <br />
              <motion.span className="gradient-text-animated inline-block" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                Futuro Digital.
              </motion.span>
            </motion.h1>

            <motion.p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              Software à medida, automações inteligentes e o nosso CRM proprietário — <strong className="text-foreground">SENVIA OS</strong>. Tudo potenciado por Inteligência Artificial para escalar o seu negócio.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={handleCTA} size="lg" className="group text-base px-8 py-6 bg-primary hover:bg-primary/90 glow-pulse relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Falar com Especialista
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={scrollToServices} size="lg" variant="outline" className="text-base px-8 py-6 border-primary/30 hover:bg-primary/10">
                  Ver os Nossos Serviços
                </Button>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
              className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start">
              {[
                { value: 50, suffix: "+", label: "Projetos Entregues" },
                { value: 120, suffix: "+", label: "Automações Ativas" },
                { value: 95, suffix: "%", label: "Taxa de Satisfação" },
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + i * 0.2 }} whileHover={{ scale: 1.1, y: -5 }} className="text-center lg:text-left cursor-default">
                  <p className="text-2xl font-bold text-foreground"><AnimatedCounter value={stat.value} suffix={stat.suffix} /></p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Orbiting Icons Visual */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
            className="relative hidden lg:flex items-center justify-center" style={{ perspective: 1000, minHeight: 500 }}>
            <motion.div style={{ rotateX, rotateY }} className="relative w-full h-full flex items-center justify-center">
              {/* Central element */}
              <motion.div 
                className="relative z-10 w-40 h-40 rounded-3xl bg-card border border-border glass-premium flex flex-col items-center justify-center"
                animate={{ boxShadow: ['0 0 30px hsl(var(--primary) / 0.1)', '0 0 60px hsl(var(--primary) / 0.2)', '0 0 30px hsl(var(--primary) / 0.1)'] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <motion.img
                  src="/lovable-uploads/bb92eb59-bee0-4023-b121-9bccea466ca8.png"
                  alt="SENVIA"
                  className="h-16 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <span className="text-xs font-bold text-muted-foreground tracking-widest">AI SOFTWARE HOUSE</span>
              </motion.div>

              {/* Orbiting service cards */}
              {[
                { icon: Code2, label: "Software", angle: 0, radius: 180 },
                { icon: Globe, label: "Websites", angle: 90, radius: 180 },
                { icon: Cpu, label: "Automação", angle: 180, radius: 180 },
                { icon: Rocket, label: "SENVIA OS", angle: 270, radius: 180 },
              ].map((item, i) => {
                const rad = (item.angle * Math.PI) / 180;
                const xPos = Math.cos(rad) * item.radius;
                const yPos = Math.sin(rad) * item.radius;
                return (
                  <motion.div
                    key={item.label}
                    className="absolute flex flex-col items-center gap-2"
                    style={{ top: '50%', left: '50%' }}
                    initial={{ x: xPos - 32, y: yPos - 32, opacity: 0 }}
                    animate={{ 
                      x: xPos - 32, y: yPos - 32, opacity: 1,
                    }}
                    transition={{ delay: 1 + i * 0.2, duration: 0.6 }}
                  >
                    <motion.div
                      className="w-16 h-16 rounded-2xl bg-card/90 border border-primary/20 flex items-center justify-center backdrop-blur-md"
                      whileHover={{ scale: 1.2, borderColor: 'hsl(var(--primary))' }}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <item.icon className="w-7 h-7 text-primary" />
                    </motion.div>
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{item.label}</span>
                  </motion.div>
                );
              })}

              {/* Connection lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <motion.circle cx="50%" cy="50%" r="180" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" strokeDasharray="8 8" opacity="0.15"
                  animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: '50% 50%' }}
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SenviaHeroSection;
