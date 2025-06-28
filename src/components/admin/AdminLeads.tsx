
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Eye, 
  Edit, 
  Star, 
  Calendar, 
  User, 
  Target, 
  TrendingUp, 
  Users, 
  Phone, 
  Mail,
  Plus,
  Filter
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Lead {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  phone: string;
  country_code: string;
  business_name?: string;
  website?: string;
  objective: string;
  status: string;
  priority: number;
  assigned_to?: string;
  source: string;
  notes?: string;
  last_contact?: string;
  next_followup?: string;
  converted: boolean;
  conversion_date?: string;
  conversion_value?: number;
  lead_type: 'senvia_landing_page' | 'landing_page';
}

const AdminLeads = () => {
  const { toast } = useToast();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Buscar leads da landing page tradicional
  const { data: landingPageLeads, refetch: refetchLandingPageLeads } = useQuery({
    queryKey: ['admin-landing-page-leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data?.map(lead => ({
        ...lead,
        lead_type: 'landing_page' as const,
        full_name: lead.company_name || 'Nome não informado',
        phone: lead.company_whatsapp || '',
        country_code: '+351',
        objective: lead.landing_page_objective || 'Não especificado',
        status: lead.lead_status || 'new',
        priority: 1,
        source: 'landing_page',
        converted: lead.payment_status === 'paid',
        notes: ''
      })) || [];
    },
  });

  // Buscar leads da senvia landing page
  const { data: senviaLeads, refetch: refetchSenviaLeads } = useQuery({
    queryKey: ['admin-senvia-leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('landing_page_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data?.map(lead => ({
        ...lead,
        lead_type: 'senvia_landing_page' as const
      })) || [];
    },
  });

  // Combinar todos os leads
  const allLeads = [
    ...(landingPageLeads || []),
    ...(senviaLeads || [])
  ];

  // Filtrar leads
  const filteredLeads = allLeads.filter(lead => {
    const matchesSearch = 
      lead.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm) ||
      lead.business_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesSource = sourceFilter === "all" || lead.lead_type === sourceFilter;
    const matchesPriority = priorityFilter === "all" || lead.priority?.toString() === priorityFilter;

    return matchesSearch && matchesStatus && matchesSource && matchesPriority;
  });

  const updateLeadStatus = async (leadId: string, leadType: 'landing_page' | 'senvia_landing_page', newStatus: string) => {
    try {
      const tableName = leadType === 'landing_page' ? 'leads' : 'landing_page_leads';
      const statusField = leadType === 'landing_page' ? 'lead_status' : 'status';
      
      const { error } = await supabase
        .from(tableName)
        .update({ 
          [statusField]: newStatus,
          last_contact: newStatus !== 'new' ? new Date().toISOString() : null
        })
        .eq('id', leadId);

      if (error) throw error;
      
      // Refetch appropriate leads
      if (leadType === 'landing_page') {
        refetchLandingPageLeads();
      } else {
        refetchSenviaLeads();
      }
      
      toast({
        title: "Status atualizado",
        description: `Lead marcado como ${getStatusLabel(newStatus)}.`
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive"
      });
    }
  };

  const addLeadNote = async (leadId: string, leadType: 'landing_page' | 'senvia_landing_page', content: string) => {
    try {
      const { error } = await supabase
        .from('lead_notes')
        .insert({
          lead_id: leadId,
          lead_type: leadType,
          content: content,
          note_type: 'note'
        });

      if (error) throw error;
      
      toast({
        title: "Nota adicionada",
        description: "A nota foi salva com sucesso."
      });
    } catch (error) {
      console.error('Erro ao adicionar nota:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a nota.",
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
      'won': 'Ganho',
      'lost': 'Perdido',
      'pending': 'Pendente'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'new': 'bg-blue-500',
      'contacted': 'bg-yellow-500',
      'qualified': 'bg-green-500',
      'proposal': 'bg-purple-500',
      'negotiation': 'bg-orange-500',
      'won': 'bg-emerald-500',
      'lost': 'bg-red-500',
      'pending': 'bg-gray-500'
    };
    return colorMap[status] || 'bg-gray-500';
  };

  const getPriorityLabel = (priority: number) => {
    const priorityMap: { [key: number]: string } = {
      1: 'Baixa',
      2: 'Média',
      3: 'Alta',
      4: 'Urgente'
    };
    return priorityMap[priority] || 'Baixa';
  };

  const getPriorityColor = (priority: number) => {
    const colorMap: { [key: number]: string } = {
      1: 'text-green-600',
      2: 'text-yellow-600',
      3: 'text-orange-600',
      4: 'text-red-600'
    };
    return colorMap[priority] || 'text-green-600';
  };

  // Calcular estatísticas
  const stats = {
    total: allLeads.length,
    new: allLeads.filter(lead => lead.status === 'new').length,
    contacted: allLeads.filter(lead => lead.status === 'contacted').length,
    qualified: allLeads.filter(lead => lead.status === 'qualified').length,
    converted: allLeads.filter(lead => lead.converted).length,
    conversionRate: allLeads.length > 0 ? (allLeads.filter(lead => lead.converted).length / allLeads.length) * 100 : 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestão de Leads</h1>
          <p className="text-gray-400">Gerencie todos os leads da SENVIA</p>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total de Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Novos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold">{stats.new}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Contactados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-yellow-500" />
              <span className="text-2xl font-bold">{stats.contacted}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Qualificados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold">{stats.qualified}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Convertidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-2xl font-bold">{stats.converted}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, email, telefone ou empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-gray-700 border-gray-600">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="new">Novo</SelectItem>
                <SelectItem value="contacted">Contactado</SelectItem>
                <SelectItem value="qualified">Qualificado</SelectItem>
                <SelectItem value="proposal">Proposta Enviada</SelectItem>
                <SelectItem value="negotiation">Negociação</SelectItem>
                <SelectItem value="won">Ganho</SelectItem>
                <SelectItem value="lost">Perdido</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full md:w-40 bg-gray-700 border-gray-600">
                <SelectValue placeholder="Fonte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Fontes</SelectItem>
                <SelectItem value="landing_page">Landing Page (€4.99)</SelectItem>
                <SelectItem value="senvia_landing_page">Senvia Landing Page</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-40 bg-gray-700 border-gray-600">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Prioridades</SelectItem>
                <SelectItem value="1">Baixa</SelectItem>
                <SelectItem value="2">Média</SelectItem>
                <SelectItem value="3">Alta</SelectItem>
                <SelectItem value="4">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Lead</TableHead>
                  <TableHead className="text-gray-300">Contacto</TableHead>
                  <TableHead className="text-gray-300">Empresa</TableHead>
                  <TableHead className="text-gray-300">Fonte</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Prioridade</TableHead>
                  <TableHead className="text-gray-300">Data</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={`${lead.lead_type}-${lead.id}`} className="border-gray-700">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{lead.full_name}</div>
                        <div className="text-sm text-gray-400">
                          {lead.country_code} {lead.phone}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-gray-300">
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-300">
                          <Phone className="h-3 w-3" />
                          {lead.country_code} {lead.phone}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{lead.business_name || '-'}</div>
                        {lead.website && (
                          <div className="text-sm text-gray-400">{lead.website}</div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={lead.lead_type === 'landing_page' ? 'border-green-500 text-green-500' : 'border-blue-500 text-blue-500'}
                      >
                        {lead.lead_type === 'landing_page' ? 'Landing Page (€4.99)' : 'Senvia Landing Page'}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(lead.status)}`}></div>
                        <span className="text-sm text-gray-300">{getStatusLabel(lead.status)}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className={`h-4 w-4 ${getPriorityColor(lead.priority || 1)}`} />
                        <span className={`text-sm ${getPriorityColor(lead.priority || 1)}`}>
                          {getPriorityLabel(lead.priority || 1)}
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm text-gray-300">
                        {format(new Date(lead.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                      <div className="text-xs text-gray-400">
                        {format(new Date(lead.created_at), 'HH:mm', { locale: ptBR })}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedLead(lead)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
                          <DialogHeader>
                            <DialogTitle className="text-white">Detalhes do Lead</DialogTitle>
                          </DialogHeader>
                          
                          {selectedLead && (
                            <div className="space-y-6">
                              {/* Informações básicas */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-300">Nome Completo</label>
                                  <p className="text-sm text-gray-400">{selectedLead.full_name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-300">Email</label>
                                  <p className="text-sm text-gray-400">{selectedLead.email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-300">Telefone</label>
                                  <p className="text-sm text-gray-400">
                                    {selectedLead.country_code} {selectedLead.phone}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-300">Empresa</label>
                                  <p className="text-sm text-gray-400">
                                    {selectedLead.business_name || 'Não informado'}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-300">Website</label>
                                  <p className="text-sm text-gray-400">
                                    {selectedLead.website || 'Não informado'}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-300">Fonte</label>
                                  <p className="text-sm text-gray-400">
                                    {selectedLead.lead_type === 'landing_page' ? 'Landing Page (€4.99)' : 'Senvia Landing Page'}
                                  </p>
                                </div>
                              </div>

                              {/* Status */}
                              <div>
                                <label className="text-sm font-medium text-gray-300">Status</label>
                                <Select 
                                  value={selectedLead.status} 
                                  onValueChange={(value) => updateLeadStatus(selectedLead.id, selectedLead.lead_type, value)}
                                >
                                  <SelectTrigger className="mt-1 bg-gray-700 border-gray-600">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="new">Novo</SelectItem>
                                    <SelectItem value="contacted">Contactado</SelectItem>
                                    <SelectItem value="qualified">Qualificado</SelectItem>
                                    <SelectItem value="proposal">Proposta Enviada</SelectItem>
                                    <SelectItem value="negotiation">Negociação</SelectItem>
                                    <SelectItem value="won">Ganho</SelectItem>
                                    <SelectItem value="lost">Perdido</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Adicionar nota */}
                              <div>
                                <label className="text-sm font-medium text-gray-300">Adicionar Nota</label>
                                <div className="flex gap-2 mt-1">
                                  <Textarea
                                    placeholder="Adicione uma nota sobre este lead..."
                                    className="bg-gray-700 border-gray-600"
                                    id="lead-note"
                                  />
                                  <Button
                                    onClick={() => {
                                      const textarea = document.getElementById('lead-note') as HTMLTextAreaElement;
                                      if (textarea.value.trim()) {
                                        addLeadNote(selectedLead.id, selectedLead.lead_type, textarea.value);
                                        textarea.value = '';
                                      }
                                    }}
                                  >
                                    Salvar
                                  </Button>
                                </div>
                              </div>

                              {/* Datas */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-300">Data de Criação</label>
                                  <p className="text-sm text-gray-400">
                                    {format(new Date(selectedLead.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-300">Última Atualização</label>
                                  <p className="text-sm text-gray-400">
                                    {format(new Date(selectedLead.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredLeads.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">Nenhum lead encontrado.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLeads;
