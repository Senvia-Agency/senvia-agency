import { useEffect } from "react";
import { CheckCircle, MessageSquare, Calendar, Volume2, Mail, Smartphone, Clock, Star, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";

const SenviaAssistant = () => {
  useEffect(() => {
    document.title = "SENVIA Assistant | Robô de Agendamento por IA";
  }, []);

  const features = [
    {
      icon: MessageSquare,
      title: "Conversas Inteligentes",
      description: "Responde automaticamente via WhatsApp com IA avançada, entendendo contexto e necessidades do cliente."
    },
    {
      icon: Volume2,
      title: "Áudios Personalizados",
      description: "Recebe e envia mensagens de áudio com voz natural, criando uma experiência mais humana."
    },
    {
      icon: Calendar,
      title: "Gestão Completa de Agenda",
      description: "Marca, altera e cancela agendamentos diretamente no Google Calendar de forma automática."
    },
    {
      icon: Mail,
      title: "Notificações Inteligentes",
      description: "Envia lembretes e confirmações por email e WhatsApp para reduzir faltas."
    },
    {
      icon: Smartphone,
      title: "Integração WhatsApp",
      description: "Funciona 24/7 no WhatsApp da sua empresa, sem necessidade de apps extras."
    },
    {
      icon: Clock,
      title: "Disponibilidade Total",
      description: "Atende seus clientes a qualquer hora, aumentando suas conversões e vendas."
    }
  ];

  const benefits = [
    "Reduz até 80% do tempo gasto com agendamentos",
    "Aumenta a taxa de conversão de leads",
    "Elimina agendamentos duplicados ou conflitos",
    "Melhora a experiência do cliente",
    "Funciona mesmo quando você está ocupado",
    "Personalização completa para seu negócio"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">SENVIA Assistant</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              O Robô de IA que Revoluciona seus Agendamentos
            </p>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Automatize 100% dos seus agendamentos via WhatsApp com Inteligência Artificial. 
              Seu assistente virtual trabalha 24/7, responde áudios, marca na agenda e nunca perde um cliente.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300"
                style={{ color: '#000000' }}
              >
                Começar Teste Grátis de 7 Dias
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-6"
                style={{ color: '#000000' }}
              >
                Ver Demonstração
              </Button>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-senvia-500/20 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
              <p className="text-sm text-muted-foreground">
                "Aumentei 300% meus agendamentos desde que implementei o SENVIA Assistant"
              </p>
              <p className="text-xs text-senvia-400 mt-1">- Maria Silva, Clínica de Estética</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient">Funcionalidades Poderosas</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para automatizar completamente seus agendamentos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 hover:border-senvia-500/50 transition-all duration-300 group"
              >
                <div className="bg-senvia-500/10 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-senvia-500/20 transition-colors duration-300">
                  <feature.icon className="h-8 w-8 text-senvia-400" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Transforme seu Negócio com <span className="text-gradient">IA Avançada</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                O SENVIA Assistant não é apenas um chatbot. É um assistente inteligente que entende seu negócio 
                e trabalha incansavelmente para converter mais clientes.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-senvia-400 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-senvia-500/20 via-transparent to-senvia-400/20 rounded-3xl p-8 border border-senvia-500/30">
                <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-6 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-muted-foreground">WhatsApp Business</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm">Cliente: "Gostaria de agendar uma consulta para amanhã"</p>
                    </div>
                    <div className="bg-senvia-500/20 rounded-lg p-3 ml-8">
                      <p className="text-sm">SENVIA Assistant: "Claro! Tenho disponibilidade às 14h ou 16h. Qual prefere?"</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm">Cliente: "16h está perfeito!"</p>
                    </div>
                    <div className="bg-senvia-500/20 rounded-lg p-3 ml-8">
                      <p className="text-sm">SENVIA Assistant: "Agendamento confirmado! Você receberá um lembrete por email."</p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-xs text-senvia-400">Conversação 100% automatizada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient">Plano de Lançamento</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Comece hoje mesmo com nossa oferta especial
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="bg-gradient-to-br from-senvia-500/10 via-card/50 to-senvia-400/10 backdrop-blur-sm rounded-3xl p-8 border-2 border-senvia-500/30 relative overflow-hidden">
              {/* Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-senvia-500 to-senvia-400 text-black px-6 py-2 rounded-full text-sm font-bold">
                  🚀 OFERTA DE LANÇAMENTO
                </div>
              </div>

              <div className="text-center mt-6">
                <h3 className="text-2xl font-bold mb-2">SENVIA Assistant Pro</h3>
                <p className="text-muted-foreground mb-6">Perfeito para começar a automatizar</p>
                
                <div className="mb-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-5xl font-bold text-gradient">20€</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  <div className="bg-senvia-500/20 text-senvia-400 px-4 py-2 rounded-full text-sm font-medium inline-block">
                    7 dias grátis • Sem compromisso
                  </div>
                </div>

                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-senvia-400" />
                    <span>Até 1.000 conversas/mês</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-senvia-400" />
                    <span>Integração Google Calendar</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-senvia-400" />
                    <span>Mensagens de áudio</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-senvia-400" />
                    <span>Notificações por email</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-senvia-400" />
                    <span>Personalização completa</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-senvia-400" />
                    <span>Suporte 24/7</span>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full text-lg py-6 bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300"
                  style={{ color: '#000000' }}
                >
                  Começar Teste Grátis Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <p className="text-xs text-muted-foreground mt-4">
                  Cancele a qualquer momento • Sem taxas de setup
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-senvia-500/10 via-transparent to-senvia-400/10">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para <span className="text-gradient">Automatizar seus Agendamentos?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Junte-se a centenas de empresas que já transformaram seu atendimento com o SENVIA Assistant. 
              Teste grátis por 7 dias e veja a diferença.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-xl px-10 py-6 bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300"
                style={{ color: '#000000' }}
              >
                Começar Agora - É Grátis!
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </div>

            <div className="mt-8 flex justify-center items-center gap-8 text-sm text-muted-foreground">
              <span>✓ Setup em 5 minutos</span>
              <span>✓ Sem contratos</span>
              <span>✓ Suporte em português</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SenviaAssistant;