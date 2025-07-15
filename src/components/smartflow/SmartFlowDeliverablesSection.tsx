import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  FileText, 
  FormInput, 
  Bot, 
  BarChart3,
  Check
} from "lucide-react";

const SmartFlowDeliverablesSection = () => {
  const deliverables = [
    {
      icon: Zap,
      title: "Site Lightning",
      subtitle: "Webflow/Next.js estático",
      description: "Core Web Vitals > 90",
      benefits: [
        "Carregamento instantâneo",
        "Menos bounce rate",
        "SEO otimizado",
        "Mobile-first design"
      ],
      color: "text-primary"
    },
    {
      icon: FileText,
      title: "Copy CRO First",
      subtitle: "Pesquisa express de persona",
      description: "Escrita orientada a dor-ganho",
      benefits: [
        "Conversão aumenta sem subir tráfego",
        "Headlines que convertem",
        "CTAs otimizados",
        "Storytelling persuasivo"
      ],
      color: "text-accent"
    },
    {
      icon: FormInput,
      title: "Formulário Smart",
      subtitle: "Campos dinâmicos",
      description: "Validação + reCAPTCHA invisível",
      benefits: [
        "Leads limpos, sem spam",
        "UX otimizada",
        "Menor abandono",
        "Qualificação automática"
      ],
      color: "text-secondary"
    },
    {
      icon: Bot,
      title: "n8n Flow 1-Click",
      subtitle: "Lead → CRM → Slack/WhatsApp",
      description: "E-mail 'obrigado' automático",
      benefits: [
        "Resposta em 60 segundos",
        "Evita perda de lead",
        "Integração total",
        "Notificações instantâneas"
      ],
      color: "text-primary"
    },
    {
      icon: BarChart3,
      title: "Painel Looker Studio",
      subtitle: "CR%, origem do lead",
      description: "Tempo de resposta",
      benefits: [
        "Transparência total",
        "Cultura data-driven",
        "ROI visível",
        "Otimização contínua"
      ],
      color: "text-accent"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            5 Blocos de Entregáveis Tangíveis
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            O que você <span className="text-primary">recebe</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Cada componente foi projetado para maximizar suas conversões e automatizar seu processo de vendas
          </p>
        </div>

        {/* Deliverables Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {deliverables.map((item, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-primary/10 ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{item.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-2">{item.subtitle}</p>
                    <Badge variant="secondary" className="text-xs">
                      {item.description}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <h4 className="font-semibold text-primary mb-3">Ganhos percebidos:</h4>
                <ul className="space-y-2">
                  {item.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </Card>
          ))}
        </div>

        {/* Value Summary */}
        <div className="mt-16 text-center">
          <div className="bg-card border border-border rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Infraestrutura Completa de Aquisição
            </h3>
            <p className="text-muted-foreground mb-6">
              Não vendemos "páginas de internet". Entregamos tempo e previsibilidade através de uma infraestrutura que funciona 24/7.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">15</div>
                <div className="text-sm text-muted-foreground">Dias para entrega</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">60s</div>
                <div className="text-sm text-muted-foreground">Resposta automática</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">+20%</div>
                <div className="text-sm text-muted-foreground">Mais oportunidades</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartFlowDeliverablesSection;