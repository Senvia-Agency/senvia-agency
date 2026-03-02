import { Brain, Zap, Users, HeadsetIcon } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const differentials = [
  { icon: Brain, title: "IA em Tudo", desc: "Inteligência Artificial integrada em cada solução que construímos. Não é um add-on — é o DNA do nosso trabalho.", stat: "100%", statLabel: "AI-powered" },
  { icon: Zap, title: "Entrega Rápida", desc: "Semanas, não meses. A nossa stack moderna e metodologia ágil permitem entregas até 5x mais rápidas que o tradicional.", stat: "5x", statLabel: "Mais rápido" },
  { icon: Users, title: "Equipa Dedicada", desc: "Cada projeto tem uma equipa focada. Nada de recursos partilhados ou atenção diluída. O seu projeto é a nossa prioridade.", stat: "1:1", statLabel: "Foco total" },
  { icon: HeadsetIcon, title: "Suporte Contínuo", desc: "O nosso trabalho não acaba na entrega. Suporte pós-projeto, monitorização e evolução contínua do seu sistema.", stat: "24h", statLabel: "Tempo de resposta" },
];

const SenviaWhyUsSection = () => {
  const { ref, isIntersecting: isInView } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section id="porque-nos" className="py-24 md:py-32 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 aurora-bg" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className={`text-center mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-4">
            Porque a SENVIA
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            O que nos torna <span className="gradient-text-animated">diferentes</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Não somos mais uma software house. Somos engenheiros que pensam como empresários.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {differentials.map((item, i) => (
            <div
              key={item.title}
              className={`relative p-8 rounded-2xl border border-border bg-card/50 glass-premium hover:border-primary/30 transition-all duration-500 cursor-default group text-center hover:-translate-y-2 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${100 + i * 100}ms` }}
            >
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 mx-auto group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>

                <p className="text-3xl font-bold gradient-text-animated mb-1">{item.stat}</p>
                <p className="text-xs text-muted-foreground mb-4">{item.statLabel}</p>

                <h3 className="text-lg font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SenviaWhyUsSection;
