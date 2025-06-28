
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Search, 
  Mail,
  Phone,
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Crown
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useUnifiedLeads, useUpdateUnifiedLead } from "@/hooks/useUnifiedLeads";
import { useConvertLeadToCustomer } from "@/hooks/useCustomers";
import { cn } from "@/lib/utils";

const AdminLeads = () => {
  const { toast } = useToast();
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [editingStatus, setEditingStatus] = useState<string | null>(null);

  const { data: leads, refetch, isLoading } = useUnifiedLeads();
  const updateLeadMutation = useUpdateUnifiedLead();
  const convertLeadMutation = useConvertLeadToCustomer();

  // Atualizar status do lead
  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      await updateLeadMutation.mutateAsync({
        leadId,
        updates: { lead_status: newStatus }
      });

      toast({
        title: "Status atualizado",
        description: "O status do lead foi atualizado com sucesso."
      });

      setEditingStatus(null);
      refetch();
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o status do lead.",
        variant: "destructive"
      });
    }
  };

  // Filtrar leads
  const filteredLeads = leads?.filter(lead => {
    const matchesSearch = 
      lead.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm) ||
      lead.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lead.lead_status === statusFilter;
    const matchesSource = sourceFilter === "all" || 
      (sourceFilter === "basic" && lead.source_page === "landing_page_basic") ||
      (sourceFilter === "premium" && lead.source_page === "landing_page_premium");
    
    // Filtro de data
    let matchesDate = true;
    if (dateFrom || dateTo) {
      const leadDate = new Date(lead.created_at);
      if (dateFrom && leadDate < dateFrom) matchesDate = false;
      if (dateTo && leadDate > dateTo) matchesDate = false;
    }
    
    return matchesSearch && matchesStatus && matchesSource && matchesDate;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="h-4 w-4" />;
      case 'contacted': return <Phone className="h-4 w-4" />;
      case 'qualified': return <CheckCircle className="h-4 w-4" />;
      case 'converted': return <Crown className="h-4 w-4" />;
      case 'lost': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'contacted': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'qualified': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'converted': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'lost': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSourceLabel = (sourcePage: string) => {
    switch (sourcePage) {
      case 'landing_page_basic': return 'Landing Page €4.99';
      case 'landing_page_premium': return 'Landing Page Premium';
      default: return sourcePage;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Novo';
      case 'contacted': return 'Contatado';
      case 'qualified': return 'Qualificado';
      case 'converted': return 'Convertido';
      case 'lost': return 'Perdido';
      default: return status;
    }
  };

  const clearDateFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gestão de Leads</h1>
        </div>
        <div className="text-center py-8 text-gray-400">
          Carregando leads...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestão de Leads</h1>
          <p className="text-gray-400">Gerencie todos os leads da SENVIA</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-senvia-500">{filteredLeads?.length || 0} leads</Badge>
        </div>
      </div>

      {/* Filtros Melhorados */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Busca */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            
            {/* Filtro Status */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="new">Novo</SelectItem>
                <SelectItem value="contacted">Contatado</SelectItem>
                <SelectItem value="qualified">Qualificado</SelectItem>
                <SelectItem value="converted">Convertido</SelectItem>
                <SelectItem value="lost">Perdido</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro Fonte */}
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Fonte" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Todas as fontes</SelectItem>
                <SelectItem value="basic">Landing Page €4.99</SelectItem>
                <SelectItem value="premium">Landing Page Premium</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtros de Data */}
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
                      !dateFrom && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Data início"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                    className="bg-gray-800 text-white"
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
                      !dateTo && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "dd/MM/yyyy") : "Data fim"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                    className="bg-gray-800 text-white"
                  />
                </PopoverContent>
              </Popover>
              
              {(dateFrom || dateTo) && (
                <Button
                  variant="ghost"
                  onClick={clearDateFilters}
                  className="px-2 text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  ✕
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Leads */}
      <div className="grid grid-cols-1 gap-4">
        {filteredLeads?.map((lead) => (
          <Card 
            key={lead.id} 
            className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all cursor-pointer hover:bg-gray-750"
            onClick={() => setSelectedLead(lead)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                  {/* Informações Principais */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white text-lg">
                        {lead.full_name || lead.company_name || 'Nome não informado'}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", lead.source_page === 'landing_page_basic' ? 'border-senvia-500 text-senvia-400' : 'border-purple-500 text-purple-400')}
                      >
                        {getSourceLabel(lead.source_page)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{lead.email || 'N/A'}</span>
                      </div>
                      
                      {lead.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{lead.phone}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{format(new Date(lead.created_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Clicável */}
                  <div 
                    className="flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingStatus(editingStatus === lead.id ? null : lead.id);
                    }}
                  >
                    {editingStatus === lead.id ? (
                      <Select 
                        value={lead.lead_status} 
                        onValueChange={(value) => updateLeadStatus(lead.id, value)}
                      >
                        <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="new">Novo</SelectItem>
                          <SelectItem value="contacted">Contatado</SelectItem>
                          <SelectItem value="qualified">Qualificado</SelectItem>
                          <SelectItem value="converted">Convertido</SelectItem>
                          <SelectItem value="lost">Perdido</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge 
                        className={cn(
                          "cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2 px-3 py-1 border",
                          getStatusColor(lead.lead_status)
                        )}
                      >
                        {getStatusIcon(lead.lead_status)}
                        {getStatusLabel(lead.lead_status)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {(!filteredLeads || filteredLeads.length === 0) && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Nenhum lead encontrado</h3>
            <p className="text-gray-400">Ajuste os filtros ou aguarde novos leads chegarem.</p>
          </CardContent>
        </Card>
      )}

      {/* Modal de Detalhes do Lead */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-3xl bg-gray-800 border-gray-700 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-3">
              Detalhes do Lead
              {selectedLead && (
                <Badge 
                  variant="outline" 
                  className={cn("ml-2", selectedLead.source_page === 'landing_page_basic' ? 'border-senvia-500 text-senvia-400' : 'border-purple-500 text-purple-400')}
                >
                  {getSourceLabel(selectedLead.source_page)}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Nome Completo</label>
                    <p className="text-white mt-1">{selectedLead.full_name || 'Não informado'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300">Email</label>
                    <p className="text-white mt-1">{selectedLead.email || 'Não informado'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300">Telefone</label>
                    <p className="text-white mt-1">{selectedLead.phone || 'Não informado'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Empresa</label>
                    <p className="text-white mt-1">{selectedLead.company_name || 'Não informado'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300">Website</label>
                    <p className="text-white mt-1">{selectedLead.website || 'Não informado'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300">Data de Cadastro</label>
                    <p className="text-white mt-1">
                      {format(new Date(selectedLead.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status e Conversão */}
              <div className="border-t border-gray-700 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Status</label>
                    <div className="mt-2">
                      <Badge className={cn("flex items-center gap-2 w-fit", getStatusColor(selectedLead.lead_status))}>
                        {getStatusIcon(selectedLead.lead_status)}
                        {getStatusLabel(selectedLead.lead_status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300">Convertido</label>
                    <div className="mt-2">
                      <Badge variant={selectedLead.converted ? 'default' : 'secondary'}>
                        {selectedLead.converted ? 'Sim' : 'Não'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300">Status de Pagamento</label>
                    <div className="mt-2">
                      <Badge variant={selectedLead.payment_status === 'paid' ? 'default' : 'secondary'}>
                        {selectedLead.payment_status || 'pending'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações Específicas */}
              {(selectedLead.objective || selectedLead.main_product_service || selectedLead.notes) && (
                <div className="border-t border-gray-700 pt-6 space-y-4">
                  {selectedLead.objective && (
                    <div>
                      <label className="text-sm font-medium text-gray-300">Objetivo</label>
                      <p className="text-white mt-1">{selectedLead.objective}</p>
                    </div>
                  )}

                  {selectedLead.main_product_service && (
                    <div>
                      <label className="text-sm font-medium text-gray-300">Produto/Serviço Principal</label>
                      <p className="text-white mt-1">{selectedLead.main_product_service}</p>
                    </div>
                  )}

                  {selectedLead.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-300">Notas</label>
                      <p className="text-white mt-1">{selectedLead.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLeads;
