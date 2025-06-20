import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";
import { Search, Plus, Eye, Edit, Star, Calendar, User, Target, TrendingUp, Users, Phone, Mail } from "lucide-react";
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
}

const CRM = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    conversionRate: 0
  });

  useEffect(() => {
    document.title = "CRM - Gestão de Leads | SENVIA";
    fetchLeads();
  }, []);

  useEffect(() => {
    filterLeads();
    calculateStats();
  }, [leads, searchTerm, statusFilter, priorityFilter]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('landing_page_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os leads.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        (lead.business_name && lead.business_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(lead => lead.priority.toString() === priorityFilter);
    }

    setFilteredLeads(filtered);
  };

  const calculateStats = () => {
    const total = leads.length;
    const newLeads = leads.filter(lead => lead.status === 'new').length;
    const contacted = leads.filter(lead => lead.status === 'contacted').length;
    const qualified = leads.filter(lead => lead.status === 'qualified').length;
    const converted = leads.filter(lead => lead.converted).length;
    const conversionRate = total > 0 ? (converted / total) * 100 : 0;

    setStats({
      total,
      new: newLeads,
      contacted,
      qualified,
      converted,
      conversionRate
    });
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('landing_page_leads')
        .update({ 
          status: newStatus,
          last_contact: newStatus !== 'new' ? new Date().toISOString() : null
        })
        .eq('id', leadId);

      if (error) throw error;
      
      fetchLeads();
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

  const updateLeadNotes = async (leadId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('landing_page_leads')
        .update({ notes })
        .eq('id', leadId);

      if (error) throw error;
      
      fetchLeads();
      toast({
        title: "Notas atualizadas",
        description: "As notas do lead foram salvas com sucesso."
      });
    } catch (error) {
      console.error('Erro ao atualizar notas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as notas.",
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
      'lost': 'Perdido'
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
      'lost': 'bg-red-500'
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

  const getObjectiveLabel = (objective: string) => {
    const objectiveMap: { [key: string]: string } = {
      'aumentar-vendas': 'Aumentar vendas',
      'captar-leads': 'Captar mais leads',
      'automatizar-atendimento': 'Automatizar atendimentos',
      'lancar-produto': 'Lançar novo produto',
      'outro': 'Outro'
    };
    return objectiveMap[objective] || objective;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="text-center">Carregando...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">CRM - Gestão de Leads</h1>
          <p className="text-muted-foreground">Gerencie todos os leads da sua landing page inteligente</p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-2xl font-bold">{stats.total}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Novos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-500" />
                <span className="text-2xl font-bold">{stats.new}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Contactados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-yellow-500" />
                <span className="text-2xl font-bold">{stats.contacted}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Qualificados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold">{stats.qualified}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Convertidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span className="text-2xl font-bold">{stats.converted}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Conversão</CardTitle>
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
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email, telefone ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
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

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full md:w-40">
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

        {/* Leads Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Objetivo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{lead.full_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {lead.country_code} {lead.phone}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {lead.country_code} {lead.phone}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div>
                          <div className="font-medium">{lead.business_name || '-'}</div>
                          {lead.website && (
                            <div className="text-sm text-muted-foreground">{lead.website}</div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="outline">
                          {getObjectiveLabel(lead.objective)}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(lead.status)}`}></div>
                          <span className="text-sm">{getStatusLabel(lead.status)}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className={`h-4 w-4 ${getPriorityColor(lead.priority)}`} />
                          <span className={`text-sm ${getPriorityColor(lead.priority)}`}>
                            {getPriorityLabel(lead.priority)}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(lead.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(lead.created_at), 'HH:mm', { locale: ptBR })}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedLead(lead)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Detalhes do Lead</DialogTitle>
                              </DialogHeader>
                              
                              {selectedLead && (
                                <div className="space-y-6">
                                  {/* Informações básicas */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Nome Completo</label>
                                      <p className="text-sm text-muted-foreground">{selectedLead.full_name}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Email</label>
                                      <p className="text-sm text-muted-foreground">{selectedLead.email}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Telefone</label>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedLead.country_code} {selectedLead.phone}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Empresa</label>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedLead.business_name || 'Não informado'}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Website</label>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedLead.website || 'Não informado'}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Objetivo</label>
                                      <p className="text-sm text-muted-foreground">
                                        {getObjectiveLabel(selectedLead.objective)}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Status e Prioridade */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Status</label>
                                      <Select 
                                        value={selectedLead.status} 
                                        onValueChange={(value) => updateLeadStatus(selectedLead.id, value)}
                                      >
                                        <SelectTrigger className="mt-1">
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
                                    <div>
                                      <label className="text-sm font-medium">Prioridade</label>
                                      <div className="flex items-center gap-1 mt-1">
                                        <Star className={`h-4 w-4 ${getPriorityColor(selectedLead.priority)}`} />
                                        <span className={`text-sm ${getPriorityColor(selectedLead.priority)}`}>
                                          {getPriorityLabel(selectedLead.priority)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Notas */}
                                  <div>
                                    <label className="text-sm font-medium">Notas</label>
                                    <Textarea
                                      placeholder="Adicione observações sobre este lead..."
                                      value={selectedLead.notes || ''}
                                      onChange={(e) => setSelectedLead({
                                        ...selectedLead,
                                        notes: e.target.value
                                      })}
                                      className="mt-1"
                                      rows={4}
                                    />
                                    <Button
                                      className="mt-2"
                                      onClick={() => updateLeadNotes(selectedLead.id, selectedLead.notes || '')}
                                    >
                                      Salvar Notas
                                    </Button>
                                  </div>

                                  {/* Datas */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Data de Criação</label>
                                      <p className="text-sm text-muted-foreground">
                                        {format(new Date(selectedLead.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Última Atualização</label>
                                      <p className="text-sm text-muted-foreground">
                                        {format(new Date(selectedLead.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredLeads.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum lead encontrado.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default CRM;