import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, TrendingUp } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import RecurringRevenuesTable from "@/components/admin/financeiro/RecurringRevenuesTable";
import { useRecurringServices } from "@/hooks/useRecurringServices";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AdminReceitasMensais = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("financeiro");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { data: allServices, isLoading } = useRecurringServices();
  
  // Filtrar apenas receitas ativas
  const receitasAtivas = (allServices || []).filter(
    service => service.recurrence_type === 'receita' && service.status === 'active'
  );
  
  // Aplicar busca
  const filteredReceitas = receitasAtivas.filter(service => {
    const matchesSearch = 
      service.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.customers?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalMensal = filteredReceitas.reduce((sum, s) => sum + Number(s.amount), 0);

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
            <p className="text-muted-foreground">Carregando receitas mensais...</p>
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
                <TrendingUp className="h-8 w-8 text-green-500" />
                Receitas Mensais Recorrentes
              </h1>
              <p className="text-muted-foreground mt-1">
                {filteredReceitas.length} serviço{filteredReceitas.length !== 1 ? 's' : ''} ativo{filteredReceitas.length !== 1 ? 's' : ''} - €{totalMensal.toFixed(2)}/mês
              </p>
            </div>
          </div>

          {/* Card com Total */}
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total de Receitas Mensais</p>
                  <p className="text-3xl font-bold text-green-500">€{totalMensal.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-12 w-12 text-green-500" />
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por serviço ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table */}
          {filteredReceitas.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  {searchTerm 
                    ? "Nenhuma receita encontrada com esse critério de busca."
                    : "Nenhuma receita mensal recorrente ativa no momento."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <RecurringRevenuesTable revenues={filteredReceitas} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReceitasMensais;
