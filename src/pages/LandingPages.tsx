import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Select from "react-select";
import { CheckCircle, ArrowRight, Clock, Users, Zap, Target, MessageSquare, Shield, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { useToast } from "../hooks/use-toast";

const formSchema = z.object({
  fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(9, "Telefone inválido"),
  businessName: z.string().optional(),
  website: z.string().optional(),
  objective: z.string().min(1, "Selecione um objetivo")
});

type FormData = z.infer<typeof formSchema>;

const objectiveOptions = [
  { value: "aumentar-vendas", label: "Aumentar vendas" },
  { value: "captar-leads", label: "Captar mais leads" },
  { value: "automatizar-atendimento", label: "Automatizar atendimentos" },
  { value: "lancar-produto", label: "Lançar novo produto" },
  { value: "outro", label: "Outro" }
];

const LandingPages = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Landing Pages Inteligentes | SENVIA";
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      businessName: "",
      website: "",
      objective: ""
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Salvar o lead na base de dados
      const { error } = await supabase
        .from('landing_page_leads')
        .insert({
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          country_code: '+351',
          business_name: data.businessName,
          website: data.website,
          objective: data.objective,
          status: 'new',
          priority: 1,
          source: 'landing_page'
        });

      if (error) throw error;
      
      // Redirecionar para página de agradecimento
      navigate('/obrigado');
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
      toast({
        title: "Erro",
        description: "Tente novamente ou contacte-nos diretamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const benefits = [
    {
      icon: "📈",
      title: "Mais leads organizados e convertidos",
      description: "Sistema completo de captação e conversão"
    },
    {
      icon: "⏱",
      title: "Economia de tempo com automações",
      description: "Fluxos automáticos que trabalham 24/7"
    },
    {
      icon: "💬",
      title: "Comunicação inteligente via WhatsApp",
      description: "Conexão direta e imediata com clientes"
    },
    {
      icon: "✅",
      title: "Conformidade legal com páginas obrigatórias",
      description: "RGPD, termos e políticas incluídos"
    },
    {
      icon: "💡",
      title: "Profissionalismo que gera confiança",
      description: "Design e copy que transmitem credibilidade"
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Análise gratuita",
      description: "Você preenche o formulário ou fala com a nossa equipa"
    },
    {
      number: "02",
      title: "Estratégia personalizada",
      description: "Planejamos a melhor estrutura para seu objetivo"
    },
    {
      number: "03",
      title: "Execução completa",
      description: "Criamos e ativamos a sua estrutura inteligente"
    },
    {
      number: "04",
      title: "Entrega e acompanhamento",
      description: "Entregamos tudo e ajudamos você a usar"
    }
  ];

  const faqItems = [
    {
      question: "Este serviço serve para qualquer tipo de negócio?",
      answer: "Sim! Criamos estruturas personalizadas para consultores, coaches, clínicas, e-commerce, serviços locais e qualquer negócio que precise captar leads online."
    },
    {
      question: "Eu preciso saber programar ou usar ferramentas complicadas?",
      answer: "Não! Criamos tudo para você e fornecemos treinamento simples. A gestão é feita através de painéis intuitivos que qualquer pessoa consegue usar."
    },
    {
      question: "Quanto tempo leva para entregar?",
      answer: "O projeto completo fica pronto em até 7 dias úteis, incluindo todas as integrações, automações e testes."
    },
    {
      question: "Posso conectar com o WhatsApp do meu negócio?",
      answer: "Sim! Integramos com o seu número de WhatsApp Business e configuramos botão flutuante + automações inteligentes."
    },
    {
      question: "Tenho suporte caso precise de ajuda depois?",
      answer: "Claro! Incluímos 30 dias de suporte gratuito e depois disso oferecemos planos de manutenção acessíveis."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-senvia-500/10 via-transparent to-senvia-400/10">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transforme sua presença digital em uma{" "}
              <span className="text-gradient">máquina de captação de clientes</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              A estrutura completa, profissional e automatizada para quem quer atrair, 
              nutrir e converter clientes — sem depender de plataformas complicadas.
            </p>
            
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 mb-12"
              style={{ color: '#000000' }}
              onClick={() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Quero a minha estrutura inteligente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-senvia-500/20 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
              <p className="text-sm text-muted-foreground">
                "Empreendedores em Portugal e no Brasil já estão usando nossas estruturas para captar leads todos os dias com previsibilidade."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciação */}
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

      {/* Benefícios */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Seu negócio com presença, <span className="text-gradient">performance e previsibilidade</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="text-3xl">{benefit.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Antes e Depois */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              A <span className="text-gradient">transformação</span> que você vai ter
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-red-600">Antes</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Página simples e genérica</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Leads soltos no WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Atendimento manual</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Nenhum e-mail enviado</span>
                  </div>
                </div>
              </div>

              <div className="bg-senvia-500/10 border border-senvia-500/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-senvia-400">Depois</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-senvia-400" />
                    <span>Landing com copy estratégica</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-senvia-400" />
                    <span>Leads centralizados no CRM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-senvia-400" />
                    <span>Botão flutuante com IA</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-senvia-400" />
                    <span>Fluxo de e-mails automáticos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Intermediário */}
      <section className="py-20 px-4 bg-gradient-to-br from-senvia-500/20 via-transparent to-senvia-400/20">
        <div className="container mx-auto text-center">
          <Button 
            size="lg" 
            className="text-xl px-10 py-6 bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300"
            style={{ color: '#000000' }}
            onClick={() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Solicitar minha estrutura personalizada
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </div>
      </section>

      {/* Processo */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Como funciona o <span className="text-gradient">nosso processo</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-senvia-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-senvia-400">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-gradient">Perguntas Frequentes</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Formulário */}
      <section id="form" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sua estrutura profissional <span className="text-gradient">começa com um passo</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dê adeus aos formulários soltos, páginas genéricas e atendimento desorganizado.
              Construa a base digital do seu negócio com inteligência e performance.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border border-senvia-500/20">
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo *</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp *</FormLabel>
                          <FormControl>
                            <Input placeholder="910320111" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do negócio</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da sua empresa/marca" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website / Instagram</FormLabel>
                          <FormControl>
                            <Input placeholder="www.seusite.com ou @seuinstagram" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="objective"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Objetivo principal *</FormLabel>
                          <FormControl>
                             <Select
                              options={objectiveOptions}
                              placeholder="Selecione seu objetivo"
                              value={objectiveOptions.find(option => option.value === field.value)}
                              onChange={(option) => field.onChange(option?.value || "")}
                              className="react-select-container"
                              classNamePrefix="react-select"
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  color: '#000000'
                                }),
                                singleValue: (base) => ({
                                  ...base,
                                  color: '#000000'
                                }),
                                option: (base) => ({
                                  ...base,
                                  color: '#000000'
                                }),
                                placeholder: (base) => ({
                                  ...base,
                                  color: '#666666'
                                })
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full text-lg py-6 bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300"
                      style={{ color: '#000000' }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enviando..." : "Falar com especialista"}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPages;