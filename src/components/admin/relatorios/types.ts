
import * as z from "zod";

export const formSchema = z.object({
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

export type FormData = z.infer<typeof formSchema>;
