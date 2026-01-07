
import { Brain, Zap, Cog, Smartphone, Gauge, Search, Database, Bot, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FeaturesSection = () => {
  const features = [
    {
      number: "01",
      icon: Brain,
      title: "Engenharia de Persuasão (Neuromarketing)",
      description: "Não adivinhamos; aplicamos ciência. Cada título, cor de botão e bloco de texto é posicionado estrategicamente para guiar o olho do visitante e destruir objeções antes que elas surjam. Copywriting agressivo focado numa única coisa: Ação.",
      highlights: ["Psicologia de vendas", "Copywriting persuasivo", "Destruição de objeções"]
    },
    {
      number: "02",
      icon: Zap,
      title: "Performance de Elite (Tech Stack)",
      description: "Desenvolvemos em ambientes low-code ou custom code de ultra-velocidade.",
      highlights: [
        { icon: Smartphone, text: "Mobile-First (perfeito em qualquer telemóvel)" },
        { icon: Gauge, text: "Carregamento instantâneo (< 1.5s)" },
        { icon: Search, text: "SEO Técnico integrado na raiz" }
      ]
    },
    {
      number: "03",
      icon: Cog,
      title: "O \"Backstage\" de Automação (O Nosso Segredo)",
      description: "Aqui é onde nos distanciamos de 99% do mercado. A sua página vem ligada a um cérebro digital:",
      highlights: [
        { icon: Database, text: "CRM Integrado: O lead cai na página e entra automaticamente no seu pipeline de vendas." },
        { icon: Bot, text: "Agentes de IA & Automação: O lead preencheu o formulário? Recebe um WhatsApp imediato, um email personalizado e entra numa sequência de nutrição. Sem você levantar um dedo." },
        { icon: Target, text: "Rastreio Total: Saiba exatamente de onde veio a venda. Acabaram-se os palpites." }
      ]
    }
  ];

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight">
            Bem-vindo à Era das{" "}
            <span className="text-gradient">Landing Pages Inteligentes</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Na SENVIA, não somos apenas designers. Somos <strong className="text-foreground">Arquitetos de Conversão</strong>. A nossa "Landing Page" é, na verdade, a ponta do iceberg de um sistema complexo desenhado para vender.
          </p>
        </div>

        <div className="mb-8 text-center">
          <p className="text-lg md:text-xl font-semibold text-senvia-400">
            O que está "debaixo do capô" da nossa entrega:
          </p>
        </div>

        <div className="space-y-6 md:space-y-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-senvia-500/50 transition-all duration-300 overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <span className="text-4xl md:text-5xl font-bold text-senvia-500/30">{feature.number}</span>
                    </div>
                    <div className="bg-senvia-500/10 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-6 w-6 md:h-8 md:w-8 text-senvia-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{feature.title}</h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-4">{feature.description}</p>
                    
                    <div className="space-y-2">
                      {feature.highlights.map((highlight, hIndex) => (
                        <div key={hIndex} className="flex items-start gap-2">
                          {typeof highlight === 'string' ? (
                            <>
                              <span className="text-senvia-400 mt-1">✓</span>
                              <span className="text-sm md:text-base text-foreground/80">{highlight}</span>
                            </>
                          ) : (
                            <>
                              <highlight.icon className="h-5 w-5 text-senvia-400 mt-0.5 flex-shrink-0" />
                              <span className="text-sm md:text-base text-foreground/80">{highlight.text}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
