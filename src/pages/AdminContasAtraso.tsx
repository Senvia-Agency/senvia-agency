
import { useState } from "react";
import { useAccountsReceivable } from "@/hooks/useAccountsReceivable";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AdminContasAtraso = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("financeiro");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { data: accounts, isLoading } = useAccountsReceivable(selectedPeriod);
  
  // Filtrar apenas contas em atraso
  const overdue = new Date();
  const contasAtraso = (accounts || []).filter(account => 
    account.payment_status === 'pending' && account.days_overdue > 0
  );
  
  // Aplicar filtros
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
        <div className="flex-1 p-6">
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

          {/* Lista de Contas em Atraso */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Contas em Atraso ({filteredContas.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredContas.map((conta) => (
                  <div key={conta.id} className="border border-red-600 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-1">
                          {conta.customer_name || 'Cliente não informado'}
                        </h4>
                        <p className="text-sm text-gray-400 mb-2">
                          {conta.customer_email}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-red-500 border-red-500">
                            {conta.days_overdue} dias em atraso
                          </Badge>
                          <span className="text-sm text-gray-400">
                            Vencimento: {conta.due_date ? format(new Date(conta.due_date), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A'}
                          </span>
                        </div>
                        {conta.service_name && (
                          <p className="text-sm text-gray-400">{conta.service_name}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-500">
                          €{Number(conta.remaining_amount).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">
                          Venda: {conta.sale_number}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredContas.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    {contasAtraso.length === 0 ? "Nenhuma conta em atraso! 🎉" : "Nenhuma conta encontrada para os filtros selecionados."}
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

export default AdminContasAtraso;
