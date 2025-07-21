
import { memo } from "react";
import { 
  Globe, 
  ShoppingCart, 
  MessageSquare, 
  TrendingUp,
  Cpu,
  BarChart3,
  Calendar,
  Mail,
  MessageCircle
} from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const ServicesSection = memo(() => {
  const sectionRef = useScrollAnimation(100);

  const services = [
    {
      title: "Websites & Páginas Web",
      description: "Criamos websites profissionais e páginas web que captam a essência da sua marca.",
      icon: <Globe className="h-10 w-10 text-senvia-500" />
    },
    {
      title: "E-commerce",
      description: "Desenvolvemos lojas online otimizadas para conversões e excelente experiência de compra.",
      icon: <ShoppingCart className="h-10 w-10 text-senvia-500" />
    },
    {
      title: "Social Media",
      description: "Gerimos as suas redes sociais com estratégias personalizadas para aumentar o engajamento.",
      icon: <MessageSquare className="h-10 w-10 text-senvia-500" />
    },
    {
      title: "Tráfego Pago",
      description: "Somos especialistas em Meta Ads para aumentar a visibilidade da sua marca.",
      icon: <TrendingUp className="h-10 w-10 text-senvia-500" />
    },
    {
      title: "Agentes de IA",
      description: "Criamos assistentes virtuais inteligentes e chatbots personalizados para o seu negócio.",
      icon: <Cpu className="h-10 w-10 text-senvia-500" />
    },
    {
      title: "Gestão Financeira",
      description: "Plataformas completas para gestão financeira da sua empresa com relatórios detalhados.",
      icon: <BarChart3 className="h-10 w-10 text-senvia-500" />
    },
    {
      title: "Agendamento Integrado",
      description: "Sistemas de agendamento com integração a calendários e notificações automáticas.",
      icon: <Calendar className="h-10 w-10 text-senvia-500" />
    },
    {
      title: "Email Marketing",
      description: "Formulários de contacto com envio automático de emails marketing personalizados.",
      icon: <Mail className="h-10 w-10 text-senvia-500" />
    },
    {
      title: "Atendimento WhatsApp",
      description: "Robô de atendimento profissional para WhatsApp com respostas automáticas.",
      icon: <MessageCircle className="h-10 w-10 text-senvia-500" />
    }
  ];

  return (
    <section id="servicos" ref={sectionRef} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-on-scroll">
            <span className="text-gradient">Os Nossos Serviços</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-on-scroll">
            Oferecemos um conjunto completo de soluções digitais para ajudar o seu negócio a crescer e destacar-se no mercado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="relative bg-card p-6 rounded-2xl shadow-lg border border-border card-hover animate-on-scroll"
            >
              <GlowingEffect 
                spread={30} 
                glow={true} 
                disabled={false} 
                proximity={50}
                inactiveZone={0.01}
                borderWidth={2}
              />
              <div className="relative z-10">
                <div className="mb-5">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

ServicesSection.displayName = 'ServicesSection';

export default ServicesSection;
