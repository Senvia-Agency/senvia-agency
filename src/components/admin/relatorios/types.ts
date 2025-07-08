import * as z from "zod";

export const formSchema = z.object({
  client_name: z.string().min(1, "Nome do cliente é obrigatório"),
  campaign_name: z.string().min(1, "Nome da campanha é obrigatório"),
  report_period_start: z.string().min(1, "Data de início é obrigatória"),
  report_period_end: z.string().min(1, "Data de fim é obrigatória"),
  report_type: z.enum(["weekly", "monthly"]),
  ad_sets_count: z.number().min(0).optional().nullable(),
  impressions: z.number().min(0).optional().nullable(),
  clicks: z.number().min(0).optional().nullable(),
  ctr: z.number().min(0).optional().nullable(),
  cpc: z.number().min(0).optional().nullable(),
  spend: z.number().min(0).optional().nullable(),
  conversions: z.number().min(0).optional().nullable(),
  conversion_rate: z.number().min(0).optional().nullable(),
  cost_per_conversion: z.number().min(0).optional().nullable(),
  roas: z.number().min(0).optional().nullable(),
  notes: z.string().optional(),
  status: z.enum(["draft", "final"]),
});

export type FormData = z.infer<typeof formSchema>;