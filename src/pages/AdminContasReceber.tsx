
import { useState } from "react";
import { useAccountsReceivable, useAccountsReceivableStats } from "@/hooks/useAccountsReceivable";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AccountsReceivableKPICards from "@/components/admin/financeiro/AccountsReceivableKPICards";
import AccountsReceivableList from "@/components/admin/financeiro/AccountsReceivableList";
import ReceivablesEvolutionChart from "@/components/admin/financeiro/ReceivablesEvolutionChart";
import PeriodSelector from "@/components/admin/financeiro/PeriodSelector";

const AdminContasReceber = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [activeSection, setActiveSection] = useState("financeiro");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: accountsReceivable, isLoading } = useAccountsReceivable(selectedPeriod);
  const accountsStats = useAccountsReceivableStats(accountsReceivable || []);

  const handleMarkAsPaid = (accountId: string) => {
    // Implementar lógica para marcar como pago
    console.log('Marcando como pago:', accountId);
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
      </main>
    </div>
  );
};

export default AdminContasReceber;
