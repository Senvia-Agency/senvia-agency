
import { useMemo } from "react";
import { Sale } from "@/hooks/useSales";

export const useSalesStats = (sales: Sale[] | undefined) => {
  return useMemo(() => {
    if (!sales) return { totalSales: 0, totalRevenue: 0, totalPaid: 0, pendingSales: 0 };
    
    return {
      totalSales: sales.length,
      totalRevenue: sales.reduce((sum, sale) => sum + Number(sale.total_value), 0),
      totalPaid: sales.reduce((sum, sale) => sum + Number(sale.paid_amount), 0),
      pendingSales: sales.filter(sale => sale.sale_status === 'pending').length
    };
  }, [sales]);
};
