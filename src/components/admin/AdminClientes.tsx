
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCustomers, useSyncConvertedLeads } from "@/hooks/useCustomers";
import { Edit, Search, Eye, Plus, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import EditClientModal from "./EditClientModal";
import { useToast } from "@/hooks/use-toast";

const AdminClientes = () => {
  const { data: customers, isLoading } = useCustomers();
  const syncConvertedLeads = useSyncConvertedLeads();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Sincronizar leads convertidos automaticamente ao carregar a página
  useEffect(() => {
    const syncLeads = async () => {
      try {
        await syncConvertedLeads.mutateAsync();
      } catch (error) {
        console.error('Erro na sincronização automática:', error);
      }
    };
    
    // Executar sincronização após 2 segundos para dar tempo das queries carregarem
    const timer = setTimeout(syncLeads, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSyncLeads = async () => {
    try {
      const results = await syncConvertedLeads.mutateAsync();
      const convertedCount = results?.filter(r => r.status === 'converted').length || 0;
      const alreadyExistsCount = results?.filter(r => r.status === 'already_exists').length || 0;
      
      if (convertedCount > 0 || alreadyExistsCount > 0) {
        toast({
          title: "Sincronização concluída",
          description: `${convertedCount} novos clientes criados, ${alreadyExistsCount} já existiam.`
        });
      } else {
        toast({
          title: "Sincronização concluída",
          description: "Nenhum lead novo para converter."
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro na sincronização",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const filteredClients = customers?.filter(client =>
    client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-yellow-500';
      case 'churned': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic': return 'bg-blue-500';
      case 'premium': return 'bg-purple-500';
      case 'enterprise': return 'bg-gold-500';
      default: return 'bg-gray-500';
    }
  };

  const handleEditClient = (client: any) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Gestão de Clientes</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-400">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Gestão de Clientes</h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleSyncLeads}
            disabled={syncConvertedLeads.isPending}
            className="border-senvia-500 text-senvia-400 hover:bg-senvia-500 hover:text-black"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncConvertedLeads.isPending ? 'animate-spin' : ''}`} />
            {syncConvertedLeads.isPending ? 'Sincronizando...' : 'Sincronizar Leads'}
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white w-64"
            />
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{customers?.length || 0}</div>
            <p className="text-gray-400 text-sm">Total de Clientes</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">
              {customers?.filter(c => c.customer_status === 'active').length || 0}
            </div>
            <p className="text-gray-400 text-sm">Clientes Ativos</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-senvia-500">
              €{customers?.reduce((sum, c) => sum + Number(c.total_spent || 0), 0).toFixed(2) || '0.00'}
            </div>
            <p className="text-gray-400 text-sm">Receita Total</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-400">
              €{customers?.length ? (customers.reduce((sum, c) => sum + Number(c.total_spent || 0), 0) / customers.length).toFixed(2) : '0.00'}
            </div>
            <p className="text-gray-400 text-sm">Valor Médio por Cliente</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Clientes */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Clientes ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClients.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Nenhum cliente encontrado</p>
              </div>
            ) : (
              filteredClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white">{client.full_name}</h3>
                      <Badge className={`${getStatusColor(client.customer_status)} text-white`}>
                        {client.customer_status}
                      </Badge>
                      <Badge className={`${getTierColor(client.customer_tier)} text-white`}>
                        {client.customer_tier}
                      </Badge>
                      {client.original_lead && (
                        <Badge variant="outline" className="border-senvia-500 text-senvia-400">
                          {client.acquisition_source === 'landing_page_basic' ? 'LP Básica' : 'LP Premium'}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-300">
                      <div>
                        <span className="text-gray-400">Email:</span> {client.email}
                      </div>
                      {client.company_name && (
                        <div>
                          <span className="text-gray-400">Empresa:</span> {client.company_name}
                        </div>
                      )}
                      <div>
                        <span className="text-gray-400">Cliente desde:</span> {format(new Date(client.acquisition_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                      <div>
                        <span className="text-gray-400">Total gasto:</span> €{Number(client.total_spent || 0).toFixed(2)}
                      </div>
                      {client.phone && (
                        <div>
                          <span className="text-gray-400">Telefone:</span> {client.phone}
                        </div>
                      )}
                      <div>
                        <span className="text-gray-400">Origem:</span> {client.acquisition_source}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClient(client)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <EditClientModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
      />
    </div>
  );
};

export default AdminClientes;
