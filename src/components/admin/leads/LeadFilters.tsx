
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
    <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm w-full min-w-0">
      <CardContent className="p-4 lg:p-6">
        <div className="space-y-4">
          {/* Search - Full Width */}
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 flex-shrink-0" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600/50 text-white text-sm w-full min-w-0"
              />
            </div>
          </div>
          
          {/* Filter Row - Stack on Mobile, Side by Side on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {/* Status Filter */}
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white text-sm w-full min-w-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800/95 border-slate-600/50 backdrop-blur-sm">
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="new">Novo</SelectItem>
                <SelectItem value="contacted">Contatado</SelectItem>
                <SelectItem value="qualified">Qualificado</SelectItem>
                <SelectItem value="converted">Convertido</SelectItem>
                <SelectItem value="lost">Perdido</SelectItem>
              </SelectContent>
            </Select>

            {/* Source Filter */}
            <Select value={filters.source} onValueChange={(value) => updateFilter('source', value)}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white text-sm w-full min-w-0">
                <SelectValue placeholder="Fonte" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800/95 border-slate-600/50 backdrop-blur-sm">
                <SelectItem value="all">Todas as fontes</SelectItem>
                <SelectItem value="basic">Landing Page €4.99</SelectItem>
                <SelectItem value="premium">Landing Page Premium</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range Filter */}
            <Select value={filters.dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white text-sm w-full min-w-0 sm:col-span-2 lg:col-span-1">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800/95 border-slate-600/50 backdrop-blur-sm">
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
