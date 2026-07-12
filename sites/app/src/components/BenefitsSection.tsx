import { memo } from "react";
import { 
  Zap, 
  Shield, 
  TrendingUp, 
  Clock, 
  Users, 
  Smartphone,
  Globe,
  BarChart3
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const BenefitsSection = memo(() => {
  const sectionRef = useScrollAnimation(100);

  const benefits = [
    {
      icon: Zap,
      title: "Implementação Rápida",
      description: "Soluções implementadas rapidamente para que possas ver resultados o mais breve possível.",
      color: "text-yellow-400"
    },
    {
      icon: TrendingUp,
      title: "ROI Comprovado",
      description: "Estratégias focadas em resultados mensuráveis que garantem retorno sobre o investimento.",
      color: "text-green-400"
    },
    {
      icon: Shield,
      title: "Segurança Garantida",
      description: "Todas as nossas soluções seguem as melhores práticas de segurança e proteção de dados.",
      color: "text-blue-400"
    },
    {
      icon: Clock,
      title: "Suporte 24/7",
      description: "Equipa disponível para te ajudar sempre que precisares, garantindo continuidade do negócio.",
      color: "text-purple-400"
    },
    {
      icon: Users,
      title: "Equipa Especializada",
      description: "Profissionais experientes e certificados nas mais recentes tecnologias e estratégias.",
      color: "text-senvia-400"
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Todas as soluções são otimizadas para dispositivos móveis, garantindo melhor experiência.",
      color: "text-pink-400"
    },
    {
      icon: Globe,
      title: "Alcance Global",
      description: "Estratégias que te permitem expandir para novos mercados e audiências internacionais.",
      color: "text-cyan-400"
    },
    {
      icon: BarChart3,
      title: "Análise Detalhada",
      description: "Relatórios completos e análises profundas para tomares decisões baseadas em dados.",
      color: "text-orange-400"
    }
  ];

  const beforeAfter = [
    {
      category: "Visibilidade Online",
      before: "Presença digital limitada ou inexistente",
      after: "Presença forte e profissional em todas as plataformas"
    },
    {
      category: "Geração de Leads",
      before: "Dificuldade em captar novos clientes",
      after: "Sistema automatizado de captação e conversão"
    },
    {
      category: "Vendas Online",
      before: "Vendas dependentes apenas de contacto direto",
      after: "E-commerce otimizado com vendas 24/7"
    },
    {
      category: "Atendimento",
      before: "Atendimento manual e limitado por horários",
      after: "Chatbots inteligentes e atendimento automatizado"
    }
  ];

  return (
    <section id="beneficios" ref={sectionRef} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-on-scroll">
            <span className="text-gradient">Benefícios Únicos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-on-scroll">
            Descobre como as nossas soluções podem transformar o teu negócio e levá-lo ao próximo nível digital.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-senvia-500/50 transition-all duration-300 group animate-on-scroll"
            >
              <div className="bg-senvia-500/10 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-senvia-500/20 transition-colors duration-300">
                <benefit.icon className={`h-8 w-8 ${benefit.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Before vs After */}
        <div className="bg-card/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-border/50">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 animate-on-scroll">
              <span className="text-gradient">Transformação do Teu Negócio</span>
            </h3>
            <p className="text-lg text-muted-foreground animate-on-scroll">
              Vê como o teu negócio pode evoluir com as nossas soluções
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Before */}
            <div className="animate-on-scroll">
              <div className="bg-red-500/10 rounded-2xl p-6 border border-red-500/20">
                <h4 className="text-xl font-semibold mb-6 text-red-400 text-center">❌ Antes</h4>
                <div className="space-y-4">
                  {beforeAfter.map((item, index) => (
                    <div key={index} className="bg-background/50 rounded-lg p-4">
                      <div className="font-medium text-sm text-muted-foreground mb-1">{item.category}</div>
                      <div className="text-sm text-foreground">{item.before}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* After */}
            <div className="animate-on-scroll">
              <div className="bg-green-500/10 rounded-2xl p-6 border border-green-500/20">
                <h4 className="text-xl font-semibold mb-6 text-green-400 text-center">✅ Depois</h4>
                <div className="space-y-4">
                  {beforeAfter.map((item, index) => (
                    <div key={index} className="bg-background/50 rounded-lg p-4">
                      <div className="font-medium text-sm text-muted-foreground mb-1">{item.category}</div>
                      <div className="text-sm text-foreground">{item.after}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

BenefitsSection.displayName = 'BenefitsSection';

export default BenefitsSection;