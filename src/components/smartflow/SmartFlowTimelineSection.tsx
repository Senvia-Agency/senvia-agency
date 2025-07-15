import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, ArrowRight } from "lucide-react";

const SmartFlowTimelineSection = () => {
  const timeline = [
    {
      day: "Dias 1-2",
      title: "Pesquisa & Estratégia",
      tasks: [
        "Análise da persona e concorrência",
        "Definição da arquitetura do site",
        "Mapeamento do fluxo de automação",
        "Criação do wireframe"
      ],
      status: "planning"
    },
    {
      day: "Dias 3-5",
      title: "Copy & Design",
      tasks: [
        "Headlines orientadas a conversão",
        "Copy persuasivo baseado em dor-ganho",
        "Design visual do site",
        "Otimização para mobile"
      ],
      status: "design"
    },
    {
      day: "Dias 6-8",
      title: "Desenvolvimento Site",
      tasks: [
        "Codificação Next.js/Webflow",
        "Otimização Core Web Vitals",
        "Implementação do formulário smart",
        "Testes de velocidade"
      ],
      status: "development"
    },
    {
      day: "Dias 9-11",
      title: "Automação n8n",
      tasks: [
        "Configuração do fluxo de leads",
        "Integração com CRM",
        "Setup Slack/WhatsApp",
        "E-mails automáticos"
      ],
      status: "automation"
    },
    {
      day: "Dias 12-13",
      title: "Painel & Integrações",
      tasks: [
        "Dashboard Looker Studio",
        "Conectores de dados",
        "Métricas de conversão",
        "Testes finais"
      ],
      status: "analytics"
    },
    {
      day: "Dias 14-15",
      title: "Entrega & Treinamento",
      tasks: [
        "Deploy e DNS",
        "Treinamento da equipe",
        "Documentação completa",
        "Garantia ativada"
      ],
      status: "delivery"
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      planning: "bg-blue-500",
      design: "bg-purple-500",
      development: "bg-green-500",
      automation: "bg-orange-500",
      analytics: "bg-pink-500",
      delivery: "bg-primary"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <section id="timeline-section" className="py-20 bg-gradient-to-b from-secondary/10 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Clock className="w-4 h-4 mr-2" />
            Cronograma Detalhado
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            <span className="text-primary">15 dias</span> para sua nova infraestrutura
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Cada marco é transparente e mensurável. Você acompanha o progresso em tempo real.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-border hidden lg:block"></div>

          <div className="space-y-8">
            {timeline.map((phase, index) => (
              <div key={index} className="relative">
                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background hidden lg:block z-10"></div>

                {/* Content */}
                <div className={`lg:grid lg:grid-cols-2 lg:gap-8 ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                  <div className={`${index % 2 === 0 ? 'lg:text-right lg:pr-8' : 'lg:pl-8 lg:col-start-2'}`}>
                    <Card className="group hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(phase.status)}`}></div>
                          <Badge variant="secondary" className="text-xs">
                            {phase.day}
                          </Badge>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-4">{phase.title}</h3>
                        
                        <ul className="space-y-2">
                          {phase.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Empty space for alternating layout */}
                  <div className={`hidden lg:block ${index % 2 === 0 ? 'lg:col-start-2' : 'lg:col-start-1'}`}></div>
                </div>

                {/* Mobile Arrow */}
                {index < timeline.length - 1 && (
                  <div className="flex justify-center mt-4 lg:hidden">
                    <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Transparência Total no Processo
              </h3>
              <p className="text-muted-foreground mb-6">
                Você recebe atualizações diárias e pode acompanhar cada etapa através do nosso dashboard de projeto.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-bold text-primary mb-2">Daily Updates</div>
                  <div className="text-sm text-muted-foreground">Progresso em tempo real</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary mb-2">Marco Reviews</div>
                  <div className="text-sm text-muted-foreground">Aprovação em cada fase</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary mb-2">Support 24/7</div>
                  <div className="text-sm text-muted-foreground">Suporte durante todo processo</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SmartFlowTimelineSection;