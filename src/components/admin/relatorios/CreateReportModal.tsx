
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const formSchema = z.object({
  client_name: z.string().min(1, "Nome do cliente é obrigatório"),
  campaign_name: z.string().min(1, "Nome da campanha é obrigatório"),
  report_period_start: z.string().min(1, "Data de início é obrigatória"),
  report_period_end: z.string().min(1, "Data de fim é obrigatória"),
  report_type: z.enum(["weekly", "monthly"]),
  ad_sets_count: z.number().min(0, "Valor deve ser positivo").optional(),
  impressions: z.number().min(0, "Valor deve ser positivo").optional(),
  clicks: z.number().min(0, "Valor deve ser positivo").optional(),
  ctr: z.number().min(0, "Valor deve ser positivo").optional(),
  cpc: z.number().min(0, "Valor deve ser positivo").optional(),
  spend: z.number().min(0, "Valor deve ser positivo").optional(),
  conversions: z.number().min(0, "Valor deve ser positivo").optional(),
  conversion_rate: z.number().min(0, "Valor deve ser positivo").optional(),
  cost_per_conversion: z.number().min(0, "Valor deve ser positivo").optional(),
  roas: z.number().min(0, "Valor deve ser positivo").optional(),
  notes: z.string().optional(),
  status: z.enum(["draft", "final"]),
});

type FormData = z.infer<typeof formSchema>;

interface CreateReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateReportModal = ({ open, onOpenChange, onSuccess }: CreateReportModalProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_name: "",
      campaign_name: "",
      report_period_start: "",
      report_period_end: "",
      report_type: "weekly",
      ad_sets_count: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      cpc: 0,
      spend: 0,
      conversions: 0,
      conversion_rate: 0,
      cost_per_conversion: 0,
      roas: 0,
      notes: "",
      status: "draft",
    },
  });

  // Calcular valores automáticos
  const watchedValues = form.watch();
  
  useEffect(() => {
    const { impressions, clicks, conversions, spend } = watchedValues;
    
    // CTR = (Clicks / Impressions) × 100
    if (clicks && impressions && impressions > 0) {
      const ctr = (clicks / impressions) * 100;
      form.setValue('ctr', Number(ctr.toFixed(2)));
      console.log('CTR Calculado:', ctr.toFixed(2), '% - Cliques:', clicks, 'Impressões:', impressions);
    }
    
    // Taxa de Conversão = (Conversões / Cliques) × 100
    if (conversions && clicks && clicks > 0) {
      const conversionRate = (conversions / clicks) * 100;
      form.setValue('conversion_rate', Number(conversionRate.toFixed(2)));
    }
    
    // Custo por Conversão = Investimento / Conversões
    if (spend && conversions && conversions > 0) {
      const costPerConversion = spend / conversions;
      form.setValue('cost_per_conversion', Number(costPerConversion.toFixed(2)));
    }
    
    // ROAS = Receita / Investimento (estimativa básica)
    if (spend && conversions && conversions > 0 && spend > 0) {
      const roas = conversions * 10 / spend; // Estimativa básica
      form.setValue('roas', Number(roas.toFixed(2)));
    }
  }, [watchedValues.impressions, watchedValues.clicks, watchedValues.conversions, watchedValues.spend, form]);

  const onSubmit = async (data: FormData) => {
    console.log('Iniciando criação de relatório com dados:', data);
    setLoading(true);
    
    try {
      // Preparar dados garantindo que campos numéricos sejam tratados corretamente
      const submitData = {
        client_name: data.client_name,
        campaign_name: data.campaign_name,
        report_period_start: data.report_period_start,
        report_period_end: data.report_period_end,
        report_type: data.report_type,
        ad_sets_count: data.ad_sets_count || 0,
        impressions: data.impressions || 0,
        clicks: data.clicks || 0,
        ctr: data.ctr || 0,
        cpc: data.cpc || 0,
        spend: data.spend || 0,
        conversions: data.conversions || 0,
        conversion_rate: data.conversion_rate || 0,
        cost_per_conversion: data.cost_per_conversion || 0,
        roas: data.roas || 0,
        notes: data.notes || null,
        status: data.status,
      };

      console.log('Dados preparados para envio:', submitData);

      const { data: result, error } = await supabase
        .from('marketing_reports')
        .insert([submitData])
        .select();

      if (error) {
        console.error('Erro do Supabase:', error);
        throw error;
      }

      console.log('Relatório criado com sucesso:', result);
      toast.success('Relatório criado com sucesso');
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Erro ao criar relatório:', error);
      toast.error('Erro ao criar relatório: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Criar Novo Relatório</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="client_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Nome do Cliente</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Ex: Empresa ABC"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="campaign_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Nome da Campanha</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Ex: Campanha Verão 2024"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="report_period_start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Data de Início</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field} 
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="report_period_end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Data de Fim</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field} 
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="report_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Tipo de Relatório</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ad_sets_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Conjuntos de Anúncios</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        value={field.value?.toString() || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : parseInt(value) || 0);
                        }}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Ex: 5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="impressions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Impressões</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        value={field.value?.toString() || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : parseInt(value) || 0);
                        }}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Ex: 14226"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clicks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Cliques</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        value={field.value?.toString() || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : parseInt(value) || 0);
                        }}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Ex: 249"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ctr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">CTR (%) - Automático</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        value={field.value?.toString() || ""}
                        readOnly
                        className="bg-gray-700 border-gray-600 text-gray-300 cursor-not-allowed"
                        placeholder="Calculado automaticamente"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cpc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">CPC (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.001"
                        min="0"
                        value={field.value?.toString() || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            field.onChange(0);
                          } else {
                            const numValue = parseFloat(value);
                            if (!isNaN(numValue) && numValue >= 0) {
                              field.onChange(numValue);
                            }
                          }
                        }}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Ex: 0.07"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="spend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Investimento (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        value={field.value?.toString() || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : parseFloat(value) || 0);
                        }}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Ex: 100.50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="conversions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Conversões</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        value={field.value?.toString() || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : parseInt(value) || 0);
                        }}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Ex: 12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="conversion_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Taxa de Conversão (%) - Automático</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        value={field.value?.toString() || ""}
                        readOnly
                        className="bg-gray-700 border-gray-600 text-gray-300 cursor-not-allowed"
                        placeholder="Calculado automaticamente"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cost_per_conversion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Custo por Conversão (€) - Automático</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        value={field.value?.toString() || ""}
                        readOnly
                        className="bg-gray-700 border-gray-600 text-gray-300 cursor-not-allowed"
                        placeholder="Calculado automaticamente"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">ROAS - Automático</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        value={field.value?.toString() || ""}
                        readOnly
                        className="bg-gray-700 border-gray-600 text-gray-300 cursor-not-allowed"
                        placeholder="Calculado automaticamente"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Rascunho</SelectItem>
                        <SelectItem value="final">Final</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Adicione observações sobre a campanha..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-senvia-500 hover:bg-senvia-600 text-white"
              >
                {loading ? "Criando..." : "Criar Relatório"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
