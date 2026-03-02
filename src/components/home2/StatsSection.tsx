import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const AnimatedNumber = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const stats = [
  { value: 50, suffix: "+", label: "Projetos Entregues" },
  { value: 120, suffix: "+", label: "Automações Ativas" },
  { value: 95, suffix: "%", label: "Satisfação dos Clientes" },
  { value: 10000, suffix: "+", label: "Leads Processados" },
];

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-28 relative overflow-hidden border-y border-border" ref={ref}>
      <div className="absolute inset-0 gradient-animate opacity-50" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={stat.label}
              className={`text-center cursor-default transition-all duration-500 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <p className="text-4xl md:text-5xl font-bold gradient-text-animated mb-2">
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm md:text-base text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
