
import { useState } from "react";
import { useAccountsReceivable, useAccountsReceivableStats } from "@/hooks/useAccountsReceivable";
import { useUnifiedReceivables } from "@/hooks/useUnifiedReceivables";
import type { UnifiedReceivable } from "@/hooks/useUnifiedReceivables";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AccountsReceivableKPICards from "@/components/admin/financeiro/AccountsReceivableKPICards";
import AccountsReceivableList from "@/components/admin/financeiro/AccountsReceivableList";
import ReceivablesEvolutionChart from "@/components/admin/financeiro/ReceivablesEvolutionChart";
import PeriodSelector from "@/components/admin/financeiro/PeriodSelector";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AdminContasReceber = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const [activeSection, setActiveSection] = useState("financeiro");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: accountsReceivable, isLoading } = useAccountsReceivable(selectedPeriod);
  const accountsStats = useAccountsReceivableStats(accountsReceivable || []);

  // Recebíveis unificados (vendas + recorrentes + previstos)
  const { data: unifiedReceivables } = useUnifiedReceivables();
  const predictedRecurring: UnifiedReceivable[] = (unifiedReceivables || []).filter(r => r.type === 'recurring' && r.id.startsWith('svc-')) as UnifiedReceivable[];

  const handleMarkAsPaid = async (accountId: string) => {
    try {
      console.log('Marcando como pago:', accountId);
      
      // 1. Buscar dados da venda
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .select('*, customers(full_name, email)')
        .eq('id', accountId)
        .single();

      if (saleError) {
        throw saleError;
      }

      const remainingAmount = Number(sale.remaining_amount || (sale.total_value - sale.paid_amount));
      
      // 2. Atualizar a venda para "pago"
      const { error: updateError } = await supabase
        .from('sales')
        .update({
          payment_status: 'paid',
          paid_amount: sale.total_value,
          remaining_amount: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', accountId);

      if (updateError) {
        throw updateError;
      }

      // 3. Criar movimento financeiro (receita)
      const { error: movementError } = await supabase
        .from('financial_movements')
        .insert({
          movement_type: 'receita',
          category: 'vendas',
          description: `Recebimento da venda ${sale.sale_number} - ${sale.service_name}`,
          amount: remainingAmount,
          currency: 'EUR',
          customer_id: sale.customer_id,
          movement_date: new Date().toISOString().split('T')[0],
          notes: `Pagamento total da venda ${sale.sale_number}. Cliente: ${sale.customers?.full_name || 'N/A'}`
        });

      if (movementError) {
        throw movementError;
      }

      // 4. Invalidar queries para atualizar os dados
      queryClient.invalidateQueries({ queryKey: ['accounts-receivable'] });
      queryClient.invalidateQueries({ queryKey: ['financial-movements'] });

      toast({
        title: "✅ Pagamento registrado",
        description: `Venda ${sale.sale_number} marcada como paga. Receita de €${remainingAmount.toFixed(2)} adicionada aos movimentos financeiros.`,
      });

    } catch (error: any) {
      console.error('Erro ao marcar como pago:', error);
      toast({
        title: "❌ Erro ao registrar pagamento",
        description: error.message || "Não foi possível registrar o pagamento.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex">
        <AdminSidebar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 p-8">
          <div className="text-center py-8 text-gray-400">
            Carregando contas a receber...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <AdminSidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 min-w-0">
        {/* Header mobile com hambúrguer */}
        <div className="lg:hidden p-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Link to="/admin?tab=financeiro">
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar para Financeiro
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white whitespace-nowrap">Contas a Receber</h1>
                  <p className="text-gray-400 text-sm sm:text-base">Gestão completa das contas a receber</p>
                </div>
              </div>
              <div className="flex justify-end">
                <PeriodSelector
                  selectedPeriod={selectedPeriod}
                  onPeriodChange={setSelectedPeriod}
                />
              </div>
            </div>

            {/* KPI Cards */}
            <AccountsReceivableKPICards stats={null} />

            {/* Gráfico de Evolução */}
            <ReceivablesEvolutionChart accounts={accountsReceivable || []} />

            {/* Lista de Contas a Receber */}
            <AccountsReceivableList 
              accounts={accountsReceivable || []} 
              onMarkAsPaid={handleMarkAsPaid}
            />

            {/* Recorrentes previstos (próximos 30 dias) - João e Tiago devem aparecer aqui */}
            {predictedRecurring.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Recorrentes previstos (30 dias) ({predictedRecurring.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {predictedRecurring.map((rec) => (
                      <div key={rec.id} className="border border-gray-700 rounded-lg p-4">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-white truncate">{rec.customer_name}</h4>
                              <span className="text-xs px-2 py-0.5 rounded bg-blue-600 text-white">Prevista</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300">
                              <div>
                                <span className="text-gray-400">Serviço: </span>
                                <span className="truncate">{rec.service_name}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Vencimento: </span>
                                <span>{format(new Date(rec.due_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                              </div>
                              <div className="sm:col-span-2">
                                <span className="text-gray-400">Valor: </span>
                                <span className="font-medium text-yellow-400">€{rec.remaining_amount.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminContasReceber;
