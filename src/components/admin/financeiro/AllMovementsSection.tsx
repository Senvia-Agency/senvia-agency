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
import { Plus, Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAllFinancialMovements } from "@/hooks/useAllFinancialMovements";
import { DateRange } from "@/components/ui/date-range-picker";
import UnifiedMovementModal from "./UnifiedMovementModal";
import UnifiedReceivablesTable from "./UnifiedReceivablesTable";
import RecurringRevenuesTable from "./RecurringRevenuesTable";
import RecurringExpensesTable from "./RecurringExpensesTable";
import { useUnifiedReceivables, filterReceivablesByStatus } from "@/hooks/useUnifiedReceivables";
import { useRecurringServices, filterRecurringServicesByType, RecurringService } from "@/hooks/useRecurringServices";
import { debounce } from "@/utils/performance";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AllMovementsSectionProps {
  dateRange: DateRange | null;
  setDateRange?: (range: DateRange | undefined) => void;
  typeFilter?: 'all' | 'receita' | 'despesa' | 'receivables' | 'overdue' | 'monthly_revenues' | 'monthly_expenses';
  onClearFilter?: () => void;
}

const AllMovementsSection = ({ dateRange, setDateRange, typeFilter = 'all', onClearFilter }: AllMovementsSectionProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [recurringSearch, setRecurringSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  
  const { data: movements, isLoading, isFetching } = useAllFinancialMovements(dateRange);
  const { data: allReceivables, refetch: refetchReceivables } = useUnifiedReceivables();
  const { data: allRecurringServices } = useRecurringServices();

  // Debounce do search
  const handleSearchChange = useMemo(
    () => debounce((value: string) => {
      setDebouncedSearch(value);
      setCurrentPage(1); // Reset page ao buscar
    }, 300),
    []
  );

  // Filtrar receivables
  const filteredReceivables = useMemo(() => {
    if (!allReceivables || (typeFilter !== 'receivables' && typeFilter !== 'overdue')) {
      return [];
    }
    return filterReceivablesByStatus(allReceivables, typeFilter === 'overdue' ? 'overdue' : 'all');
  }, [allReceivables, typeFilter]);

  // Filtrar serviços recorrentes
  const filteredRecurringServices = useMemo(() => {
    if (!allRecurringServices) return [];
    
    let filtered: RecurringService[] = [];
    
    if (typeFilter === 'monthly_revenues') {
      filtered = filterRecurringServicesByType(allRecurringServices, 'revenues');
    } else if (typeFilter === 'monthly_expenses') {
      filtered = filterRecurringServicesByType(allRecurringServices, 'expenses');
    } else {
      return [];
    }
    
    // Aplicar busca
    if (recurringSearch) {
      return filtered.filter(service => {
        const matchesSearch = 
          service.service_name?.toLowerCase().includes(recurringSearch.toLowerCase()) ||
          service.service_description?.toLowerCase().includes(recurringSearch.toLowerCase()) ||
          service.customers?.full_name?.toLowerCase().includes(recurringSearch.toLowerCase());
        return matchesSearch;
      });
    }
    
    return filtered;
  }, [allRecurringServices, typeFilter, recurringSearch]);

  // Calcular total mensal
  const totalMensal = useMemo(() => {
    return filteredRecurringServices.reduce((sum, s) => sum + Number(s.amount), 0);
  }, [filteredRecurringServices]);

  // Filtrar movimentos com base na pesquisa e tipo (usando debounced)
  const filteredMovements = useMemo(() => {
    return movements?.filter(movement => {
      const matchesSearch = 
        movement.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        movement.customer_name?.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesType = typeFilter === 'all' || movement.type === typeFilter;
      
      return matchesSearch && matchesType;
    }) || [];
  }, [movements, debouncedSearch, typeFilter]);

  // Paginação
  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
  const paginatedMovements = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMovements.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMovements, currentPage, itemsPerPage]);

  // Ajustar filtro quando movimento é criado
  const handleMovementCreated = (movementDateStr: string) => {
    if (!setDateRange || !dateRange) return;

    const movementDate = new Date(movementDateStr);
    const from = dateRange.from;
    const to = dateRange.to;

    // Se a data está fora do range atual, expandir
    if (from && movementDate < from) {
      setDateRange({ from: movementDate, to });
    } else if (to && movementDate > to) {
      setDateRange({ from, to: movementDate });
    }
    // Se não tem range definido, criar um que inclua a data
    else if (!from || !to) {
      setDateRange({ from: movementDate, to: movementDate });
    }

    // Garantir que o novo item apareça imediatamente
    setCurrentPage(1);
  };

  if (isLoading && !movements) {
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
      <Card className={`bg-gray-800 border-gray-700 transition-opacity duration-200 ${isFetching && !isLoading ? 'opacity-60' : 'opacity-100'}`}>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <CardTitle className="text-white">
                {typeFilter === 'receivables' && "Contas a Receber"}
                {typeFilter === 'overdue' && "Contas em Atraso"}
                {typeFilter === 'monthly_revenues' && "Receitas Mensais Recorrentes"}
                {typeFilter === 'monthly_expenses' && "Despesas Mensais Recorrentes"}
                {(!typeFilter || typeFilter === 'all' || typeFilter === 'receita' || typeFilter === 'despesa') && "Registro de Movimentações"}
              </CardTitle>
              {typeFilter === 'monthly_revenues' && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  {filteredRecurringServices.length} serviço{filteredRecurringServices.length !== 1 ? 's' : ''} - €{totalMensal.toFixed(2)}/mês
                </Badge>
              )}
              {typeFilter === 'monthly_expenses' && (
                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                  {filteredRecurringServices.length} despesa{filteredRecurringServices.length !== 1 ? 's' : ''} - €{totalMensal.toFixed(2)}/mês
                </Badge>
              )}
              {typeFilter === 'receita' && (
                <Badge 
                  variant="secondary" 
                  className="bg-green-500/20 text-green-400 border-green-500/30"
                >
                  Filtro: Receitas
                  {onClearFilter && (
                    <button
                      onClick={onClearFilter}
                      className="ml-2 hover:bg-background/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              )}
              {typeFilter === 'despesa' && (
                <Badge 
                  variant="secondary" 
                  className="bg-red-500/20 text-red-400 border-red-500/30"
                >
                  Filtro: Despesas
                  {onClearFilter && (
                    <button
                      onClick={onClearFilter}
                      className="ml-2 hover:bg-background/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              )}
              {typeFilter === 'receivables' && (
                <Badge 
                  variant="secondary" 
                  className="bg-blue-500/20 text-blue-400 border-blue-500/30"
                >
                  Filtro: Contas a Receber
                  {onClearFilter && (
                    <button
                      onClick={onClearFilter}
                      className="ml-2 hover:bg-background/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              )}
              {typeFilter === 'overdue' && (
                <Badge 
                  variant="secondary" 
                  className="bg-red-500/20 text-red-400 border-red-500/30"
                >
                  Filtro: Contas em Atraso
                  {onClearFilter && (
                    <button
                      onClick={onClearFilter}
                      className="ml-2 hover:bg-background/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
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
          {typeFilter === 'monthly_revenues' ? (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por serviço ou cliente..."
                  value={recurringSearch}
                  onChange={(e) => setRecurringSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              {filteredRecurringServices.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  {recurringSearch 
                    ? "Nenhuma receita encontrada com esse critério de busca."
                    : "Nenhuma receita mensal recorrente ativa no momento."}
                </div>
              ) : (
                <RecurringRevenuesTable revenues={filteredRecurringServices} />
              )}
            </div>
          ) : typeFilter === 'monthly_expenses' ? (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou descrição..."
                  value={recurringSearch}
                  onChange={(e) => setRecurringSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              {filteredRecurringServices.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  {recurringSearch 
                    ? "Nenhuma despesa encontrada com esse critério de busca."
                    : "Nenhuma despesa mensal recorrente ativa no momento."}
                </div>
              ) : (
                <RecurringExpensesTable expenses={filteredRecurringServices} />
              )}
            </div>
          ) : (typeFilter === 'receivables' || typeFilter === 'overdue') ? (
            <UnifiedReceivablesTable 
              receivables={filteredReceivables} 
              onRefresh={refetchReceivables}
            />
          ) : (
            <>
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
                                  {movement.source === 'sale' && (
                                    <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">
                                      Venda
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
            </>
          )}
        </CardContent>
      </Card>

      <UnifiedMovementModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onMovementCreated={handleMovementCreated}
      />
    </>
  );
};

export default AllMovementsSection;
