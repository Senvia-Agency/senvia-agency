import { Clock, FileText, Palette, Settings, Rocket } from "lucide-react";

const PacProcessSection = () => {
  const processSteps = [
    {
      icon: Clock,
      day: "0-1 dia",
      title: "Diagnóstico Completo",
      description: "Auditoria da landing atual, análise do tráfego, identificação de oportunidades e definição de estratégia.",
      deliverable: "Relatório de diagnóstico + plano de ação"
    },
    {
      icon: FileText,
      day: "2-5 dias",
      title: "Copy & Wireframes",
      description: "Criação do copy psicológico, estrutura das seções, definição dos CTAs e wireframes detalhados.",
      deliverable: "Copy final + wireframes aprovados"
    },
    {
      icon: Palette,
      day: "6-10 dias",
      title: "Design & Desenvolvimento",
      description: "Design premium, desenvolvimento responsivo, otimizações de velocidade e integrações necessárias.",
      deliverable: "Landing page completa em staging"
    },
    {
      icon: Settings,
      day: "11-14 dias",
      title: "Integrações & Testes",
      description: "Setup de analytics, automações, formulários, testes A/B e configurações finais.",
      deliverable: "Ambiente de produção configurado"
    },
    {
      icon: Rocket,
      day: "15+ dias",
      title: "Go-live & Otimização",
      description: "Lançamento oficial, monitoramento de métricas, ajustes baseados em dados e suporte contínuo.",
      deliverable: "Landing live + relatórios de performance"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Processo Passo a Passo
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Metodologia comprovada para implementar e otimizar sua landing page em 14 dias
            </p>
          </div>

          <div className="space-y-8">
            {processSteps.map((step, index) => (
              <div 
                key={index}
                className="flex flex-col lg:flex-row gap-6 items-start lg:items-center"
              >
                {/* Timeline */}
                <div className="flex items-center lg:flex-col lg:items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block w-0.5 h-16 bg-primary/20 mt-4"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 bg-muted/30 rounded-2xl p-6 lg:p-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
                        {step.day}
                      </div>
                      <h3 className="text-xl font-bold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">
                    {step.description}
                  </p>

                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span className="text-sm font-semibold text-foreground">
                      Entregável: {step.deliverable}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline Summary */}
          <div className="mt-16 bg-gradient-to-r from-primary to-secondary p-8 rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Timeline Total: 14 dias para go-live
            </h3>
            <p className="text-lg opacity-90 mb-6">
              Primeiro resultado mensurável: 30 dias após lançamento
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">24h</div>
                <div className="text-sm opacity-90">Tempo médio resposta</div>
              </div>
              <div>
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm opacity-90">Entregas no prazo</div>
              </div>
              <div>
                <div className="text-3xl font-bold">60 dias</div>
                <div className="text-sm opacity-90">Suporte incluído</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PacProcessSection;