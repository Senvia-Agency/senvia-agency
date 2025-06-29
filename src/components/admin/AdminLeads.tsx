
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users } from "lucide-react";
import { useUnifiedLeads, useUpdateUnifiedLead } from "@/hooks/useUnifiedLeads";
import LeadFilters from "./leads/LeadFilters";
import LeadCard from "./leads/LeadCard";
import LeadDetailModal from "./leads/LeadDetailModal";
import ConvertLeadModal from "./leads/ConvertLeadModal";
import SyncPaymentsButton from "./SyncPaymentsButton";

const STORAGE_KEY = 'admin-leads-filters';
const DEFAULT_FILTERS = {
  status: "all",
  source: "all",
  dateRange: "30",
  search: ""
};

const AdminLeads = () => {
  const { toast } = useToast();
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [convertLead, setConvertLead] = useState<any>(null);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);

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
    try {
      await updateLeadMutation.mutateAsync({
        leadId,
        updates: { lead_status: newStatus }
      });

      // Se o status foi alterado para "converted", abrir modal de conversão
      if (newStatus === 'converted') {
        const lead = leads?.find(l => l.id === leadId);
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
      <div className="space-y-4 lg:space-y-6 p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl lg:text-3xl font-bold">Gestão de Leads</h1>
        </div>
        <div className="text-center py-8 text-gray-400">
          Carregando leads...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6 p-4 lg:p-6 w-full max-w-full overflow-x-hidden">
      {/* Header - Mobile Optimized */}
      <div className="space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl lg:text-3xl font-bold mb-1 lg:mb-2 truncate">Gestão de Leads</h1>
          <p className="text-sm lg:text-base text-gray-400 truncate">Gerencie todos os leads da SENVIA</p>
        </div>
        <div className="flex items-center justify-between lg:justify-end gap-2 lg:gap-4">
          <SyncPaymentsButton />
          <Badge 
            variant="outline" 
            className="text-senvia-500 border-senvia-500/50 bg-senvia-500/10 text-xs lg:text-sm px-2 py-1 flex-shrink-0"
          >
            {filteredLeads?.length || 0} leads
          </Badge>
        </div>
      </div>

      {/* Filtros */}
      <LeadFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Lista de Leads */}
      <div className="space-y-3 lg:space-y-4">
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
        <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
          <CardContent className="text-center py-8 lg:py-12">
            <Users className="h-8 w-8 lg:h-12 lg:w-12 text-slate-500 mx-auto mb-3 lg:mb-4" />
            <h3 className="text-base lg:text-lg font-medium text-white mb-2">Nenhum lead encontrado</h3>
            <p className="text-sm lg:text-base text-slate-400">Ajuste os filtros ou aguarde novos leads chegarem.</p>
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
