import { useState } from "react";
import { Check, Star, Zap, Crown } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const PacPackagesSection = () => {
  const [showPricing, setShowPricing] = useState(false);

  const packages = [
    {
      name: "PAC Core",
      subtitle: "Essencial para começar",
      icon: Star,
      features: [
        "Landing page com 3 seções otimizadas",
        "Copy focado em conversão",
        "Design responsivo profissional",
        "Integração com Google Analytics",
        "1 formulário de captação",
        "Suporte por 30 dias"
      ],
      price: 690,
      popular: false,
      description: "Ideal para validar e testar o mercado"
    },
    {
      name: "PAC Growth",
      subtitle: "Recomendado para crescimento",
      icon: Zap,
      features: [
        "Landing page com 5 seções + A/B test",
        "Copy psicológico avançado",
        "Design premium otimizado",
        "Calculadora ROI personalizada",
        "Automação de email marketing",
        "Integração CRM + Analytics",
        "2 variações para teste",
        "Suporte por 60 dias",
        "Garantia de 20% aumento CR"
      ],
      price: 1200,
      originalPrice: 1900,
      popular: true,
      description: "Para dobrar sua conversão em 30 dias"
    },
    {
      name: "PAC Scale",
      subtitle: "Sistema completo",
      icon: Crown,
      features: [
        "Tudo do PAC Growth +",
        "Página de checkout otimizada",
        "3 variações A/B simultâneas",
        "Funil de vendas completo",
        "Automação avançada (7 emails)",
        "Integração Stripe/PayPal",
        "Dashboard de métricas",
        "Consultoria estratégica mensal",
        "Suporte prioritário 90 dias"
      ],
      price: 2500,
      popular: false,
      description: "Para escalar vendas automaticamente"
    }
  ];

  const scrollToContact = () => {
    const contactSection = document.getElementById("cta-final");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {showPricing ? "Investimento vs Retorno" : "Sistema PAC Growth"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {showPricing 
                ? "Escolha o plano ideal para o seu nível de faturamento atual"
                : "Três níveis de implementação baseados no seu estágio de crescimento"
              }
            </p>
            
            {!showPricing && (
              <Button 
                onClick={() => setShowPricing(true)}
                variant="outline"
                className="mb-8"
              >
                Ver Investimento e Detalhes
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card 
                key={index}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  pkg.popular 
                    ? 'border-primary shadow-lg scale-105 bg-gradient-to-b from-background to-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-secondary text-white text-center py-2 text-sm font-semibold">
                    ⭐ MAIS ESCOLHIDO
                  </div>
                )}

                <CardHeader className={`text-center ${pkg.popular ? 'pt-12' : 'pt-6'}`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 mx-auto ${
                    pkg.popular ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    <pkg.icon className="w-8 h-8" />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {pkg.name}
                  </CardTitle>
                  
                  <p className="text-muted-foreground">
                    {pkg.subtitle}
                  </p>

                  {showPricing && (
                    <div className="mt-4">
                      {pkg.originalPrice && (
                        <div className="text-lg text-muted-foreground line-through">
                          €{pkg.originalPrice}
                        </div>
                      )}
                      <div className={`text-3xl font-bold ${
                        pkg.popular ? 'text-primary' : 'text-foreground'
                      }`}>
                        €{pkg.price}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        pagamento único
                      </div>
                    </div>
                  )}
                </CardHeader>

                <CardContent>
                  <p className="text-center text-sm text-muted-foreground mb-6">
                    {pkg.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                          pkg.popular ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={scrollToContact}
                    className={`w-full ${
                      pkg.popular
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                        : 'bg-background hover:bg-muted border border-border text-foreground'
                    }`}
                  >
                    {showPricing ? 'Falar com especialista' : 'Ver Detalhes'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {showPricing && (
            <div className="mt-12 text-center">
              <div className="inline-flex items-center px-6 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white">
                <div className="text-left">
                  <div className="font-bold text-lg">ROI Médio: 400-800% em 30 dias</div>
                  <div className="text-sm opacity-90">
                    Baseado em +50 implementações • Payback médio: 21 dias
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PacPackagesSection;