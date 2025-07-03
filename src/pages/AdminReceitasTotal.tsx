
import { useState } from "react";
import { useFinancialMovements } from "@/hooks/useFinancialMovements";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AdminReceitasTotal = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeSection, setActiveSection] = useState("financeiro");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { movements, isLoading } = useFinancialMovements(selectedPeriod);
  
  // Filtrar apenas receitas
  const receitas = movements.filter(m => m.movement_type === 'receita');
  
  // Aplicar filtros
  const filteredReceitas = receitas.filter(receita => {
    const matchesSearch = receita.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receita.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || receita.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalReceitas = filteredReceitas.reduce((sum, receita) => sum + Number(receita.amount), 0);
  const categories = [...new Set(receitas.map(r => r.category))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex">
        <AdminSidebar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 p-6">
          <div className="text-center py-8 text-gray-400">
            Carregando receitas...
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
        <div className="lg:hidden p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="space-y-6 p-6">
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
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Receitas Totais</h1>
                <p className="text-gray-400 text-sm sm:text-base">
                  Total de {filteredReceitas.length} receitas - €{totalReceitas.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedPeriod.toString()} onValueChange={(value) => setSelectedPeriod(Number(value))}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
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
                placeholder="Buscar por descrição ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lista de Receitas */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Lista de Receitas ({filteredReceitas.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReceitas.map((receita) => (
                  <div key={receita.id} className="border border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-1">{receita.description}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-green-500 border-green-500">
                            {receita.category.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm text-gray-400">
                            {format(new Date(receita.movement_date), 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
                        </div>
                        {receita.notes && (
                          <p className="text-sm text-gray-400">{receita.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-500">
                          +€{Number(receita.amount).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {receita.currency}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredReceitas.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    Nenhuma receita encontrada para os filtros selecionados.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminReceitasTotal;
