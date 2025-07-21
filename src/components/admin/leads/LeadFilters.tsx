
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Search } from "lucide-react";
import { DateRange } from "react-day-picker";

interface LeadFiltersProps {
  filters: {
    status: string;
    source: string;
    search: string;
  };
  dateRange?: DateRange;
  onFiltersChange: (filters: any) => void;
  onDateRangeChange?: (range: DateRange | undefined) => void;
}

const LeadFilters = ({ filters, dateRange, onFiltersChange, onDateRangeChange }: LeadFiltersProps) => {
  const updateFilter = (key: string, value: string) => {
    console.log('Updating filter:', key, value);
    const newFilters = { ...filters, [key]: value };
    console.log('New filters:', newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-3 md:p-6">
        <div className="space-y-3 md:space-y-4">
          {/* Busca - Largura total no mobile */}
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white text-sm"
              />
            </div>
          </div>
          
          {/* Filtros em grid responsivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {/* Filtro Status */}
            <Select value={filters.status || "all"} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-9 text-sm">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 z-50">
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="new">Novo</SelectItem>
                <SelectItem value="contacted">Contactado</SelectItem>
                <SelectItem value="qualified">Qualificado</SelectItem>
                <SelectItem value="proposal">Proposta Enviada</SelectItem>
                <SelectItem value="negotiation">Negociação</SelectItem>
                <SelectItem value="converted">Convertido</SelectItem>
                <SelectItem value="lost">Perdido</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro Fonte */}
            <Select value={filters.source || "all"} onValueChange={(value) => updateFilter('source', value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-9 text-sm">
                <SelectValue placeholder="Selecione a fonte" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 z-50">
                <SelectItem value="all">Todas as fontes</SelectItem>
                <SelectItem value="basic">Landing Page €4.99</SelectItem>
                <SelectItem value="premium">Landing Page Premium</SelectItem>
                <SelectItem value="consultoria">Agendar Consultoria</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro Período */}
            <div className="sm:col-span-2 lg:col-span-1">
              <DateRangePicker
                value={dateRange}
                onChange={onDateRangeChange}
                className="w-full h-9 text-sm"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadFilters;
