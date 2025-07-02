import { useState } from "react";
import { useAccountsReceivable, useAccountsReceivableStats } from "@/hooks/useAccountsReceivable";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AccountsReceivableKPICards from "@/components/admin/financeiro/AccountsReceivableKPICards";
import AccountsReceivableList from "@/components/admin/financeiro/AccountsReceivableList";
import ReceivablesEvolutionChart from "@/components/admin/financeiro/ReceivablesEvolutionChart";
import PeriodSelector from "@/components/admin/financeiro/PeriodSelector";

const AdminContasReceber = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const { data: accountsReceivable, isLoading } = useAccountsReceivable(selectedPeriod);
  const accountsStats = useAccountsReceivableStats(accountsReceivable || []);

  const handleMarkAsPaid = (accountId: string) => {
    // Implementar lógica para marcar como pago
    console.log('Marcando como pago:', accountId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8 text-gray-400">
            Carregando contas a receber...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
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
        <AccountsReceivableKPICards stats={accountsStats} />

        {/* Gráfico de Evolução */}
        <ReceivablesEvolutionChart accounts={accountsReceivable || []} />

        {/* Lista de Contas a Receber */}
        <AccountsReceivableList 
          accounts={accountsReceivable || []} 
          onMarkAsPaid={handleMarkAsPaid}
        />
      </div>
    </div>
  );
};

export default AdminContasReceber;