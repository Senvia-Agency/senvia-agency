import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, ArrowLeft, Clock, Euro, Globe, Shield } from "lucide-react";
import MetaPixel from "../components/MetaPixel";
import ImportantNotes from "../components/produtos/ImportantNotes";

const StarterPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Plano Starter - SENVIA | Página Profissional + Captação";
  }, []);

  const features = [
    "Página de alta conversão optimizada",
    "Formulário conectado directamente ao e-mail",
    "Botão WhatsApp integrado e configurado",
    "Google Analytics 4 + Meta Pixel instalados",
    "Hospedagem SSL incluída (1 ano)",
    "Design responsivo para todos os dispositivos",
    "Entrega garantida em 7 dias",
    "Suporte técnico durante 30 dias"
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Rapidez na Implementação",
      description: "O seu negócio online em apenas 7 dias. Não perca mais tempo a adiar o crescimento da sua empresa."
    },
    {
      icon: Euro,
      title: "Investimento Único",
      description: "Sem mensalidades. Pague uma vez e tenha a sua presença digital profissional para sempre."
    },
    {
      icon: Globe,
      title: "Presença Digital Profissional",
      description: "Ganhe credibilidade e confiança dos seus clientes com um website profissional e bem estruturado."
    },
    {
      icon: Shield,
      title: "Segurança Garantida",
      description: "SSL incluído, hosting seguro e backups automáticos. O seu website sempre protegido."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MetaPixel />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 bg-gradient-to-br from-senvia-500/10 via-transparent to-senvia-400/10">
        <div className="container mx-auto max-w-6xl">
          <Button 
            onClick={() => navigate('/produtos')}
            variant="ghost"
            className="mb-8 text-senvia-500 hover:text-senvia-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Planos
          </Button>

          <div className="text-center mb-12">
            <Badge className="mb-4 bg-senvia-500/20 text-senvia-500 px-4 py-2 border border-senvia-500/30">
              <Zap className="w-4 h-4 mr-2" />
              Plano Starter
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              A Sua Presença Digital
              <span className="block text-gradient leading-tight">
                Profissional em 7 Dias
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Ideal para empresários e profissionais que precisam de uma <strong>presença digital sólida</strong> 
              para começar a captar leads de forma profissional e credível.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-senvia-500">397€</div>
                <div className="text-muted-foreground">Pagamento único</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-semibold">7 dias</div>
                <div className="text-muted-foreground">Entrega garantida</div>
              </div>
            </div>

            <Button 
              size="lg"
              className="bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 text-black text-lg px-8 py-4"
            >
              Começar Agora
            </Button>
          </div>
        </div>
      </section>

      {/* Características Incluídas */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            O Que Está <span className="text-gradient">Incluído</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-senvia-500/20 bg-card/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-senvia-400 mt-1 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Por Que Escolher o <span className="text-gradient">Starter?</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-senvia-500/20 bg-card/50 hover:bg-card/80 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-senvia-500/20 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-senvia-500" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-senvia-500/10 to-senvia-400/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto Para Começar?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Não deixe a concorrência sair à frente. Comece hoje mesmo a construir 
            a sua presença digital profissional.
          </p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 text-black text-lg px-8 py-4"
          >
            Solicitar Plano Starter - 397€
          </Button>
        </div>
      </section>

      <ImportantNotes />

      {/* CTA Section */}
    </div>
  );
};

export default StarterPage;