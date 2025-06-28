
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUnifiedLeads, useUpdateUnifiedLead } from "@/hooks/useUnifiedLeads";
import { Search, Filter, Download } from "lucide-react";
import LeadFilters from "./leads/LeadFilters";
import LeadCard from "./leads/LeadCard";
import LeadDetailModal from "./leads/LeadDetailModal";
import ConvertLeadModal from "./leads/ConvertLeadModal";
import { useToast } from "@/hooks/use-toast";

const AdminLeads = () => {
  const { data: leads, isLoading } = useUnifiedLeads();
  const updateLead = useUpdateUnifiedLead();
  const { toast } = useToast();
  
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    source: 'all',
    dateRange: 'all',
    search: ''
  });

  // Filtrar leads
  const filteredLeads = leads?.filter(lead => {
    const matchesStatus = filters.status === 'all' || lead.lead_status === filters.status;
    const matchesSource = filters.source === 'all' || lead.source_page === filters.source;
    const matchesSearch = !filters.search || 
      lead.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      lead.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      lead.company_name?.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesSource && matchesSearch;
  }) || [];

  // Estatísticas
  const stats = {
    total: leads?.length || 0,
    new: leads?.filter(l => l.lead_status === 'new').length || 0,
    contacted: leads?.filter(l => l.lead_status === 'contacted').length || 0,
    converted: leads?.filter(l => l.converted === true).length || 0,
    basic: leads?.filter(l => l.source_page === 'landing_page_basic').length || 0,
    premium: leads?.filter(l => l.source_page === 'landing_page_premium').length || 0
  };

  const handleViewLead = (lead: any) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  const handleEditLead = (lead: any) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  const handleConvertLead = (lead: any) => {
    setSelectedLead(lead);
    setIsConvertModalOpen(true);
  };

  const handleUpdateLead = async (updates: any) => {
    if (!selectedLead) return;
    
    try {
      await updateLead.mutateAsync({
        leadId: selectedLead.id,
        updates
      });
      
      toast({
        title: "Lead atualizado",
        description: "As informações do lead foram atualizadas com sucesso."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar lead",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Gestão de Leads</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-400">Carregando leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Gestão de Leads</h1>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-600">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <p className="text-gray-400 text-sm">Total de Leads</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-400">{stats.new}</div>
            <p className="text-gray-400 text-sm">Novos</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-400">{stats.contacted}</div>
            <p className="text-gray-400 text-sm">Contatados</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">{stats.converted}</div>
            <p className="text-gray-400 text-sm">Convertidos</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-senvia-500">{stats.basic}</div>
            <p className="text-gray-400 text-sm">LP Básica</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-400">{stats.premium}</div>
            <p className="text-gray-400 text-sm">LP Premium</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <LeadFilters 
        filters={filters} 
        onFiltersChange={setFilters}
      />

      {/* Lista de Leads */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            Leads ({filteredLeads.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLeads.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Nenhum lead encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onView={handleViewLead}
                  onEdit={handleEditLead}
                  onConvert={handleConvertLead}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modais */}
      <LeadDetailModal
        selectedLead={selectedLead}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedLead(null);
        }}
        onUpdate={handleUpdateLead}
      />

      <ConvertLeadModal
        isOpen={isConvertModalOpen}
        onClose={() => {
          setIsConvertModalOpen(false);
          setSelectedLead(null);
        }}
        lead={selectedLead}
      />
    </div>
  );
};

export default AdminLeads;
