import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Select from "react-select";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

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

const LandingPageForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <div className="w-full max-w-none mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormLabel className="text-sm sm:text-base md:text-lg font-semibold block mb-1 sm:mb-2">Nome completo *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Seu nome completo" 
                      className="w-full h-11 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg px-3 sm:px-4 md:px-6 border-2 focus:border-senvia-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormLabel className="text-sm sm:text-base md:text-lg font-semibold block mb-1 sm:mb-2">E-mail *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="seu@email.com"
                      className="w-full h-11 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg px-3 sm:px-4 md:px-6 border-2 focus:border-senvia-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormLabel className="text-sm sm:text-base md:text-lg font-semibold block mb-1 sm:mb-2">WhatsApp *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="910320111"
                      className="w-full h-11 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg px-3 sm:px-4 md:px-6 border-2 focus:border-senvia-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormLabel className="text-sm sm:text-base md:text-lg font-semibold block mb-1 sm:mb-2">Nome do negócio</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nome da sua empresa/marca"
                      className="w-full h-11 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg px-3 sm:px-4 md:px-6 border-2 focus:border-senvia-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base md:text-lg font-semibold block mb-1 sm:mb-2">Website / Instagram</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="www.seusite.com ou @seuinstagram"
                      className="w-full h-11 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg px-3 sm:px-4 md:px-6 border-2 focus:border-senvia-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base md:text-lg font-semibold block mb-1 sm:mb-2">Objetivo principal *</FormLabel>
                  <FormControl>
                    <Select
                      options={objectiveOptions}
                      placeholder="Selecione seu objetivo"
                      value={objectiveOptions.find(option => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || "")}
                      className="react-select-container w-full"
                      classNamePrefix="react-select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: '48px',
                          color: '#000000',
                          fontSize: '16px',
                          paddingLeft: '12px',
                          border: '2px solid #e2e8f0',
                          '&:hover': {
                            borderColor: '#00c3ff'
                          }
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: '#000000',
                          fontSize: '16px'
                        }),
                        option: (base) => ({
                          ...base,
                          color: '#000000',
                          fontSize: '16px',
                          padding: '12px 16px'
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: '#666666',
                          fontSize: '16px'
                        })
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-3 sm:pt-4 md:pt-6">
            <Button 
              type="submit" 
              className="w-full h-auto py-3 sm:py-4 md:py-6 px-4 sm:px-6 md:px-8 text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 min-h-[48px] sm:min-h-[56px] md:min-h-[64px] rounded-xl"
              style={{ color: '#000000' }}
              disabled={isSubmitting}
            >
              <span className="flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-sm sm:text-base md:text-lg font-semibold">
                  {isSubmitting ? "Enviando..." : "Falar com especialista"}
                </span>
                {!isSubmitting && <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0" />}
              </span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LandingPageForm;
