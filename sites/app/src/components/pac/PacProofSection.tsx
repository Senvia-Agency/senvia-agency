import { TrendingUp, Users, Euro } from "lucide-react";

const PacProofSection = () => {
  const metrics = [
    {
      icon: TrendingUp,
      value: "+64%",
      label: "leads captados",
      description: "Em média para nossos clientes"
    },
    {
      icon: Users,
      value: "3,8%",
      label: "CR médio",
      description: "Taxa de conversão alcançada"
    },
    {
      icon: Euro,
      value: "€8,7M",
      label: "gerados em 2024",
      description: "Para todos os nossos clientes"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Resultados Comprovados
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Métricas reais dos nossos clientes que implementaram o sistema PAC Growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-2xl bg-background border border-border hover:shadow-lg transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <metric.icon className="h-8 w-8" />
              </div>
              
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {metric.value}
              </div>
              
              <div className="text-lg font-semibold text-primary mb-2">
                {metric.label}
              </div>
              
              <p className="text-sm text-muted-foreground">
                {metric.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional proof */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/5 border border-primary/20">
            <span className="text-sm font-medium text-foreground">
              🏆 Garantia de resultados: mínimo 20% de aumento em 30 dias
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PacProofSection;