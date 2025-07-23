import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, ArrowLeft, Zap, Database, Mail, Target, Users, Headphones } from "lucide-react";

import ImportantNotes from "../components/produtos/ImportantNotes";
import PricingFormModal from "../components/produtos/PricingFormModal";

const ProPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.title = "Plano Pro - SENVIA | CRM + Automação Completa";
  }, []);

  const features = [
    "Tudo do plano Starter incluído",
    "CRM integrado completo e profissional",
    "E-mail de boas-vindas automático",
    "Organização total de leads por categorias",
    "Dashboard administrativo completo",
    "Relatórios de performance em tempo real",
    "Manutenção contínua e actualizações",
    "Suporte prioritário via WhatsApp",
    "Backup automático semanal",
    "Entrega garantida em 15 dias"
  ];

  const benefits = [
    {
      icon: Database,
      title: "CRM Profissional Incluído",
      description: "Gerencie todos os seus contactos, leads e clientes numa plataforma intuitiva e poderosa. Nunca mais perca um potencial cliente."
    },
    {
      icon: Mail,
      title: "Automação de E-mail",
      description: "E-mails automáticos para novos leads, garantindo que nenhum contacto fica sem resposta. Primeiras impressões profissionais sempre."
    },
    {
      icon: Target,
      title: "Organização Inteligente",
      description: "Categorize e filtre os seus leads automaticamente. Identifique rapidamente as melhores oportunidades de negócio."
    },
    {
      icon: Users,
      title: "Relatórios Detalhados",
      description: "Acompanhe métricas importantes: conversões, origem dos leads, performance das campanhas. Tome decisões baseadas em dados."
    },
    {
      icon: Zap,
      title: "Manutenção Incluída",
      description: "Actualizações automáticas, monitorização 24/7 e optimizações constantes. O seu sistema sempre actualizado e funcionando."
    },
    {
      icon: Headphones,
      title: "Suporte Prioritário",
      description: "Linha directa de suporte via WhatsApp. Respostas rápidas e soluções eficazes sempre que precisar."
    }
  ];

  const comparison = [
    { feature: "Página profissional", starter: true, pro: true },
    { feature: "Formulário integrado", starter: true, pro: true },
    { feature: "WhatsApp button", starter: true, pro: true },
    { feature: "Analytics configurado", starter: true, pro: true },
    { feature: "CRM completo", starter: false, pro: true },
    { feature: "E-mail automático", starter: false, pro: true },
    { feature: "Organização de leads", starter: false, pro: true },
    { feature: "Relatórios", starter: false, pro: true },
    { feature: "Manutenção contínua", starter: false, pro: true },
    { feature: "Suporte prioritário", starter: false, pro: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      
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
            <Badge className="mb-4 bg-senvia-500 text-black px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Plano Pro - Recomendado
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              CRM + Automação
              <span className="block text-gradient leading-tight">
                Profissional Completa
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Para empresas que querem <strong>automatizar completamente</strong> a captação e gestão de leads. 
              Inclui CRM profissional, e-mails automáticos e manutenção contínua.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
              <div className="text-center">
                <div className="text-lg text-muted-foreground line-through mb-1">697€</div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-senvia-500">349€</span>
                  <Badge className="bg-red-500 text-white text-sm px-3 py-1">
                    -50%
                  </Badge>
                </div>
                <div className="text-muted-foreground">Setup + 50€/mês</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-semibold">15 dias</div>
                <div className="text-muted-foreground">Entrega garantida</div>
              </div>
            </div>

            <Button 
              size="lg"
              className="bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 text-black text-lg px-8 py-4"
              onClick={() => document.getElementById('cta-final')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Escolher Pro
            </Button>
          </div>
        </div>
      </section>

      {/* Comparação */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Pro vs <span className="text-gradient">Starter</span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <Card className="border-senvia-500/20">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Comparação Detalhada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 pb-4 border-b border-border">
                    <div className="font-semibold">Funcionalidade</div>
                    <div className="text-center font-semibold">Starter</div>
                    <div className="text-center font-semibold text-senvia-500">Pro</div>
                  </div>
                  
                  {comparison.map((item, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 py-2 border-b border-border/50">
                      <div>{item.feature}</div>
                      <div className="text-center">
                        {item.starter ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                      <div className="text-center">
                        <Check className="h-5 w-5 text-senvia-500 mx-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Por Que o Pro é <span className="text-gradient">Ideal?</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
      <section id="cta-final" className="py-16 bg-gradient-to-r from-senvia-500/10 to-senvia-400/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transforme o Seu Negócio Hoje
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Automatize a captação de leads, organize os seus contactos e 
            mantenha-se sempre à frente da concorrência.
          </p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 text-black text-lg px-8 py-4"
            onClick={() => setIsModalOpen(true)}
          >
            Falar com especialista - 349€
          </Button>
        </div>
      </section>

      <ImportantNotes />

      
      <PricingFormModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        planName="Pro"
      />

      {/* CTA Section */}
    </div>
  );
};

export default ProPage;