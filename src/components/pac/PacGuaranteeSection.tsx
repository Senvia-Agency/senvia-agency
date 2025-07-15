import { Shield, RefreshCw, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const PacGuaranteeSection = () => {
  const guarantees = [
    {
      icon: TrendingUp,
      title: "Garantia de Resultado",
      description: "Mínimo 20% de aumento na conversão em 30 dias ou re-trabalhamos grátis até atingir."
    },
    {
      icon: Clock,
      title: "Garantia de Prazo",
      description: "Entrega em 14 dias úteis ou você recebe €200 de desconto por cada dia de atraso."
    },
    {
      icon: RefreshCw,
      title: "Garantia de Satisfação",
      description: "Não ficou satisfeito? Fazemos revisões ilimitadas por 30 dias após entrega."
    },
    {
      icon: Shield,
      title: "Garantia de Qualidade",
      description: "Código limpo, design responsivo e otimizações de velocidade garantidas."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Risco Zero
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Garantias Incondicionais
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Assumimos todo o risco para você ter a certeza de que vai funcionar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {guarantees.map((guarantee, index) => (
              <Card key={index} className="border-0 shadow-lg bg-background hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <guarantee.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {guarantee.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {guarantee.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Guarantee Highlight */}
          <div className="bg-gradient-to-r from-primary to-secondary p-8 rounded-2xl text-white text-center">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Se não subir pelo menos 20% a conversão em 30 dias
              </h3>
              <p className="text-xl mb-6 opacity-90">
                Re-trabalhamos completamente grátis até atingir o resultado prometido
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-2xl font-bold">€0</div>
                  <div className="text-sm opacity-90">Custo adicional</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm opacity-90">Do nosso comprometimento</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-2xl font-bold">∞</div>
                  <div className="text-sm opacity-90">Revisões necessárias</div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Trust Elements */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-6">
              Por que oferecemos essas garantias?
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="p-4">
                <div className="text-2xl font-bold text-primary mb-2">94%</div>
                <div className="text-sm text-muted-foreground">Taxa de sucesso</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-primary mb-2">+50</div>
                <div className="text-sm text-muted-foreground">Projetos entregues</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-primary mb-2">3 anos</div>
                <div className="text-sm text-muted-foreground">Experiência comprovada</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PacGuaranteeSection;