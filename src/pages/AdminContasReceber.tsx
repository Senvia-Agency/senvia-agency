import { useState } from "react";
import { useUnifiedReceivables } from "@/hooks/useUnifiedReceivables";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, ArrowLeft, Loader2, Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import AdminSidebar from "@/components/admin/AdminSidebar";
import UnifiedReceivablesTable from "@/components/admin/financeiro/UnifiedReceivablesTable";

const AdminContasReceber = () => {
  const [activeSidebarSection, setActiveSidebarSection] = useState("financeiro");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Recebíveis unificados (vendas + recorrentes + previstos)
  const { data: unifiedReceivables, isLoading, refetch } = useUnifiedReceivables();

  // Ordenar recebíveis por data de vencimento
  const sortedReceivables = (unifiedReceivables || []).sort((a, b) => 
    new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  );

  // Filtrar recebíveis com base na pesquisa
  const filteredReceivables = sortedReceivables.filter(receivable => {
    const matchesSearch = 
      receivable.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receivable.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receivable.service_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <AdminSidebar 
          activeSection={activeSidebarSection}
          setActiveSection={setActiveSidebarSection}
          sidebarOpen={isSidebarOpen}
          setSidebarOpen={setIsSidebarOpen}
        />
        <div className="flex-1 p-8">
          <div className="text-center py-8 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            Carregando contas a receber...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar 
        activeSection={activeSidebarSection}
        setActiveSection={setActiveSidebarSection}
        sidebarOpen={isSidebarOpen}
        setSidebarOpen={setIsSidebarOpen}
      />
      
      {/* Overlay para mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 min-w-0">
        {/* Header mobile com hambúrguer */}
        {isMobile && (
          <div className="p-6 lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        )}

        <div className="p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/admin?tab=financeiro')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para Financeiro
                </Button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">Contas a Receber</h1>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Gestão completa das contas a receber
                  </p>
                </div>
              </div>
            </div>

            {/* Tabela Unificada de Contas a Receber */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                Contas a Receber ({filteredReceivables.length})
              </h3>
              
              {/* Filtro de Pesquisa */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por cliente ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 max-w-md"
                />
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <UnifiedReceivablesTable 
                  receivables={filteredReceivables} 
                  onRefresh={refetch}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminContasReceber;
