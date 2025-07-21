import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Check, Clock, DollarSign, Users, Zap } from "lucide-react";

const ValueProposition = () => {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const comparisons = [
    {
      category: "Captação de Leads",
      without: "Planilhas, leads perdidos, caos",
      with: "CRM automático, zero perda",
      icon: Users
    },
    {
      category: "Tempo de Setup", 
      without: "Meses de desenvolvimento",
      with: "7-18 dias funcionando",
      icon: Clock
    },
    {
      category: "Investimento",
      without: "€5.000+ só em desenvolvimento",
      with: "A partir de €397 completo",
      icon: DollarSign
    },
    {
      category: "Manutenção",
      without: "Problemas constantes, sem suporte",
      with: "Manutenção inclusa, suporte garantido",
      icon: Zap
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-background to-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-destructive/10 text-destructive px-4 py-2 border border-destructive/20">
            Compare Você Mesmo
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Fazer Interno vs
            <span className="text-gradient glow"> SENVIA</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Por que criar do zero quando você pode ter tudo funcionando em dias?
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {comparisons.map((comparison, index) => {
            const IconComponent = comparison.icon;
            return (
              <Card key={index} className="glass-effect border-border overflow-hidden">
                <CardHeader className="bg-secondary/30 pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg text-foreground">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <IconComponent className="h-4 w-4 text-primary-foreground" />
                    </div>
                    {comparison.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2">
                    {/* Without SENVIA */}
                    <div className="p-4 bg-destructive/5 border-r border-border">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-destructive flex items-center justify-center flex-shrink-0 mt-1">
                          <X className="h-3 w-3 text-destructive-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-destructive mb-1 text-sm">Fazer Interno</h4>
                          <p className="text-muted-foreground text-sm">{comparison.without}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* With SENVIA */}
                    <div className="p-4 bg-accent/5">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                          <Check className="h-3 w-3 text-accent-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-accent mb-1 text-sm">Com SENVIA</h4>
                          <p className="text-muted-foreground text-sm">{comparison.with}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Card className="glass-effect border-primary/30 max-w-xl mx-auto">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-foreground mb-3">
                A escolha é óbvia
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Tenha tudo funcionando profissionalmente em dias, não meses.
              </p>
              <Button 
                onClick={scrollToPricing}
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
              >
                Escolher Meu Plano
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;