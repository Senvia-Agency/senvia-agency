
export const calculateAutomaticValues = (
  impressions?: number,
  clicks?: number,
  conversions?: number,
  spend?: number
) => {
  const results: {
    ctr?: number;
    conversionRate?: number;
    costPerConversion?: number;
    roas?: number;
  } = {};

  // CTR = (Clicks / Impressions) × 100
  if (clicks !== undefined && impressions !== undefined && impressions > 0) {
    results.ctr = Number(((clicks / impressions) * 100).toFixed(4));
  }
  
  // Taxa de Conversão = (Conversões / Cliques) × 100
  if (conversions !== undefined && clicks !== undefined && clicks > 0) {
    results.conversionRate = Number(((conversions / clicks) * 100).toFixed(4));
  }
  
  // Custo por Conversão = Investimento / Conversões
  if (spend !== undefined && conversions !== undefined && conversions > 0) {
    results.costPerConversion = Number((spend / conversions).toFixed(4));
  }
  
  // ROAS = (Conversões × Valor médio por conversão) / Investimento
  // Usando um valor estimado de €50 por conversão como padrão
  if (spend !== undefined && conversions !== undefined && conversions > 0 && spend > 0) {
    const revenuePerConversion = 50; // Valor estimado por conversão em euros
    const totalRevenue = conversions * revenuePerConversion;
    results.roas = Number((totalRevenue / spend).toFixed(4));
  }

  return results;
};
