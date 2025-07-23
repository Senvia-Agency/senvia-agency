import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PricingFormModal from "./PricingFormModal";

const PricingSection = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlanInterest = (planName: string) => {
    setSelectedPlan(planName);
    setIsModalOpen(true);
  };

  const plans = [
    {
      name: "Starter",
      price: "397",
      period: "Pagamento único",
      description: "Página profissional + captação direta",
      features: [
        "Página de alta conversão",
        "Formulário → E-mail direto", 
        "Botão WhatsApp integrado",
        "GA4 configurado",
        "Hospedagem SSL incluída",
        "Entrega em 7 dias"
      ],
      icon: Zap,
      route: "/starter",
      popular: false
    },
    {
      name: "Pro", 
      price: "349",
      originalPrice: "697",
      period: "Setup + 50€/mês",
      description: "Página + CRM + E-mail automático",
      features: [
        "Tudo do Starter",
        "CRM integrado completo",
        "E-mail boas-vindas automático",
        "Organização total de leads",
        "Manutenção contínua",
        "Suporte prioritário",
        "Entrega em 15 dias"
      ],
      icon: Star,
      route: "/pro",
      popular: true
    },
    {
      name: "Premium",
      price: "1.197", 
      period: "Setup + 100€/mês",
      description: "Automação completa + integrações",
      features: [
        "Tudo do Pro",
        "Sequência 3 e-mails automáticos",
        "Integrações externas (3x)",
        "Fluxos pós-venda automáticos", 
        "Suporte VIP 24h",
        "Automação avançada",
        "Entrega em 18 dias"
      ],
      icon: Crown,
      route: "/premium",
      popular: false
    }
  ];

  return (
    <section id="pricing-section" className="py-16 bg-gradient-to-br from-senvia-500/5 via-background to-senvia-400/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            <span className="text-gradient">Planos SENVIA</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano ideal para seu negócio. Todos com setup profissional e resultados garantidos.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.name} 
                className={`relative overflow-hidden ${
                  plan.popular 
                    ? 'border-senvia-500 bg-card scale-105 shadow-lg shadow-senvia-500/20' 
                    : 'border-border bg-card/50'
                } backdrop-blur-xl hover:scale-105 transition-all duration-300`}
              >
                {plan.popular && (
                  <Badge className="absolute top-4 right-4 bg-senvia-500 text-black px-3 py-1">
                    Recomendado
                  </Badge>
                )}
                
                <CardHeader className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-senvia-500 flex items-center justify-center mx-auto">
                    <IconComponent className="h-6 w-6 text-black" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">{plan.name}</CardTitle>
                   <div className="space-y-1">
                     {plan.originalPrice ? (
                       <div className="space-y-1">
                         <div className="text-lg text-muted-foreground line-through text-center">
                           {plan.originalPrice}€
                         </div>
                         <div className="flex items-center justify-center gap-2">
                           <span className="text-3xl font-bold text-senvia-500">
                             {plan.price}€
                           </span>
                           <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                             -50%
                           </Badge>
                         </div>
                       </div>
                     ) : (
                       <div className="text-3xl font-bold text-senvia-500">
                         {plan.price}€
                       </div>
                     )}
                     <p className="text-muted-foreground text-sm">{plan.period}</p>
                   </div>
                  <p className="text-foreground text-sm">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-senvia-400 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-2">
                    <Button 
                      onClick={() => navigate(plan.route)}
                      className={`w-full py-2 ${
                        plan.popular
                          ? 'bg-senvia-500 hover:bg-senvia-400 text-black'
                          : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                      }`}
                    >
                      Ver Detalhes
                    </Button>
                    
                    <Button 
                      onClick={() => handlePlanInterest(plan.name)}
                      variant="outline"
                      className="w-full py-2 border-senvia-500 text-senvia-500 hover:bg-senvia-500 hover:text-black"
                    >
                      Falar com especialista
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Hospedagem SSL, RGPD e suporte incluídos. Sem taxas ocultas.
          </p>
        </div>
      </div>
      
      <PricingFormModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        planName={selectedPlan}
      />
    </section>
  );
};

export default PricingSection;