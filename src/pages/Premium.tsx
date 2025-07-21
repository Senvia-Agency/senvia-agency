import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, ArrowLeft, Workflow, Zap, Shield, Globe, Settings, Clock } from "lucide-react";
import MetaPixel from "../components/MetaPixel";
import ImportantNotes from "../components/produtos/ImportantNotes";
import PricingFormModal from "../components/produtos/PricingFormModal";

const PremiumPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.title = "Plano Premium - SENVIA | Automação Empresarial Completa";
  }, []);

  const features = [
    "Tudo dos planos Starter e Pro incluído",
    "Sequência de 3 e-mails automáticos personalizados",
    "Integrações externas (até 3 plataformas)",
    "Fluxos de pós-venda automáticos",
    "Automação avançada de marketing",
    "Suporte VIP 24 horas",
    "Relatórios executivos personalizados",
    "Consultoria estratégica mensal",
    "Optimizações contínuas de conversão",
    "Setup prioritário em 18 dias"
  ];

  const integrations = [
    { name: "Stripe/PayPal", description: "Pagamentos automáticos" },
    { name: "Zapier", description: "Conecte com 5000+ apps" },
    { name: "Google Sheets", description: "Sincronização de dados" },
    { name: "Mailchimp", description: "Marketing por e-mail" },
    { name: "Calendly", description: "Agendamentos automáticos" },
    { name: "Slack/Teams", description: "Notificações em tempo real" }
  ];

  const automations = [
    {
      icon: Workflow,
      title: "Sequência de E-mails Inteligente",
      description: "3 e-mails automáticos personalizados que nutrem os seus leads e aumentam as conversões em até 300%."
    },
    {
      icon: Zap,
      title: "Automação de Pós-Venda",
      description: "Fluxos automáticos para up-sell, cross-sell e fidelização de clientes. Maximize o valor de cada cliente."
    },
    {
      icon: Settings,
      title: "Integrações Personalizadas",
      description: "Conectamos o seu sistema com as ferramentas que já usa. Workflow unificado e eficiente."
    },
    {
      icon: Shield,
      title: "Suporte VIP 24h",
      description: "Linha directa prioritária com tempo de resposta máximo de 2 horas. Nunca fique sem suporte."
    },
    {
      icon: Globe,
      title: "Consultoria Estratégica",
      description: "Reunião mensal com especialistas para optimizar estratégias e identificar oportunidades de crescimento."
    },
    {
      icon: Clock,
      title: "Optimização Contínua",
      description: "Monitorização constante e melhorias automáticas baseadas em dados reais de performance."
    }
  ];

  const results = [
    { metric: "300%", description: "Aumento médio em conversões" },
    { metric: "85%", description: "Redução no tempo de gestão" },
    { metric: "500%", description: "ROI médio em 12 meses" },
    { metric: "24h", description: "Tempo máximo de resposta" }
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
            <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black px-4 py-2">
              <Crown className="w-4 h-4 mr-2" />
              Plano Premium - Máximo Desempenho
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Automação Empresarial
              <span className="block text-gradient leading-tight">
                de Nível Mundial
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Para empresas ambiciosas que querem <strong>dominar o mercado digital</strong>. 
              Automação completa, integrações avançadas e suporte VIP 24 horas.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-senvia-500">1.197€</div>
                <div className="text-muted-foreground">Setup + 100€/mês</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-semibold">18 dias</div>
                <div className="text-muted-foreground">Setup prioritário</div>
              </div>
            </div>

            <Button 
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-lg px-8 py-4"
              onClick={() => setIsModalOpen(true)}
            >
              Escolher Premium
            </Button>
          </div>
        </div>
      </section>

      {/* Resultados Comprovados */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Resultados <span className="text-gradient">Comprovados</span>
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {results.map((result, index) => (
              <Card key={index} className="text-center border-senvia-500/20 bg-card/50">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-senvia-500 mb-2">{result.metric}</div>
                  <div className="text-muted-foreground">{result.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Automações Avançadas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Automações <span className="text-gradient">Avançadas</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {automations.map((automation, index) => (
              <Card key={index} className="border-senvia-500/20 bg-card/50 hover:bg-card/80 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-senvia-500/20 flex items-center justify-center mb-4">
                    <automation.icon className="h-6 w-6 text-senvia-500" />
                  </div>
                  <CardTitle className="text-xl">{automation.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{automation.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integrações Disponíveis */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Integrações <span className="text-gradient">Disponíveis</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {integrations.map((integration, index) => (
              <Card key={index} className="border-senvia-500/20 bg-card/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-senvia-500/20 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-senvia-500" />
                    </div>
                    <div>
                      <div className="font-semibold">{integration.name}</div>
                      <div className="text-sm text-muted-foreground">{integration.description}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              + Qualquer outra integração personalizada que precise
            </p>
          </div>
        </div>
      </section>

      {/* O Que Está Incluído */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Tudo Que <span className="text-gradient">Está Incluído</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-senvia-500/10 to-senvia-400/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto Para Dominar o Mercado?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se às empresas líderes que escolheram o Premium para 
            automatizar completamente os seus processos de captação e vendas.
          </p>
          <div className="space-y-4">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-lg px-8 py-4"
              onClick={() => setIsModalOpen(true)}
            >
              Solicitar Plano Premium - 1.197€
            </Button>
            <div className="text-sm text-muted-foreground">
              Consultoria gratuita incluída • Suporte VIP 24h • Garantia de resultados
            </div>
          </div>
        </div>
      </section>

      <ImportantNotes />

      
      <PricingFormModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        planName="Premium"
      />

      {/* CTA Section */}
    </div>
  );
};

export default PremiumPage;