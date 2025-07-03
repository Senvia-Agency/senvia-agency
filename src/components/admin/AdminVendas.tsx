
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Loader2 } from "lucide-react";
import { useSales } from "@/hooks/useSales";
import { useSalesStats } from "@/hooks/useSalesStats";
import { useSalesFilters } from "@/hooks/useSalesFilters";
import CreateSaleModal from "./vendas/CreateSaleModal";
import SaleDetailModal from "./vendas/SaleDetailModal";
import ConvertToRecurringModal from "./vendas/ConvertToRecurringModal";
import SalesStatsCards from "./vendas/SalesStatsCards";
import SalesFilters from "./vendas/SalesFilters";
import SaleCard from "./vendas/SaleCard";

const AdminVendas = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [saleToConvert, setSaleToConvert] = useState<any>(null);

  const { data: sales, isLoading, error } = useSales(selectedPeriod);
  const stats = useSalesStats(sales);
  const filteredSales = useSalesFilters(sales, searchTerm, statusFilter, paymentFilter);

  const handleConvertToRecurring = (sale: any) => {
    setSaleToConvert(sale);
    setIsConvertModalOpen(true);
  };

  const handleEditSale = (sale: any) => {
    setSelectedSale(sale);
  };

  const handleDeleteSale = (sale: any) => {
    // TODO: Implementar lógica de exclusão
    console.log('Delete sale:', sale.id);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold whitespace-nowrap">Módulo de Vendas</h1>
        </div>
        <div className="text-center py-8 text-red-400">
          Erro ao carregar vendas: {error.message}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold whitespace-nowrap">Módulo de Vendas</h1>
        </div>
        <div className="text-center py-8 text-gray-400 flex items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          Carregando vendas...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 whitespace-nowrap">Módulo de Vendas</h1>
          <p className="text-gray-400 text-sm sm:text-base">Gerencie todas as vendas da SENVIA</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-senvia-500 hover:bg-senvia-400 text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Venda
        </Button>
      </div>

      {/* Estatísticas */}
      <SalesStatsCards stats={stats} />

      {/* Filtros */}
      <SalesFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        paymentFilter={paymentFilter}
        setPaymentFilter={setPaymentFilter}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
      />

      {/* Cabeçalho da Tabela */}
      {filteredSales.length > 0 && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between gap-4 text-sm font-medium text-gray-400">
            <div className="flex-shrink-0 w-24">Código</div>
            <div className="flex-shrink-0 w-48">Cliente</div>
            <div className="flex-1 min-w-0">Serviço</div>
            <div className="flex-shrink-0 w-20 text-right">Valor</div>
            <div className="flex-shrink-0">Status</div>
            <div className="flex-shrink-0 w-24 text-right">Data</div>
            <div className="flex-shrink-0 w-8"></div>
          </div>
        </div>
      )}

      {/* Lista de Vendas */}
      <div className="space-y-2">
        {filteredSales.map((sale) => (
          <SaleCard 
            key={sale.id} 
            sale={sale} 
            onViewDetails={setSelectedSale}
            onConvertToRecurring={handleConvertToRecurring}
            onEdit={handleEditSale}
            onDelete={handleDeleteSale}
          />
        ))}
      </div>

      {/* Empty State */}
      {(!filteredSales || filteredSales.length === 0) && !isLoading && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Nenhuma venda encontrada</h3>
            <p className="text-gray-400 mb-4">Comece criando sua primeira venda ou ajuste os filtros.</p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-senvia-500 hover:bg-senvia-400 text-black"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Venda
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modais */}
      <CreateSaleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <SaleDetailModal
        sale={selectedSale}
        isOpen={!!selectedSale}
        onClose={() => setSelectedSale(null)}
        onSaleUpdated={() => {
          // Recarregar dados após atualização
          window.location.reload();
        }}
      />

      <ConvertToRecurringModal
        sale={saleToConvert}
        isOpen={isConvertModalOpen}
        onClose={() => {
          setIsConvertModalOpen(false);
          setSaleToConvert(null);
        }}
      />
    </div>
  );
};

export default AdminVendas;
