import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Select from "react-select";
import { ArrowRight, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const formSchema = z.object({
  fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  whatsapp: z.string().min(9, "WhatsApp inválido"),
  email: z.string().email("E-mail inválido"),
  companyName: z.string().optional(),
  segment: z.string().min(1, "Selecione um segmento"),
  monthlyClients: z.string().min(1, "Selecione uma opção"),
  gdprConsent: z.boolean().refine(val => val === true, "Deve aceitar o tratamento de dados")
});

type FormData = z.infer<typeof formSchema>;

const segmentOptions = [
  { value: "saude-bem-estar", label: "Saúde e Bem-estar" },
  { value: "beleza-estetica", label: "Beleza e Estética" },
  { value: "servicos-profissionais", label: "Serviços Profissionais" },
  { value: "educacao-consultoria", label: "Educação e Consultoria" },
  { value: "comercio-varejo", label: "Comércio e Varejo" },
  { value: "outro", label: "Outro" }
];

const monthlyClientsOptions = [
  { value: "menos-10", label: "Menos de 10 clientes/mês" },
  { value: "10-50", label: "10 a 50 clientes/mês" },
  { value: "50-100", label: "50 a 100 clientes/mês" },
  { value: "mais-100", label: "Mais de 100 clientes/mês" }
];

const PromoForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      whatsapp: "",
      email: "",
      companyName: "",
      segment: "",
      monthlyClients: "",
      gdprConsent: false
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Get UTM parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const utmMedium = urlParams.get('utm_medium');
      const utmCampaign = urlParams.get('utm_campaign');

      const { error } = await supabase
        .from('leads_ia')
        .insert({
          full_name: data.fullName,
          whatsapp: data.whatsapp,
          email: data.email,
          company_name: data.companyName || null,
          segment: data.segment,
          monthly_clients: parseInt(data.monthlyClients.split('-')[0]) || 0,
          source_page: 'promo_agente_whatsapp',
          lead_status: 'new',
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign
        });

      if (error) throw error;
      
      // Track Facebook Pixel event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: 'Agente WhatsApp Promo',
          content_category: 'AI Agent',
          value: 500,
          currency: 'EUR'
        });
      }
      
      // Track Google Analytics event
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'lead_agente_whatsapp',
          segment: data.segment,
          monthly_clients: data.monthlyClients
        });
      }
      
      setShowThankYou(true);
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

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Nome completo *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Seu nome completo" 
                      className="h-12 border-2 focus:border-primary"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">WhatsApp *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="910320111"
                      className="h-12 border-2 focus:border-primary"
                      {...field} 
                    />
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
                  <FormLabel className="text-base font-semibold">E-mail *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="seu@email.com"
                      className="h-12 border-2 focus:border-primary"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Nome da empresa</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nome da sua empresa"
                      className="h-12 border-2 focus:border-primary"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="segment"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Segmento de atuação *</FormLabel>
                <FormControl>
                  <Select
                    options={segmentOptions}
                    placeholder="Selecione seu segmento"
                    value={segmentOptions.find(option => option.value === field.value)}
                    onChange={(option) => field.onChange(option?.value || "")}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: '48px',
                        border: '2px solid hsl(var(--input))',
                        '&:hover': { borderColor: 'hsl(var(--primary))' }
                      })
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="monthlyClients"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Quantos clientes atende por mês? *</FormLabel>
                <FormControl>
                  <Select
                    options={monthlyClientsOptions}
                    placeholder="Selecione uma opção"
                    value={monthlyClientsOptions.find(option => option.value === field.value)}
                    onChange={(option) => field.onChange(option?.value || "")}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: '48px',
                        border: '2px solid hsl(var(--input))',
                        '&:hover': { borderColor: 'hsl(var(--primary))' }
                      })
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gdprConsent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 border-t pt-6">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium">
                    Aceito o tratamento dos meus dados pessoais *
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Consulte a nossa{" "}
                    <Link 
                      to="/privacy-policy" 
                      className="text-primary hover:underline"
                      target="_blank"
                    >
                      Política de Privacidade
                    </Link>
                  </p>
                </div>
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-xl shadow-lg"
            disabled={isSubmitting || !form.watch('gdprConsent')}
          >
            {isSubmitting ? "Enviando..." : "Garantir Minha Vaga"}
            {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>
        </form>
      </Form>

      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <DialogTitle className="text-center text-xl font-bold">
              Vaga Reservada com Sucesso! 🎉
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Parabéns! Sua vaga para o Agente IA WhatsApp está garantida.
            </p>
            <p className="text-sm text-muted-foreground">
              Nossa equipe entrará em contacto via WhatsApp em até <strong>24 horas</strong> para iniciar a configuração do seu agente.
            </p>
            <Button 
              onClick={() => setShowThankYou(false)}
              className="w-full bg-primary hover:bg-primary/90 font-semibold"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromoForm;
