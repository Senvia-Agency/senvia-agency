
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
    <div className="w-full max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Nome completo *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Seu nome completo" 
                      className="w-full h-11 text-sm"
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
                  <FormLabel className="text-sm font-medium">E-mail *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="seu@email.com"
                      className="w-full h-11 text-sm"
                      {...field} 
                    />
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
                  <FormLabel className="text-sm font-medium">WhatsApp *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="910320111"
                      className="w-full h-11 text-sm"
                      {...field} 
                    />
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
                  <FormLabel className="text-sm font-medium">Nome do negócio</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nome da sua empresa/marca"
                      className="w-full h-11 text-sm"
                      {...field} 
                    />
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
                  <FormLabel className="text-sm font-medium">Website / Instagram</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="www.seusite.com ou @seuinstagram"
                      className="w-full h-11 text-sm"
                      {...field} 
                    />
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
                  <FormLabel className="text-sm font-medium">Objetivo principal *</FormLabel>
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
                          minHeight: '44px',
                          color: '#000000',
                          fontSize: '14px'
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: '#000000'
                        }),
                        option: (base) => ({
                          ...base,
                          color: '#000000',
                          fontSize: '14px'
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: '#666666',
                          fontSize: '14px'
                        })
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-medium bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 mt-6"
            style={{ color: '#000000' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Falar com especialista"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LandingPageForm;
