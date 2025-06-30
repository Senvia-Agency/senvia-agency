
import { useMemo } from "react";
import { Sale } from "@/hooks/useSales";

export const useSalesFilters = (
  sales: Sale[] | undefined,
  searchTerm: string,
  statusFilter: string,
  paymentFilter: string
) => {
  return useMemo(() => {
    if (!sales) return [];
    
    return sales.filter(sale => {
      const matchesSearch = 
        sale.sale_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customers?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customers?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || sale.sale_status === statusFilter;
      const matchesPayment = paymentFilter === "all" || sale.payment_status === paymentFilter;
      
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [sales, searchTerm, statusFilter, paymentFilter]);
};
