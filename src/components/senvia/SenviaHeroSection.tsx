import { ArrowRight, Bot, Code2, Cpu, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

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

const SenviaHeroSection = () => {
  const handleCTA = () => window.open('https://app.senvia.pt/c/senvia-agency/formulario-lp', '_blank');
  const scrollToServices = () => document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20 aurora-bg">
      <div className="absolute inset-0 gradient-animate" />
      
      {/* Static blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 blob blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/8 blob blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6 shimmer">
              <Cpu className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary">AI Software House</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight mb-6">
              <span>Inteligência Artificial não é o futuro.</span>
              <br />
              <span className="gradient-text-animated inline-block pb-2 pr-1">
                É o agora.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              A <strong className="text-foreground">SENVIA</strong> é especializada em Inteligência Artificial e chegou para transformar a tua empresa. Software, automações e soluções digitais, tudo potenciado por IA.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button onClick={handleCTA} size="lg" className="group text-base px-8 py-6 bg-primary hover:bg-primary/90 glow-pulse relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Agendar Consultoria
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Button>
              <Button onClick={scrollToServices} size="lg" variant="outline" className="text-base px-8 py-6 border-primary/30 hover:bg-primary/10">
                Ver os Nossos Serviços
              </Button>
            </div>

            <div className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start">
              {[
                { value: 50, suffix: "+", label: "Projetos Entregues" },
                { value: 120, suffix: "+", label: "Automações Ativas" },
                { value: 95, suffix: "%", label: "Taxa de Satisfação" },
              ].map((stat, i) => (
                <div key={i} className="text-center lg:text-left cursor-default">
                  <p className="text-2xl font-bold text-foreground"><AnimatedCounter value={stat.value} suffix={stat.suffix} /></p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Static Orbiting Icons */}
          <div className="relative hidden lg:flex items-center justify-center animate-fade-in" style={{ minHeight: 500, animationDelay: '0.2s' }}>
            {/* Central element */}
            <div className="relative z-10 w-40 h-40 rounded-3xl bg-card border border-border glass-premium flex flex-col items-center justify-center">
              <img
                src="/lovable-uploads/bb92eb59-bee0-4023-b121-9bccea466ca8.png"
                alt="SENVIA"
                className="h-16 mb-2"
                width="64"
                height="64"
              />
              <span className="text-xs font-bold text-muted-foreground tracking-widest">AI SOFTWARE HOUSE</span>
            </div>

            {/* Service cards - static */}
            {[
              { icon: Code2, label: "Software", angle: 0, radius: 180 },
              { icon: Globe, label: "Websites", angle: 90, radius: 180 },
              { icon: Cpu, label: "Automação", angle: 180, radius: 180 },
              { icon: Bot, label: "Chatbots", angle: 270, radius: 180 },
            ].map((item) => {
              const rad = (item.angle * Math.PI) / 180;
              const xPos = Math.cos(rad) * item.radius;
              const yPos = Math.sin(rad) * item.radius;
              return (
                <div
                  key={item.label}
                  className="absolute flex flex-col items-center gap-2"
                  style={{ top: '50%', left: '50%', transform: `translate(${xPos - 32}px, ${yPos - 32}px)` }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-card/90 border border-primary/20 flex items-center justify-center backdrop-blur-md hover:scale-110 hover:border-primary transition-all duration-300">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{item.label}</span>
                </div>
              );
            })}

            {/* Connection circle - static SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <circle cx="50%" cy="50%" r="180" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" strokeDasharray="8 8" opacity="0.15" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SenviaHeroSection;
