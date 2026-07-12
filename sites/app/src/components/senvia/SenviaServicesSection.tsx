import { Code2, Globe, Cpu, Rocket, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { getAppUrl } from '@/utils/getSignupUrl';

const services = [
  {
    icon: Code2,
    title: "Desenvolvimento de Software à Medida",
    desc: "Sistemas de gestão interna, portais de clientes e aplicações específicas para o seu processo. Nós construímos o motor que a sua empresa precisa.",
    features: ["Sistemas de Gestão", "Portais & Dashboards", "APIs & Integrações", "Apps Web Complexas"],
    cta: "Saber Mais",
    link: "/softwares",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Globe,
    title: "Sites, Landing Pages & E-commerces",
    desc: "Plataformas robustas, rápidas e desenhadas para converter cliques em dinheiro. Design premium com performance de topo.",
    features: ["Sites Institucionais", "Landing Pages de Alta Conversão", "Lojas Online", "Otimização SEO"],
    cta: "Saber Mais",
    link: "/sites",
    gradient: "from-emerald-500/20 to-green-500/20",
  },
  {
    icon: Cpu,
    title: "Automação de Processos com IA",
    desc: "Conectamos os seus sistemas. De chatbots inteligentes a integrações complexas que poupam centenas de horas humanas.",
    features: ["Chatbots com IA", "Workflows Automáticos", "Integrações de Sistemas", "Relatórios Inteligentes"],
    cta: "Saber Mais",
    link: "/chatbots",
    gradient: "from-purple-500/20 to-violet-500/20",
  },
  {
    icon: Rocket,
    title: "SENVIA OS — CRM com IA",
    desc: "O nosso produto proprietário. Um CRM completo com módulos de Leads, Clientes, Vendas, Financeiro, Marketing e muito mais. Com Inteligência Artificial integrada.",
    features: ["CRM Completo", "IA Integrada", "Automações", "Multi-Nicho"],
    cta: "Conhecer o SENVIA OS",
    link: "/senvia-os",
    gradient: "from-primary/20 to-accent/20",
    highlight: true,
  },
];

const SenviaServicesSection = () => {
  const { ref, isIntersecting: isInView } = useIntersectionObserver({ threshold: 0.1 });

  const handleCTA = () => window.open(getAppUrl('/c/senvia-agency/formulario-lp'), '_blank');

  return (
    <section id="servicos" className="py-24 md:py-32 relative overflow-hidden bg-background" ref={ref}>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className={`text-center mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-4">
            O que fazemos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Engenharia de Software <span className="gradient-text-animated">com IA</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Da ideia à produção. Construímos soluções digitais completas que transformam a operação do seu negócio.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {services.map((service, i) => (
            <div
              key={service.title}
              className={`relative p-8 rounded-2xl border bg-gradient-to-br ${service.gradient} backdrop-blur-sm transition-all duration-500 group cursor-default hover:-translate-y-2 ${
                service.highlight ? 'border-primary/40 ring-1 ring-primary/20' : 'border-border hover:border-primary/30'
              } ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${150 + i * 100}ms` }}
            >
              {service.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-xs font-bold text-primary-foreground">
                  Produto Próprio
                </div>
              )}

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{service.desc}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {service.features.map((f) => (
                    <span key={f} className="text-xs px-3 py-1 rounded-full bg-muted/50 text-muted-foreground border border-border/50">
                      {f}
                    </span>
                  ))}
                </div>

                {service.link ? (
                  <Link to={service.link}>
                    <Button variant="outline" size="sm" className="group/btn border-primary/30 hover:bg-primary/10">
                      {service.cta}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleCTA} className="group/btn border-primary/30 hover:bg-primary/10">
                    {service.cta}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SenviaServicesSection;
