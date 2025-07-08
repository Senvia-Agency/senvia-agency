
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
  if (clicks && impressions && impressions > 0) {
    results.ctr = Number(((clicks / impressions) * 100).toFixed(2));
    console.log('CTR Calculado:', results.ctr.toFixed(2), '% - Cliques:', clicks, 'Impressões:', impressions);
  }
  
  // Taxa de Conversão = (Conversões / Cliques) × 100
  if (conversions && clicks && clicks > 0) {
    results.conversionRate = Number(((conversions / clicks) * 100).toFixed(2));
  }
  
  // Custo por Conversão = Investimento / Conversões
  if (spend && conversions && conversions > 0) {
    results.costPerConversion = Number((spend / conversions).toFixed(2));
  }
  
  // ROAS = Receita / Investimento (estimativa básica)
  if (spend && conversions && conversions > 0 && spend > 0) {
    results.roas = Number(((conversions * 10) / spend).toFixed(2));
  }

  return results;
};
