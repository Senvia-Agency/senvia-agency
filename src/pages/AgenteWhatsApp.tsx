import { Helmet } from "react-helmet-async";
import PromoHero from "@/components/agente-whatsapp/PromoHero";
import CountdownTimer from "@/components/agente-whatsapp/CountdownTimer";
import VacancyCounter from "@/components/agente-whatsapp/VacancyCounter";
import PromoForm from "@/components/agente-whatsapp/PromoForm";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";

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
        <section className="py-6 sm:py-8 px-4 bg-destructive/10 border-y border-destructive/30">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
              <CountdownTimer targetDate="2025-12-18T23:59:59" />
              <div className="h-px w-full sm:h-16 sm:w-px bg-border/50" />
              <VacancyCounter totalVacancies={5} remainingVacancies={1} />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-10 sm:py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">
              O que está incluído?
            </h2>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
              {[
                {
                  icon: Clock,
                  title: "Atendimento 24/7",
                  description: "Seu agente IA responde clientes a qualquer hora, todos os dias da semana. Nunca perca uma oportunidade.",
                  delay: 0
                },
                {
                  icon: CheckCircle,
                  title: "Marcações Automáticas",
                  description: "Agenda consultas/reuniões automaticamente diretamente no seu calendário. Zero trabalho manual.",
                  delay: 0.1
                },
                {
                  icon: Zap,
                  title: "Lembretes Inteligentes",
                  description: "Envia lembretes automáticos aos clientes antes das marcações. Reduz faltas em até 80%.",
                  delay: 0.2
                }
              ].map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: benefit.delay, duration: 0.5 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <Card className="border-primary/30 bg-card/50 backdrop-blur h-full relative overflow-hidden group cursor-pointer transition-all hover:shadow-xl hover:shadow-primary/20 hover:border-primary/60">
                      {/* Animated gradient background */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.08) 0%, transparent 70%)"
                        }}
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      
                      {/* Shine effect */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100"
                        initial={false}
                        animate={{
                          background: [
                            "linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.15) 50%, transparent 100%)",
                            "linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.15) 50%, transparent 100%)"
                          ],
                          x: ["-200%", "200%"]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1,
                          ease: "easeInOut"
                        }}
                      />

                      <CardContent className="p-6 relative z-10">
                        <motion.div
                          whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="h-12 w-12 text-primary mb-4" />
                        </motion.div>
                        <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                        <p className="text-muted-foreground">
                          {benefit.description}
                        </p>
                      </CardContent>

                      {/* Corner glow accent */}
                      <motion.div
                        className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                        animate={{
                          scale: [1, 1.3, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Price Breakdown */}
            <div className="bg-card/80 border border-primary/30 rounded-2xl p-4 sm:p-6 md:p-8 mb-12">
              <div className="max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                  <span className="text-lg sm:text-xl font-semibold">Setup + Configuração Completa</span>
                  <div className="text-left sm:text-right">
                    <span className="text-xl sm:text-2xl line-through text-muted-foreground mr-3">€800</span>
                    <span className="text-2xl sm:text-3xl font-bold text-primary">€500</span>
                  </div>
                </div>
                <div className="border-t border-border pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-sm text-muted-foreground">+ Servidor (após setup)</span>
                  <span className="text-lg sm:text-xl font-semibold">€50/mês</span>
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
