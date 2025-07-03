
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSales } from "@/hooks/useSales";
import { useSalesStats } from "@/hooks/useSalesStats";
import { useSalesFilters } from "@/hooks/useSalesFilters";
import CreateSaleModal from "./vendas/CreateSaleModal";
import SaleDetailModal from "./vendas/SaleDetailModal";
import ConvertToRecurringModal from "./vendas/ConvertToRecurringModal";
import SalesStatsCards from "./vendas/SalesStatsCards";
import SalesFilters from "./vendas/SalesFilters";
import SaleCard from "./vendas/SaleCard";
import EditSaleModal from "./vendas/EditSaleModal";
import { useQueryClient } from "@tanstack/react-query";

const AdminVendas = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [saleToConvert, setSaleToConvert] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saleToEdit, setSaleToEdit] = useState<any>(null);

  const queryClient = useQueryClient();
  const { data: sales, isLoading, error } = useSales(selectedPeriod);
  const stats = useSalesStats(sales);
  const filteredSales = useSalesFilters(sales, searchTerm, statusFilter, paymentFilter);

  const handleConvertToRecurring = (sale: any) => {
    setSaleToConvert(sale);
    setIsConvertModalOpen(true);
  };

  const handleEditSale = (sale: any) => {
    setSaleToEdit(sale);
    setIsEditModalOpen(true);
  };

  const handleDeleteSale = (sale: any) => {
    // TODO: Implementar lógica de exclusão
    console.log('Delete sale:', sale.id);
  };

  const handleCreateSale = () => {
    console.log('Opening create sale modal...');
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    console.log('Closing create sale modal...');
    setIsCreateModalOpen(false);
  };

  const handleSaleUpdated = () => {
    // Invalidar queries para recarregar os dados sem recarregar a página
    queryClient.invalidateQueries({ queryKey: ['sales'] });
    queryClient.invalidateQueries({ queryKey: ['admin-revenue-metrics'] });
    setIsEditModalOpen(false);
    setSaleToEdit(null);
  };

  const handleSaleDetailUpdated = () => {
    // Invalidar queries para recarregar os dados sem recarregar a página
    queryClient.invalidateQueries({ queryKey: ['sales'] });
    queryClient.invalidateQueries({ queryKey: ['admin-revenue-metrics'] });
  };

  if (error) {
    return (
      <div className="flex flex-col h-screen max-h-screen overflow-hidden">
        <div className="flex items-center justify-between p-6">
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
      <div className="flex flex-col h-screen max-h-screen overflow-hidden">
        <div className="flex items-center justify-between p-6">
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
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Header fixo */}
      <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 whitespace-nowrap">Módulo de Vendas</h1>
          <p className="text-gray-400 text-sm sm:text-base">Gerencie todas as vendas da SENVIA</p>
        </div>
        <Button 
          onClick={handleCreateSale}
          className="bg-senvia-500 hover:bg-senvia-400 text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Venda
        </Button>
      </div>

      {/* Estatísticas fixas */}
      <div className="px-6 pb-4 flex-shrink-0">
        <SalesStatsCards stats={stats} />
      </div>

      {/* Filtros fixos */}
      <div className="px-6 pb-4 flex-shrink-0">
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
      </div>

      {/* Cabeçalho da Tabela fixo */}
      {filteredSales.length > 0 && (
        <div className="px-6 pb-2 flex-shrink-0">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between gap-4 text-sm font-medium text-gray-400">
              <div className="flex-shrink-0 w-24">Código</div>
              <div className="flex-shrink-0 w-48">Cliente</div>
              <div className="flex-1 min-w-0">Serviço</div>
              <div className="flex-shrink-0 w-24 text-right">Valor</div>
              <div className="flex-shrink-0 w-24 text-center">Status</div>
              <div className="flex-shrink-0 w-20 text-right">Data</div>
              <div className="flex-shrink-0 w-8"></div>
            </div>
          </div>
        </div>
      )}

      {/* Área de scroll das vendas - só esta área tem scroll */}
      <div className="flex-1 min-h-0 px-6 pb-6">
        {filteredSales.length > 0 ? (
          <ScrollArea className="h-full">
            <div className="space-y-2 pr-4">
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
          </ScrollArea>
        ) : (
          <div className="h-full flex items-center justify-center">
            <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
              <CardContent className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Nenhuma venda encontrada</h3>
                <p className="text-gray-400 mb-4">Comece criando sua primeira venda ou ajuste os filtros.</p>
                <Button 
                  onClick={handleCreateSale}
                  className="bg-senvia-500 hover:bg-senvia-400 text-black"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Venda
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Modais */}
      <CreateSaleModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />

      <SaleDetailModal
        sale={selectedSale}
        isOpen={!!selectedSale}
        onClose={() => setSelectedSale(null)}
        onSaleUpdated={handleSaleDetailUpdated}
      />

      <EditSaleModal
        sale={saleToEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSaleToEdit(null);
        }}
        onSaleUpdated={handleSaleUpdated}
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
