import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
            <div className="flex flex-col">
              <CardTitle className="text-white">Registro de Movimentações</CardTitle>
              {dateRange?.from && dateRange?.to && (
                <span className="text-sm text-muted-foreground">
                  Período: {format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })} — {format(dateRange.to, 'dd/MM/yyyy', { locale: ptBR })}
                </span>
              )}
            </div>
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
            <>
              <div className="text-sm text-muted-foreground mb-1">
                {filteredMovements.length} movimento{filteredMovements.length !== 1 ? 's' : ''} encontrado{filteredMovements.length !== 1 ? 's' : ''}
                {totalPages > 1 && ` • Página ${currentPage} de ${totalPages}`}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                Inclui todas as despesas e receitas do período: manuais e recorrentes.
              </div>
            </>
          )}

          {!filteredMovements || filteredMovements.length === 0 ? (
            <div className="border border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground text-lg">
                {movements && movements.length > 0 && debouncedSearch
                  ? "Nenhum movimento encontrado com esse filtro."
                  : "Nenhum movimento registrado no período selecionado."}
              </p>
            </div>
          ) : (
            <>
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead className="text-foreground font-semibold">Nome</TableHead>
                      <TableHead className="text-foreground font-semibold">Data do Movimento</TableHead>
                      <TableHead className="text-right text-foreground font-semibold">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMovements.map((movement) => (
                      <TableRow 
                        key={movement.id}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-foreground">{movement.description}</span>
                              {movement.source === 'casual' && (
                                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                                  Manual
                                </span>
                              )}
                              {movement.source === 'recurring' && movement.type === 'despesa' && (
                                <span className="text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-400">
                                  Recorrente
                                </span>
                              )}
                              {movement.source === 'recurring' && movement.type === 'receita' && (
                                <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                                  Recebível
                                </span>
                              )}
                            </div>
                            {movement.customer_name && (
                              <span className="text-xs text-muted-foreground">
                                {movement.customer_name}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <span className="text-muted-foreground">
                            {format(new Date(movement.movement_date), 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
                        </TableCell>
                        
                        <TableCell className="text-right">
                          <span className={`font-semibold text-lg ${
                            movement.type === 'receita' 
                              ? 'text-green-500' 
                              : 'text-red-500'
                          }`}>
                            {movement.type === 'receita' ? '+' : '-'}€{movement.amount.toFixed(2)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
