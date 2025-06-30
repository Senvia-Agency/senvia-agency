
import { useQuery } from "@tanstack/react-query";
import { fetchCustomersWithTransactions } from "@/services/customerService";

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomersWithTransactions,
    refetchInterval: 10000,
  });
};

// Re-export other hooks for convenience
export { useCustomerTransactions } from "./useCustomerTransactions";
export { useConvertLeadToCustomer } from "./useConvertLeadToCustomer";
