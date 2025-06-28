
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users } from "lucide-react";
import { useUnifiedLeads, useUpdateUnifiedLead } from "@/hooks/useUnifiedLeads";
import LeadFilters from "./leads/LeadFilters";
import LeadCard from "./leads/LeadCard";
import LeadDetailModal from "./leads/LeadDetailModal";

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

  const handleLeadClick = (lead: any) => {
    setSelectedLead(lead);
  };

  const handleStatusEdit = (leadId: string) => {
    setEditingStatus(editingStatus === leadId ? null : leadId);
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

      {/* Filtros */}
      <LeadFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        totalLeads={filteredLeads?.length || 0}
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
    </div>
  );
};

export default AdminLeads;
