import * as z from "zod";

export const formSchema = z.object({
  client_name: z.string().min(1, "Nome do cliente é obrigatório"),
  campaign_name: z.string().min(1, "Nome da campanha é obrigatório"),
  report_period_start: z.string().min(1, "Data de início é obrigatória"),
  report_period_end: z.string().min(1, "Data de fim é obrigatória"),
  report_type: z.enum(["weekly", "monthly"]),
  ad_sets_count: z.number().min(0, "Valor deve ser positivo").optional().nullable(),
  impressions: z.number().min(0, "Valor deve ser positivo").optional().nullable(),
  clicks: z.number().min(0, "Valor deve ser positivo").optional().nullable(),
  ctr: z.number().min(0, "Valor deve ser positivo").optional().nullable(),
  cpc: z.number().min(0, "Valor deve ser positivo").optional().nullable(),
  spend: z.number().min(0, "Valor deve ser positivo").optional().nullable(),
  conversions: z.number().min(0, "Valor deve ser positivo").optional().nullable(),
  conversion_rate: z.number().min(0, "Valor deve ser positivo").optional().nullable(),
  cost_per_conversion: z.number().min(0, "Valor deve ser positivo").optional().nullable(),
  roas: z.number().min(0, "Valor deve ser positivo").optional().nullable(),
  notes: z.string().optional(),
  status: z.enum(["draft", "final"]),
});

export type FormData = z.infer<typeof formSchema>;