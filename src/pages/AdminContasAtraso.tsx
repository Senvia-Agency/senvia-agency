
import { useState } from "react";
import { useUnifiedReceivables } from "@/hooks/useUnifiedReceivables";
import AdminSidebar from "@/components/admin/AdminSidebar";
import UnifiedReceivablesTable from "@/components/admin/financeiro/UnifiedReceivablesTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AdminContasAtraso = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("financeiro");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Usar recebíveis unificados (vendas + recorrentes + previstos)
  const { data: unifiedReceivables, isLoading } = useUnifiedReceivables();
  
  // Filtrar contas em atraso (com days_overdue > 0)
  const contasAtraso = (unifiedReceivables || []).filter(item => item.days_overdue > 0);
  
  console.log('📊 Contas em Atraso:', {
    totalReceivables: unifiedReceivables?.length || 0,
    contasAtrasoCount: contasAtraso.length,
    contasAtraso: contasAtraso.map(c => ({ 
      customer: c.customer_name, 
      service: c.service_name, 
      amount: c.remaining_amount, 
      days: c.days_overdue,
      type: c.type
    }))
  });
  
  // Aplicar filtros de busca
  const filteredContas = contasAtraso.filter(conta => {
    const matchesSearch = conta.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conta.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conta.service_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalAtraso = filteredContas.reduce((sum, conta) => sum + Number(conta.remaining_amount), 0);

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
            Carregando contas em atraso...
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

        <div className="space-y-8 p-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin?tab=financeiro">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Contas em Atraso</h1>
                <p className="text-gray-400 text-sm sm:text-base">
                  Total de {filteredContas.length} contas atrasadas - €{totalAtraso.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedPeriod.toString()} onValueChange={(value) => setSelectedPeriod(Number(value))}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                  <SelectItem value="180">Últimos 6 meses</SelectItem>
                  <SelectItem value="365">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por cliente ou serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tabela Unificada de Contas em Atraso */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h3 className="text-xl font-semibold text-white">
                Contas em Atraso ({filteredContas.length})
              </h3>
            </div>
            
            {filteredContas.length === 0 ? (
              <div className="border border-border rounded-lg p-12 text-center">
                <p className="text-muted-foreground text-lg">
                  {contasAtraso.length === 0 
                    ? "Nenhuma conta em atraso! 🎉" 
                    : "Nenhuma conta encontrada para os filtros selecionados."}
                </p>
              </div>
            ) : (
              <UnifiedReceivablesTable receivables={filteredContas} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminContasAtraso;
