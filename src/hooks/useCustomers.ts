
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCustomersWithTransactions } from "@/services/customerService";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomersWithTransactions,
    refetchInterval: 10000,
  });
};

export const useUpdateCustomer = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerId, updates }: { customerId: string; updates: any }) => {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', customerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar cliente",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

// Re-export other hooks for convenience
export { useCustomerTransactions } from "./useCustomerTransactions";
export { useConvertLeadToCustomer } from "./useConvertLeadToCustomer";
