
import { useMemo } from "react";
import { Sale } from "@/hooks/useSales";

export const useSalesStats = (sales: Sale[] | undefined) => {
  return useMemo(() => {
    if (!sales) return { totalSales: 0, totalRevenue: 0, totalPaid: 0, pendingSales: 0 };
    
    // Filtrar vendas canceladas dos cálculos
    const activeSales = sales.filter(sale => sale.sale_status !== 'cancelled');
    
    return {
      totalSales: activeSales.length,
      totalRevenue: activeSales.reduce((sum, sale) => sum + Number(sale.total_value), 0),
      totalPaid: activeSales.reduce((sum, sale) => sum + Number(sale.paid_amount), 0),
      pendingSales: activeSales.filter(sale => sale.sale_status === 'pending').length
    };
  }, [sales]);
};
