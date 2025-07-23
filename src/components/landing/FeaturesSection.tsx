
import { Target, Users, Zap, MessageSquare, Shield, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FeaturesSection = () => {
  const features = [
    {
      icon: Target,
      title: "Landing Page de alta conversão",
      description: "Design estratégico, copy persuasiva e estrutura focada 100% em resultados e captação de leads."
    },
    {
      icon: Users,
      title: "CRM completo para gestão de leads",
      description: "Sistema profissional para organizar, segmentar e acompanhar todos os seus contactos e oportunidades."
    },
    {
      icon: Zap,
      title: "Automação de e-mails inteligente",
      description: "E-mails automáticos para administrador (notificação de lead) e boas-vindas personalizadas para o lead."
    },
    {
      icon: MessageSquare,
      title: "Integração WhatsApp profissional",
      description: "Botão flutuante conectado ao CRM para atendimento direto e conversão imediata."
    },
    {
      icon: Shield,
      title: "Conformidade legal completa",
      description: "Páginas de termos, políticas de privacidade e cookies em conformidade com o RGPD."
    },
    {
      icon: Clock,
      title: "Suporte contínuo e treinamento",
      description: "Não apenas entregamos: ensinamos você a usar e otimizar sua estrutura para máximos resultados."
    }
  ];

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight">
            Landing Page + CRM:{" "}
            <span className="text-gradient">a dupla perfeita para seu negócio</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Não vendemos apenas páginas bonitas. Criamos um sistema completo: landing page de alta conversão 
            integrada com CRM profissional e automação de e-mails para captar, organizar e nutrir seus leads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-senvia-500/50 transition-all duration-300 h-full">
              <CardContent className="p-6 md:p-8 h-full flex flex-col">
                <div className="bg-senvia-500/10 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-4 md:mb-6">
                  <feature.icon className="h-6 w-6 md:h-8 md:w-8 text-senvia-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">{feature.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground flex-grow">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
