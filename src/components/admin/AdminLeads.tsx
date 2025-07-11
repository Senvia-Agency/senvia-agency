import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users } from "lucide-react";
import { useUnifiedLeads, useUpdateUnifiedLead } from "@/hooks/useUnifiedLeads";
import { useCreateActivity } from "@/hooks/useActivityHistory";
import LeadFilters from "./leads/LeadFilters";
import LeadCard from "./leads/LeadCard";
import LeadDetailModal from "./leads/LeadDetailModal";
import ConvertLeadModal from "./leads/ConvertLeadModal";
import { useAuth } from "@/contexts/AuthContext";

const STORAGE_KEY = 'admin-leads-filters';
const DEFAULT_FILTERS = {
  status: "all",
  source: "all",
  dateRange: "30",
  search: ""
};

const AdminLeads = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [convertLead, setConvertLead] = useState<any>(null);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const createActivity = useCreateActivity();

  // Função para obter o nome do usuário logado
  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    // Se não tiver no metadata, tentar obter de outras fontes
    if (user?.identities?.[0]?.identity_data?.full_name) {
      return user.identities[0].identity_data.full_name;
    }
    // Como último recurso, usar o email
    return user?.email || 'Usuário';
  };

  // Simplified filters without problematic listeners
  const [filters, setFilters] = useState(() => {
    try {
      const savedFilters = localStorage.getItem(STORAGE_KEY);
      return savedFilters ? JSON.parse(savedFilters) : DEFAULT_FILTERS;
    } catch (error) {
      console.error('Erro ao recuperar filtros salvos:', error);
      return DEFAULT_FILTERS;
    }
  });

  const { data: leads, refetch, isLoading } = useUnifiedLeads();
  const updateLeadMutation = useUpdateUnifiedLead();

  // Save filters whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch (error) {
      console.error('Erro ao salvar filtros:', error);
    }
  }, [filters]);

  // Optimized filter update function
  const handleFiltersChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
  }, []);

  // Atualizar status do lead
  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    console.log('updateLeadStatus called with:', { leadId, newStatus });
    try {
      const lead = leads?.find(l => l.id === leadId);
      const oldStatus = lead?.lead_status;

      await updateLeadMutation.mutateAsync({
        leadId,
        updates: { lead_status: newStatus }
      });

      // Gravar no histórico automaticamente
      if (oldStatus !== newStatus) {
        await createActivity.mutateAsync({
          entity_type: 'lead',
          entity_id: leadId,
          activity_type: 'status_change',
          title: `Status alterado para ${getStatusLabel(newStatus)}`,
          description: `Status alterado de "${getStatusLabel(oldStatus)}" para "${getStatusLabel(newStatus)}"`,
          contact_person: getUserDisplayName(),
          contact_method: 'sistema'
        });
      }

      // Se o status foi alterado para "converted", abrir modal de conversão
      if (newStatus === 'converted') {
        if (lead) {
          setConvertLead(lead);
        }
      }

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

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'new': 'Novo',
      'contacted': 'Contactado',
      'qualified': 'Qualificado',
      'proposal': 'Proposta Enviada',
      'negotiation': 'Negociação',
      'converted': 'Convertido',
      'lost': 'Perdido'
    };
    return statusMap[status] || status;
  };

  // Atualizar dados do lead
  const updateLeadData = async (updates: any) => {
    if (!selectedLead) return;

    try {
      await updateLeadMutation.mutateAsync({
        leadId: selectedLead.id,
        updates
      });

      toast({
        title: "Lead atualizado",
        description: "Os dados do lead foram atualizados com sucesso."
      });

      setSelectedLead({ ...selectedLead, ...updates });
      refetch();
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar os dados do lead.",
        variant: "destructive"
      });
    }
  };

  // Filtrar leads
  const filteredLeads = leads?.filter(lead => {
    const matchesSearch = 
      lead.full_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
      lead.phone?.includes(filters.search) ||
      lead.company_name?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = filters.status === "all" || lead.lead_status === filters.status;
    const matchesSource = filters.source === "all" || 
      (filters.source === "basic" && lead.source_page === "landing_page_basic") ||
      (filters.source === "premium" && lead.source_page === "landing_page_premium");
    
    // Filtro de data
    const daysAgo = parseInt(filters.dateRange);
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - daysAgo);
    const leadDate = new Date(lead.created_at);
    const matchesDate = leadDate >= dateThreshold;
    
    return matchesSearch && matchesStatus && matchesSource && matchesDate;
  });

  const handleLeadClick = (lead: any) => {
    console.log('Lead clicked:', lead);
    setSelectedLead(lead);
  };

  const handleStatusEdit = (leadId: string) => {
    setEditingStatus(editingStatus === leadId ? null : leadId);
  };

  const handleConvertSuccess = () => {
    refetch();
    setConvertLead(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-8 p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold whitespace-nowrap">Gestão de Leads</h1>
        </div>
        <div className="text-center py-8 text-gray-400">
          Carregando leads...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 whitespace-nowrap">Gestão de Leads</h1>
          <p className="text-gray-400 text-sm sm:text-base">Gerencie todos os leads da SENVIA</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-senvia-500 text-xs sm:text-sm whitespace-nowrap">{filteredLeads?.length || 0} leads</Badge>
        </div>
      </div>

      {/* Filtros */}
      <LeadFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Lista de Leads */}
      <div className="grid grid-cols-1 gap-4">
        {filteredLeads?.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            editingStatus={editingStatus}
            onLeadClick={handleLeadClick}
            onStatusEdit={handleStatusEdit}
            onStatusUpdate={updateLeadStatus}
          />
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

      {/* Modal de Detalhes/Edição do Lead */}
      <LeadDetailModal
        selectedLead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdate={updateLeadData}
      />

      {/* Modal de Conversão */}
      <ConvertLeadModal
        lead={convertLead}
        isOpen={!!convertLead}
        onClose={() => setConvertLead(null)}
        onConvert={handleConvertSuccess}
      />
    </div>
  );
};

export default AdminLeads;
