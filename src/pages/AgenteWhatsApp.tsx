import { Helmet } from "react-helmet-async";
import PromoHero from "@/components/agente-whatsapp/PromoHero";
import CountdownTimer from "@/components/agente-whatsapp/CountdownTimer";
import VacancyCounter from "@/components/agente-whatsapp/VacancyCounter";
import PromoForm from "@/components/agente-whatsapp/PromoForm";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Zap } from "lucide-react";

const AgenteWhatsApp = () => {
  return (
    <>
      <Helmet>
        <title>Agente IA WhatsApp - Promoção Limitada | SENVIA</title>
        <meta name="description" content="Apenas 5 vagas! Agente IA para WhatsApp por €500 (de €800). Atendimento 24h, marcações automáticas e lembretes. Oferta válida até 18/12/2025." />
        <meta property="og:title" content="Agente IA WhatsApp - €500 (Promoção Limitada)" />
        <meta property="og:description" content="Últimas 5 vagas! Automatize seu WhatsApp com IA. Atendimento 24h + Marcações + Lembretes por apenas €500." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background via-card to-background">
        {/* Hero Section */}
        <PromoHero />

        {/* Urgency Section */}
        <section className="py-8 px-4 bg-destructive/10 border-y border-destructive/30">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <CountdownTimer targetDate="2025-12-18T23:59:59" />
              <VacancyCounter totalVacancies={5} remainingVacancies={5} />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              O que está incluído?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="border-primary/30 bg-card/50 backdrop-blur">
                <CardContent className="p-6">
                  <Clock className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">Atendimento 24/7</h3>
                  <p className="text-muted-foreground">
                    Seu agente IA responde clientes a qualquer hora, todos os dias da semana. Nunca perca uma oportunidade.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/30 bg-card/50 backdrop-blur">
                <CardContent className="p-6">
                  <CheckCircle className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">Marcações Automáticas</h3>
                  <p className="text-muted-foreground">
                    Agenda consultas/reuniões automaticamente diretamente no seu calendário. Zero trabalho manual.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/30 bg-card/50 backdrop-blur">
                <CardContent className="p-6">
                  <Zap className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">Lembretes Inteligentes</h3>
                  <p className="text-muted-foreground">
                    Envia lembretes automáticos aos clientes antes das marcações. Reduz faltas em até 80%.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Price Breakdown */}
            <div className="bg-card/80 border border-primary/30 rounded-2xl p-8 mb-12">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl">Setup + Configuração Completa</span>
                  <div className="text-right">
                    <span className="line-through text-muted-foreground mr-3">€800</span>
                    <span className="text-3xl font-bold text-primary">€500</span>
                  </div>
                </div>
                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">+ Servidor (após setup)</span>
                  <span className="text-xl">€50/mês</span>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  ⚠️ Custo de servidor: €50/mês para manter o agente ativo 24h (hosting + IA)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section id="form" className="py-16 px-4 bg-gradient-to-b from-card/50 to-background">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Garanta sua <span className="text-gradient">vaga agora</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Preencha o formulário e nossa equipe entrará em contacto em até 24h para configurar seu agente.
              </p>
            </div>

            <Card className="border-primary/30 bg-card/80 backdrop-blur">
              <CardContent className="p-6 md:p-8">
                <PromoForm />
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
};

export default AgenteWhatsApp;
