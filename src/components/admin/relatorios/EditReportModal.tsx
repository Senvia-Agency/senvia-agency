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

interface MarketingReport {
  id: string;
  client_name: string;
  campaign_name: string;
  report_period_start: string;
  report_period_end: string;
  report_type: string;
  ad_sets_count: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  spend: number;
  conversions: number;
  conversion_rate: number;
  cost_per_conversion: number;
  roas: number;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface EditReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: MarketingReport;
  onSuccess: () => void;
}

export const EditReportModal = ({ open, onOpenChange, report, onSuccess }: EditReportModalProps) => {
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

  // Preencher formulário com dados do relatório
  useEffect(() => {
    if (report && open) {
      form.reset({
        client_name: report.client_name,
        campaign_name: report.campaign_name,
        report_period_start: report.report_period_start,
        report_period_end: report.report_period_end,
        report_type: report.report_type as "weekly" | "monthly",
        ad_sets_count: report.ad_sets_count || undefined,
        impressions: report.impressions || undefined,
        clicks: report.clicks || undefined,
        ctr: report.ctr || undefined,
        cpc: report.cpc || undefined,
        spend: report.spend || undefined,
        conversions: report.conversions || undefined,
        conversion_rate: report.conversion_rate || undefined,
        cost_per_conversion: report.cost_per_conversion || undefined,
        roas: report.roas || undefined,
        notes: report.notes || "",
        status: report.status as "draft" | "final",
      });
    }
  }, [report, open, form]);

  // Calcular valores automáticos
  const watchedValues = form.watch();
  
  useEffect(() => {
    const { impressions, clicks, conversions, spend } = watchedValues;
    
    const calculatedValues = calculateAutomaticValues(impressions, clicks, conversions, spend);
    
    if (calculatedValues.ctr !== undefined) {
      form.setValue('ctr', calculatedValues.ctr);
    }
    
    if (calculatedValues.conversionRate !== undefined) {
      form.setValue('conversion_rate', calculatedValues.conversionRate);
    }
    
    if (calculatedValues.costPerConversion !== undefined) {
      form.setValue('cost_per_conversion', calculatedValues.costPerConversion);
    }
    
    if (calculatedValues.roas !== undefined) {
      form.setValue('roas', calculatedValues.roas);
    }
  }, [watchedValues.impressions, watchedValues.clicks, watchedValues.conversions, watchedValues.spend, form]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    
    try {
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

      const { error } = await supabase
        .from('marketing_reports')
        .update(submitData)
        .eq('id', report.id);

      if (error) throw error;

      toast.success('Relatório atualizado com sucesso');
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Erro ao atualizar relatório:', error);
      toast.error('Erro ao atualizar relatório: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Editar Relatório</DialogTitle>
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
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};