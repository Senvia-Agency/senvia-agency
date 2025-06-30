import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useUpdateSale } from "@/hooks/useSales";
import { ProjectCard } from "./components/ProjectCard";

type SaleStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

interface Sale {
  id: string;
  sale_number: string;
  service_name: string;
  service_description?: string;
  total_value: number;
  paid_amount: number;
  sale_status: SaleStatus;
  payment_status: 'pending' | 'partial' | 'paid' | 'overdue';
  sale_date: string;
  expected_delivery_date?: string;
  delivered_at?: string;
  created_at: string;
  assigned_to?: string;
}

interface CustomerProjectsSectionProps {
  customerId: string;
}

const CustomerProjectsSection = ({ customerId }: CustomerProjectsSectionProps) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { data: adminUsers, isLoading: adminUsersLoading, error: adminUsersError } = useAdminUsers();
  const updateSale = useUpdateSale();

  // Debug dos usuários admin
  useEffect(() => {
    if (adminUsers) {
      console.log('CustomerProjectsSection - AdminUsers carregados:', adminUsers);
      console.log('CustomerProjectsSection - Número de admin users:', adminUsers.length);
    }
    if (adminUsersError) {
      console.error('CustomerProjectsSection - Erro ao carregar admin users:', adminUsersError);
    }
  }, [adminUsers, adminUsersError]);

  useEffect(() => {
    const fetchCustomerSales = async () => {
      try {
        const { data, error } = await supabase
          .from('sales')
          .select('*')
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar vendas do cliente:', error);
          return;
        }

        setSales(data || []);
      } catch (error) {
        console.error('Erro ao buscar vendas:', error);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomerSales();
    }
  }, [customerId]);

  const updateSaleStatus = async (saleId: string, newStatus: SaleStatus) => {
    try {
      await updateSale.mutateAsync({
        id: saleId,
        updates: { sale_status: newStatus }
      });

      setSales(prev => prev.map(sale => 
        sale.id === saleId ? { ...sale, sale_status: newStatus } : sale
      ));
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const updateSaleAssignee = async (saleId: string, newAssignee: string) => {
    try {
      console.log('Atualizando responsável:', { saleId, newAssignee });
      
      await updateSale.mutateAsync({
        id: saleId,
        updates: { assigned_to: newAssignee }
      });

      setSales(prev => prev.map(sale => 
        sale.id === saleId ? { ...sale, assigned_to: newAssignee } : sale
      ));
      
      toast({
        title: "Responsável atualizado",
        description: "O responsável pelo projeto foi atualizado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao atualizar responsável:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o responsável.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400 text-sm">Carregando projetos...</p>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="text-center py-6">
        <Package className="h-8 w-8 text-gray-500 mx-auto mb-2" />
        <h3 className="text-base font-medium text-white mb-1">Nenhum projeto encontrado</h3>
        <p className="text-gray-400 text-sm">Este cliente ainda não possui projetos/vendas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sales.map((sale) => (
        <ProjectCard
          key={sale.id}
          sale={sale}
          onStatusUpdate={updateSaleStatus}
          onAssigneeUpdate={updateSaleAssignee}
        />
      ))}
    </div>
  );
};

export default CustomerProjectsSection;
