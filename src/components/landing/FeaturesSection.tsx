
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
    <section className="py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight">
            Não criamos apenas páginas. Entregamos uma{" "}
            <span className="text-gradient">estrutura de vendas inteligente.</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Enquanto outros vendem landing pages genéricas, nós desenhamos estruturas sob medida, 
            com copy estratégica, CRM, automações e integrações que trabalham para você.
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
