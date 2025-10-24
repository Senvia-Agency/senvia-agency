import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, TrendingDown } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import RecurringExpensesTable from "@/components/admin/financeiro/RecurringExpensesTable";
import { useRecurringServices } from "@/hooks/useRecurringServices";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AdminDespesasMensais = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("financeiro");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { data: allServices, isLoading } = useRecurringServices();
  
  // Filtrar apenas despesas ativas
  const despesasAtivas = (allServices || []).filter(
    service => service.recurrence_type === 'despesa' && service.status === 'active'
  );
  
  // Aplicar busca
  const filteredDespesas = despesasAtivas.filter(service => {
    const matchesSearch = 
      service.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.service_description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalMensal = filteredDespesas.reduce((sum, s) => sum + Number(s.amount), 0);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <AdminSidebar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando despesas mensais...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Link to="/admin?tab=financeiro">
                <Button variant="ghost" size="sm" className="mb-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para Financeiro
                </Button>
              </Link>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <TrendingDown className="h-8 w-8 text-red-500" />
                Despesas Mensais Recorrentes
              </h1>
              <p className="text-muted-foreground mt-1">
                {filteredDespesas.length} despesa{filteredDespesas.length !== 1 ? 's' : ''} ativa{filteredDespesas.length !== 1 ? 's' : ''} - €{totalMensal.toFixed(2)}/mês
              </p>
            </div>
          </div>

          {/* Card com Total */}
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total de Despesas Mensais</p>
                  <p className="text-3xl font-bold text-red-500">€{totalMensal.toFixed(2)}</p>
                </div>
                <TrendingDown className="h-12 w-12 text-red-500" />
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table */}
          {filteredDespesas.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  {searchTerm 
                    ? "Nenhuma despesa encontrada com esse critério de busca."
                    : "Nenhuma despesa mensal recorrente ativa no momento."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <RecurringExpensesTable expenses={filteredDespesas} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDespesasMensais;
