
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Search, 
  Eye,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useUnifiedLeads, useUpdateUnifiedLead } from "@/hooks/useUnifiedLeads";
import { useConvertLeadToCustomer } from "@/hooks/useCustomers";

const AdminLeads = () => {
  const { toast } = useToast();
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

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

      refetch();
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o status do lead.",
        variant: "destructive"
      });
    }
  };

  // Converter lead para cliente
  const convertToCustomer = async (leadId: string) => {
    try {
      await convertLeadMutation.mutateAsync(leadId);
      
      toast({
        title: "Lead convertido",
        description: "O lead foi convertido para cliente com sucesso."
      });

      refetch();
      setSelectedLead(null);
    } catch (error) {
      toast({
        title: "Erro na conversão",
        description: "Não foi possível converter o lead para cliente.",
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
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'contacted': return <Phone className="h-4 w-4 text-yellow-500" />;
      case 'qualified': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'converted': return <CheckCircle className="h-4 w-4 text-purple-500" />;
      case 'lost': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-500';
      case 'contacted': return 'bg-yellow-500/20 text-yellow-500';
      case 'qualified': return 'bg-green-500/20 text-green-500';
      case 'converted': return 'bg-purple-500/20 text-purple-500';
      case 'lost': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getSourceLabel = (sourcePage: string) => {
    switch (sourcePage) {
      case 'landing_page_basic': return 'Landing Page €4.99';
      case 'landing_page_premium': return 'Landing Page Premium';
      default: return sourcePage;
    }
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
          <Badge variant="outline">{filteredLeads?.length || 0} leads</Badge>
        </div>
      </div>

      {/* Filtros */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="new">Novo</SelectItem>
                <SelectItem value="contacted">Contatado</SelectItem>
                <SelectItem value="qualified">Qualificado</SelectItem>
                <SelectItem value="converted">Convertido</SelectItem>
                <SelectItem value="lost">Perdido</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600">
                <SelectValue placeholder="Filtrar por fonte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as fontes</SelectItem>
                <SelectItem value="basic">Landing Page €4.99</SelectItem>
                <SelectItem value="premium">Landing Page Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Leads */}
      <div className="grid grid-cols-1 gap-4">
        {filteredLeads?.map((lead) => (
          <Card key={lead.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(lead.lead_status)}
                    <div>
                      <div className="font-medium text-white">{lead.full_name || lead.company_name || 'Nome não informado'}</div>
                      <div className="text-sm text-gray-400">{getSourceLabel(lead.source_page)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Mail className="h-4 w-4" />
                      {lead.email || 'N/A'}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Phone className="h-4 w-4" />
                      {lead.phone || 'N/A'}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(lead.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(lead.lead_status)}>
                    {lead.lead_status || 'new'}
                  </Badge>
                  
                  <Badge variant={lead.source_page === 'landing_page_basic' ? 'default' : 'secondary'}>
                    {lead.source_page === 'landing_page_basic' ? '€4.99' : 'Premium'}
                  </Badge>

                  {lead.lead_status !== 'converted' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => convertToCustomer(lead.id)}
                      className="border-green-600 text-green-400 hover:bg-green-700"
                      disabled={convertLeadMutation.isPending}
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Converter
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedLead(lead)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Abrir
                  </Button>
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
        <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Detalhes do Lead</DialogTitle>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Nome Completo</label>
                  <p className="text-sm text-gray-400">{selectedLead.full_name || 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Email</label>
                  <p className="text-sm text-gray-400">{selectedLead.email || 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Telefone</label>
                  <p className="text-sm text-gray-400">{selectedLead.phone || 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Empresa</label>
                  <p className="text-sm text-gray-400">{selectedLead.company_name || 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Fonte</label>
                  <Badge variant={selectedLead.source_page === 'landing_page_basic' ? 'default' : 'secondary'}>
                    {getSourceLabel(selectedLead.source_page)}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Convertido</label>
                  <Badge variant={selectedLead.converted ? 'default' : 'secondary'}>
                    {selectedLead.converted ? 'Sim' : 'Não'}
                  </Badge>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium text-gray-300">Status do Lead</label>
                <Select 
                  value={selectedLead.lead_status} 
                  onValueChange={(value) => updateLeadStatus(selectedLead.id, value)}
                >
                  <SelectTrigger className="mt-2 bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Novo</SelectItem>
                    <SelectItem value="contacted">Contatado</SelectItem>
                    <SelectItem value="qualified">Qualificado</SelectItem>
                    <SelectItem value="converted">Convertido</SelectItem>
                    <SelectItem value="lost">Perdido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Informações Específicas */}
              {selectedLead.objective && (
                <div>
                  <label className="text-sm font-medium text-gray-300">Objetivo</label>
                  <p className="text-sm text-gray-400 mt-1">{selectedLead.objective}</p>
                </div>
              )}

              {selectedLead.main_product_service && (
                <div>
                  <label className="text-sm font-medium text-gray-300">Produto/Serviço Principal</label>
                  <p className="text-sm text-gray-400 mt-1">{selectedLead.main_product_service}</p>
                </div>
              )}

              {selectedLead.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-300">Notas</label>
                  <p className="text-sm text-gray-400 mt-1">{selectedLead.notes}</p>
                </div>
              )}

              {/* Data de Criação */}
              <div>
                <label className="text-sm font-medium text-gray-300">Data de Cadastro</label>
                <p className="text-sm text-gray-400">
                  {format(new Date(selectedLead.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </p>
              </div>

              {/* Ação de Conversão */}
              {selectedLead.lead_status !== 'converted' && !selectedLead.converted && (
                <div className="pt-4 border-t border-gray-700">
                  <Button
                    onClick={() => convertToCustomer(selectedLead.id)}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={convertLeadMutation.isPending}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Converter para Cliente
                  </Button>
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
