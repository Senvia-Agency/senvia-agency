
import { Target, Users, Zap, MessageSquare, Shield, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FeaturesSection = () => {
  const features = [
    {
      icon: Target,
      title: "Estrutura pensada para conversão real",
      description: "Copy estratégica e design focado em resultados, não apenas beleza."
    },
    {
      icon: Users,
      title: "CRM de gestão de leads incluso",
      description: "Todos os contactos organizados e centralizados numa única plataforma."
    },
    {
      icon: Zap,
      title: "E-mails automáticos e nutrição de contactos",
      description: "Fluxos inteligentes que educam e convertem automaticamente."
    },
    {
      icon: MessageSquare,
      title: "Botão flutuante de WhatsApp com integração",
      description: "Conexão direta com seus clientes, disponível 24/7."
    },
    {
      icon: Shield,
      title: "Páginas legais (termos, políticas, cookies)",
      description: "Conformidade total com RGPD e legislação europeia."
    },
    {
      icon: Clock,
      title: "Acompanhamento e suporte personalizado",
      description: "Não entregamos e desaparecemos. Estamos aqui para ajudar."
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Não criamos apenas páginas. Entregamos uma{" "}
            <span className="text-gradient">estrutura de vendas inteligente.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Enquanto outros vendem landing pages genéricas, nós desenhamos estruturas sob medida, 
            com copy estratégica, CRM, automações e integrações que trabalham para você.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-senvia-500/50 transition-all duration-300">
              <CardContent className="p-8">
                <div className="bg-senvia-500/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-senvia-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
