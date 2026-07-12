
import { useQuery } from "@tanstack/react-query";
import { fetchCustomerTransactions } from "@/services/customerService";

export const useCustomerTransactions = (customerId?: string) => {
  return useQuery({
    queryKey: ['customer-transactions', customerId],
    queryFn: () => fetchCustomerTransactions(customerId),
    refetchInterval: 10000,
  });
};
