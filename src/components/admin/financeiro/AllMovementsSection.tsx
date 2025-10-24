import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useAllFinancialMovements } from "@/hooks/useAllFinancialMovements";
import { DateRange } from "@/components/ui/date-range-picker";
import UnifiedMovementModal from "./UnifiedMovementModal";
import { debounce } from "@/utils/performance";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AllMovementsSectionProps {
  dateRange: DateRange | null;
}

const AllMovementsSection = ({ dateRange }: AllMovementsSectionProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  
  const { data: movements, isLoading } = useAllFinancialMovements(dateRange);

  // Debounce do search
  const handleSearchChange = useMemo(
    () => debounce((value: string) => {
      setDebouncedSearch(value);
      setCurrentPage(1); // Reset page ao buscar
    }, 300),
    []
  );

  // Filtrar movimentos com base na pesquisa (usando debounced)
  const filteredMovements = useMemo(() => {
    return movements?.filter(movement => {
      const matchesSearch = 
        movement.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        movement.customer_name?.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesSearch;
    }) || [];
  }, [movements, debouncedSearch]);

  // Paginação
  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
  const paginatedMovements = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMovements.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMovements, currentPage, itemsPerPage]);

  const getSourceBadge = (source: string) => {
    const variants = {
      casual: { label: 'Casual', className: 'bg-purple-600 text-white' },
      recurring: { label: 'Recorrente', className: 'bg-blue-600 text-white' },
      sale: { label: 'Venda', className: 'bg-orange-600 text-white' },
    };
    
    const variant = variants[source as keyof typeof variants] || variants.casual;
    
    return (
      <Badge className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Registro de Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            Carregando movimentos...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-white">Registro de Movimentações</CardTitle>
            <Button
              onClick={() => setModalOpen(true)}
              variant="default"
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar Registro
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtro de Pesquisa */}
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por descrição ou cliente..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleSearchChange(e.target.value);
                }}
                className="pl-10"
              />
            </div>
          </div>

          {/* Total encontrado */}
          {filteredMovements.length > 0 && (
            <div className="text-sm text-muted-foreground mb-2">
              {filteredMovements.length} movimento{filteredMovements.length !== 1 ? 's' : ''} encontrado{filteredMovements.length !== 1 ? 's' : ''}
              {totalPages > 1 && ` • Página ${currentPage} de ${totalPages}`}
            </div>
          )}

          {!filteredMovements || filteredMovements.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {movements && movements.length > 0 && debouncedSearch
                ? "Nenhum movimento encontrado com esse filtro."
                : "Nenhum movimento registrado no período selecionado."}
            </div>
          ) : (
            <>
              <div className="space-y-1 max-h-[600px] overflow-y-auto pr-2">
                {paginatedMovements.map((movement) => (
                  <div
                    key={movement.id}
                    className="flex justify-between items-center py-2 px-3 rounded hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-white">{movement.description}</span>
                      {movement.customer_name && (
                        <span className="text-xs text-muted-foreground">{movement.customer_name}</span>
                      )}
                    </div>
                    <span className={`font-semibold ${
                      movement.type === 'receita' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {movement.type === 'receita' ? '+' : '-'}€{movement.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Controles de paginação */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4 pt-4 border-t border-gray-700">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <UnifiedMovementModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default AllMovementsSection;
