import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BasicFields } from "./BasicFields";
import { MetricsFields } from "./MetricsFields";
import { NotesField } from "./NotesField";
import { formSchema, FormData } from "./types";
import { calculateAutomaticValues } from "./utils";

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
      ad_sets_count: undefined,
      impressions: undefined,
      clicks: undefined,
      ctr: undefined,
      cpc: undefined,
      spend: undefined,
      conversions: undefined,
      conversion_rate: undefined,
      cost_per_conversion: undefined,
      roas: undefined,
      notes: "",
      status: "draft",
    },
  });

  // Calcular valores automáticos
  const watchedValues = form.watch();
  
  useEffect(() => {
    const { impressions, clicks, conversions, spend } = watchedValues;
    
    const calculatedValues = calculateAutomaticValues(impressions, clicks, conversions, spend);
    
    // Sempre atualizar os valores calculados se mudaram
    if (calculatedValues.ctr !== undefined && calculatedValues.ctr !== form.getValues('ctr')) {
      form.setValue('ctr', calculatedValues.ctr);
    }
    
    if (calculatedValues.conversionRate !== undefined && calculatedValues.conversionRate !== form.getValues('conversion_rate')) {
      form.setValue('conversion_rate', calculatedValues.conversionRate);
    }
    
    if (calculatedValues.costPerConversion !== undefined && calculatedValues.costPerConversion !== form.getValues('cost_per_conversion')) {
      form.setValue('cost_per_conversion', calculatedValues.costPerConversion);
    }
    
    if (calculatedValues.roas !== undefined && calculatedValues.roas !== form.getValues('roas')) {
      form.setValue('roas', calculatedValues.roas);
    }
  }, [watchedValues.impressions, watchedValues.clicks, watchedValues.conversions, watchedValues.spend, form]);

  const onSubmit = async (data: FormData) => {
    console.log('Dados do formulário antes do envio:', data);
    setLoading(true);
    
    try {
      // Preparar dados garantindo que valores sejam números válidos ou null
      const submitData = {
        client_name: data.client_name,
        campaign_name: data.campaign_name,
        report_period_start: data.report_period_start,
        report_period_end: data.report_period_end,
        report_type: data.report_type,
        ad_sets_count: data.ad_sets_count ?? null,
        impressions: data.impressions ?? null,
        clicks: data.clicks ?? null,
        ctr: data.ctr ?? null,
        cpc: data.cpc ?? null,
        spend: data.spend ?? null,
        conversions: data.conversions ?? null,
        conversion_rate: data.conversion_rate ?? null,
        cost_per_conversion: data.cost_per_conversion ?? null,
        roas: data.roas ?? null,
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
              <BasicFields form={form} />
              <MetricsFields form={form} />
            </div>

            <NotesField form={form} />

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