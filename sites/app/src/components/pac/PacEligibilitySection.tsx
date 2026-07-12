import { Check, X, Target } from "lucide-react";

const PacEligibilitySection = () => {
  const eligibleFor = [
    "Startups SaaS com faturamento 20-100k€/mês",
    "E-commerce com tráfego qualificado existente",
    "Infoprodutores premium com ticket médio €200+",
    "Empresas B2B com processo de vendas estruturado",
    "Negócios com budget para testes e otimização"
  ];

  const notEligibleFor = [
    "Empresas sem tráfego ou audiência",
    "Negócios com ticket médio inferior a €50",
    "Startups em fase de validação inicial",
    "Empresas sem budget para implementação"
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6">
              <Target className="w-4 h-4 mr-2" />
              Perfil Ideal
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Este sistema é para você?
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Trabalhamos apenas com empresas que já têm tráfego e querem multiplicar resultados.
              <br />
              <strong className="text-foreground">Não fazemos milagres, otimizamos o que já funciona.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Somos para */}
            <div className="p-8 rounded-2xl bg-primary/5 border border-primary/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Somos para
                </h3>
              </div>

              <ul className="space-y-4">
                {eligibleFor.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-4 rounded-xl bg-primary/10">
                <p className="text-sm text-primary font-semibold">
                  💡 Se você se encaixa aqui, podemos dobrar sua conversão
                </p>
              </div>
            </div>

            {/* Não somos para */}
            <div className="p-8 rounded-2xl bg-muted/50 border border-border">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-4">
                  <X className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Não somos para
                </h3>
              </div>

              <ul className="space-y-4">
                {notEligibleFor.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <X className="w-5 h-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-4 rounded-xl bg-muted">
                <p className="text-sm text-muted-foreground">
                  ⚠️ Nestes casos, recomendamos primeiro estruturar o negócio
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold">
              ✓ Se você se identificou, continue para ver os resultados possíveis
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PacEligibilitySection;