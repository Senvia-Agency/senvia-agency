import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Mail, Target, BarChart } from "lucide-react";

const AutomationShowcase = () => {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const benefits = [
    {
      title: "Captação Automática",
      description: "Página + formulário que converte 24/7",
      icon: Users,
      result: "Mais leads qualificados"
    },
    {
      title: "CRM Integrado", 
      description: "Organiza todos os contatos automaticamente",
      icon: Target,
      result: "Zero leads perdidos"
    },
    {
      title: "E-mails Automáticos",
      description: "Sequência de nutrição sem trabalho manual",
      icon: Mail,
      result: "Relacionamento escalável"
    },
    {
      title: "Relatórios Claros",
      description: "Veja exatamente o que está funcionando",
      icon: BarChart,
      result: "Decisões baseadas em dados"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-secondary via-card to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary px-4 py-2 border border-primary/20">
            Como Funciona
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Automação Que
            <span className="text-gradient glow"> Realmente Funciona</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Enquanto você dorme, nossa automação capta leads, organiza no CRM e nutre automaticamente.
          </p>
          
          <Button 
            onClick={scrollToPricing}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 glow-box"
          >
            Quero Isso Agora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card 
                key={index}
                className="glass-effect border-border hover:border-primary/50 transition-all duration-300 card-hover"
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{benefit.description}</p>
                    <div className="inline-block bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-medium">
                      {benefit.result}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Card className="glass-effect border-primary/30 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Resultado: <span className="text-primary">Mais tempo para vender</span>
              </h3>
              <p className="text-muted-foreground mb-4">
                Pare de perder tempo com tarefas manuais. Nossa automação cuida de tudo enquanto você foca no que importa: fechar negócios.
              </p>
              <Button 
                onClick={scrollToPricing}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Ver Planos Disponíveis
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AutomationShowcase;