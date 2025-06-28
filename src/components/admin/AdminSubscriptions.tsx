import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  UserCheck, 
  Users, 
  Calendar, 
  Euro,
  TrendingUp,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SenviaAssistantSubscription {
  id: string;
  user_id: string;
  email: string;
  plan_type: string;
  status: string;
  monthly_price?: number;
  trial_start_date?: string;
  trial_end_date?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  next_billing_date?: string;
  cancelled_at?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  billing_cycle: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

interface CustomerSubscription {
  id: string;
  user_id: string;
  product_id: string;
  plan_id: string;
  status: string;
  start_date: string;
  end_date?: string;
  next_billing_date?: string;
  cancelled_at?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  billing_cycle: string;
  created_at: string;
  updated_at: string;
  products?: {
    name: string;
  };
  product_plans?: {
    name: string;
    price_monthly?: number;
  };
}

type UnifiedSubscription = {
  id: string;
  user_id: string;
  email?: string;
  product_name: string;
  plan_name: string;
  status: string;
  subscription_type: 'senvia_assistant' | 'general';
  billing_cycle: string;
  currency?: string;
  next_billing_date?: string;
  cancelled_at?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  created_at: string;
  updated_at: string;
  trial_start_date?: string;
  trial_end_date?: string;
  monthly_price?: number;
  product_plans?: {
    name: string;
    price_monthly?: number;
  };
};

const AdminSubscriptions = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubscription, setSelectedSubscription] = useState<UnifiedSubscription | null>(null);

  // Buscar assinaturas do Senvia Assistant
  const { data: subscriptions, refetch, isLoading } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('senvia_assistant_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Buscar assinaturas dos produtos gerais
  const { data: customerSubscriptions } = useQuery({
    queryKey: ['admin-customer-subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_subscriptions')
        .select(`
          *,
          products:product_id(*),
          product_plans:plan_id(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Combinar todas as assinaturas
  const allSubscriptions: UnifiedSubscription[] = [
    ...(subscriptions?.map(sub => ({
      ...sub,
      subscription_type: 'senvia_assistant' as const,
      product_name: 'Senvia Assistant',
      plan_name: sub.plan_type
    })) || []),
    ...(customerSubscriptions?.map(sub => ({
      ...sub,
      subscription_type: 'general' as const,
      product_name: sub.products?.name || 'Produto Desconhecido',
      plan_name: sub.product_plans?.name || 'Plano Desconhecido'
    })) || [])
  ];

  // Filtrar assinaturas
  const filteredSubscriptions = allSubscriptions.filter(subscription => {
    const searchableEmail = subscription.subscription_type === 'senvia_assistant' ? subscription.email : '';
    const matchesSearch = 
      searchableEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.user_id?.includes(searchTerm) ||
      subscription.product_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || subscription.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calcular estatísticas
  const stats = {
    total: allSubscriptions.length,
    active: allSubscriptions.filter(s => s.status === 'active').length,
    trial: allSubscriptions.filter(s => s.status === 'trial').length,
    cancelled: allSubscriptions.filter(s => s.status === 'cancelled').length,
    expired: allSubscriptions.filter(s => s.status === 'expired').length,
    monthlyRevenue: allSubscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => {
        if (s.subscription_type === 'senvia_assistant') {
          return sum + (s.monthly_price || 20);
        }
        return sum + (s.product_plans?.price_monthly || 0);
      }, 0)
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'active': 'Ativo',
      'trial': 'Período de Teste',
      'cancelled': 'Cancelado',
      'expired': 'Expirado',
      'suspended': 'Suspenso'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'active': 'bg-green-500',
      'trial': 'bg-blue-500',
      'cancelled': 'bg-red-500',
      'expired': 'bg-gray-500',
      'suspended': 'bg-yellow-500'
    };
    return colorMap[status] || 'bg-gray-500';
  };

  const getStatusIcon = (status: string) => {
    const iconMap: { [key: string]: any } = {
      'active': CheckCircle,
      'trial': Clock,
      'cancelled': AlertTriangle,
      'expired': AlertTriangle,
      'suspended': AlertTriangle
    };
    const Icon = iconMap[status] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  const getDaysRemaining = (subscription: UnifiedSubscription) => {
    if (subscription.subscription_type === 'senvia_assistant' && subscription.trial_end_date) {
      const trialEnd = new Date(subscription.trial_end_date);
      const today = new Date();
      const diffTime = trialEnd.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return null;
  };

  const getSubscriptionPrice = (subscription: UnifiedSubscription) => {
    if (subscription.subscription_type === 'senvia_assistant') {
      return subscription.monthly_price || 20;
    }
    return subscription.product_plans?.price_monthly || 0;
  };

  const getSubscriptionEmail = (subscription: UnifiedSubscription) => {
    if (subscription.subscription_type === 'senvia_assistant') {
      return subscription.email || 'Email não disponível';
    }
    return subscription.user_id?.slice(0, 8) + '...';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gestão de Assinaturas</h1>
        </div>
        <div className="text-center py-8 text-gray-400">
          Carregando assinaturas...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestão de Assinaturas</h1>
          <p className="text-gray-400">Monitore todas as assinaturas da SENVIA</p>
        </div>
      </div>

      {/* Stats Dashboard */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total de Assinaturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Assinaturas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold">{stats.active}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Em Período de Teste</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold">{stats.trial}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Canceladas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-2xl font-bold">{stats.cancelled}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Euro className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold">€{stats.monthlyRevenue.toFixed(2)}</span>
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
                placeholder="Buscar por email, ID do usuário ou produto..."
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
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="trial">Período de Teste</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
                <SelectItem value="expired">Expirado</SelectItem>
                <SelectItem value="suspended">Suspenso</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Cliente</TableHead>
                  <TableHead className="text-gray-300">Produto</TableHead>
                  <TableHead className="text-gray-300">Plano</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Valor</TableHead>
                  <TableHead className="text-gray-300">Próxima Cobrança</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((subscription) => {
                  const daysRemaining = getDaysRemaining(subscription);
                  const subscriptionPrice = getSubscriptionPrice(subscription);
                  const subscriptionEmail = getSubscriptionEmail(subscription);
                  
                  return (
                    <TableRow key={`${subscription.subscription_type}-${subscription.id}`} className="border-gray-700">
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{subscriptionEmail}</div>
                          <div className="text-xs text-gray-400 font-mono">
                            {subscription.user_id?.slice(0, 8)}...
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="font-medium text-white">{subscription.product_name}</div>
                        <div className="text-xs text-gray-400">
                          {subscription.subscription_type === 'senvia_assistant' ? 'Assistente de IA' : 'Produto Geral'}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="outline" className="border-blue-500 text-blue-500">
                          {subscription.plan_name}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(subscription.status)}`}></div>
                          <span className="text-sm text-gray-300">{getStatusLabel(subscription.status)}</span>
                        </div>
                        {daysRemaining !== null && subscription.status === 'trial' && (
                          <div className="text-xs text-blue-400">
                            {daysRemaining} dias restantes
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <div className="font-bold text-green-500">
                          €{subscriptionPrice.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">
                          /{subscription.billing_cycle || 'mês'}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm text-gray-300">
                          {subscription.next_billing_date 
                            ? format(new Date(subscription.next_billing_date), 'dd/MM/yyyy', { locale: ptBR })
                            : '-'
                          }
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedSubscription(subscription)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">Detalhes da Assinatura</DialogTitle>
                            </DialogHeader>
                            
                            {selectedSubscription && (
                              <div className="space-y-6">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-300">Cliente</label>
                                    <p className="text-sm text-gray-400">{getSubscriptionEmail(selectedSubscription)}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-300">Produto</label>
                                    <p className="text-sm text-gray-400">{selectedSubscription.product_name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-300">Plano</label>
                                    <p className="text-sm text-gray-400">{selectedSubscription.plan_name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-300">Status</label>
                                    <div className="flex items-center gap-2">
                                      {getStatusIcon(selectedSubscription.status)}
                                      <span className="text-sm text-gray-400">
                                        {getStatusLabel(selectedSubscription.status)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Billing Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-300">Valor Mensal</label>
                                    <p className="text-sm text-gray-400">
                                      €{getSubscriptionPrice(selectedSubscription).toFixed(2)}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-300">Ciclo de Cobrança</label>
                                    <p className="text-sm text-gray-400 capitalize">
                                      {selectedSubscription.billing_cycle || 'Mensal'}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-300">Próxima Cobrança</label>
                                    <p className="text-sm text-gray-400">
                                      {selectedSubscription.next_billing_date 
                                        ? format(new Date(selectedSubscription.next_billing_date), 'dd/MM/yyyy', { locale: ptBR })
                                        : 'Não agendada'
                                      }
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-300">Moeda</label>
                                    <p className="text-sm text-gray-400 uppercase">
                                      {selectedSubscription.currency || 'EUR'}
                                    </p>
                                  </div>
                                </div>

                                {/* Trial Info for Senvia Assistant */}
                                {selectedSubscription.subscription_type === 'senvia_assistant' && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Início do Teste</label>
                                      <p className="text-sm text-gray-400">
                                        {selectedSubscription.trial_start_date 
                                          ? format(new Date(selectedSubscription.trial_start_date), 'dd/MM/yyyy', { locale: ptBR })
                                          : 'Não aplicável'
                                        }
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Fim do Teste</label>
                                      <p className="text-sm text-gray-400">
                                        {selectedSubscription.trial_end_date 
                                          ? format(new Date(selectedSubscription.trial_end_date), 'dd/MM/yyyy', { locale: ptBR })
                                          : 'Não aplicável'
                                        }
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Stripe Info */}
                                {(selectedSubscription.stripe_subscription_id || selectedSubscription.stripe_customer_id) && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedSubscription.stripe_subscription_id && (
                                      <div>
                                        <label className="text-sm font-medium text-gray-300">ID Stripe Subscription</label>
                                        <p className="text-sm text-gray-400 font-mono">
                                          {selectedSubscription.stripe_subscription_id}
                                        </p>
                                      </div>
                                    )}
                                    {selectedSubscription.stripe_customer_id && (
                                      <div>
                                        <label className="text-sm font-medium text-gray-300">ID Stripe Customer</label>
                                        <p className="text-sm text-gray-400 font-mono">
                                          {selectedSubscription.stripe_customer_id}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Dates */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                                  <div>
                                    <label className="text-sm font-medium text-gray-300">Data de Criação</label>
                                    <p className="text-sm text-gray-400">
                                      {format(new Date(selectedSubscription.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-300">Última Atualização</label>
                                    <p className="text-sm text-gray-400">
                                      {format(new Date(selectedSubscription.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredSubscriptions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">Nenhuma assinatura encontrada.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-senvia-500" />
              Performance de Assinaturas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="font-medium">Taxa de Retenção</div>
              <div className="font-bold text-green-500">
                {stats.total > 0 ? (((stats.active + stats.trial) / stats.total) * 100).toFixed(1) : 0}%
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="font-medium">Taxa de Cancelamento</div>
              <div className="font-bold text-red-500">
                {stats.total > 0 ? ((stats.cancelled / stats.total) * 100).toFixed(1) : 0}%
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="font-medium">Receita Média por Usuário</div>
              <div className="font-bold text-blue-500">
                €{stats.active > 0 ? (stats.monthlyRevenue / stats.active).toFixed(2) : '0.00'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-senvia-500" />
              Distribuição por Produto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="font-medium">Senvia Assistant</div>
              <div className="font-bold text-purple-500">
                {allSubscriptions.filter(s => s.subscription_type === 'senvia_assistant').length}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="font-medium">Outros Produtos</div>
              <div className="font-bold text-blue-500">
                {allSubscriptions.filter(s => s.subscription_type === 'general').length}
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-gray-700">
              <div className="font-medium">Total de Receita Mensal</div>
              <div className="font-bold text-green-500">
                €{stats.monthlyRevenue.toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSubscriptions;
