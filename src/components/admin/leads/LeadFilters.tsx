
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface LeadFiltersProps {
  filters: {
    status: string;
    source: string;
    dateRange: string;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
}

const LeadFilters = ({ filters, onFiltersChange }: LeadFiltersProps) => {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
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
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-9 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 z-50">
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="new">Novo</SelectItem>
                <SelectItem value="contacted">Contatado</SelectItem>
                <SelectItem value="qualified">Qualificado</SelectItem>
                <SelectItem value="converted">Convertido</SelectItem>
                <SelectItem value="lost">Perdido</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro Fonte */}
            <Select value={filters.source} onValueChange={(value) => updateFilter('source', value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-9 text-sm">
                <SelectValue placeholder="Fonte" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 z-50">
                <SelectItem value="all">Todas as fontes</SelectItem>
                <SelectItem value="basic">Landing Page €4.99</SelectItem>
                <SelectItem value="premium">Landing Page Premium</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro Período */}
            <Select value={filters.dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-9 text-sm sm:col-span-2 lg:col-span-1">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 z-50">
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="365">Último ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadFilters;
