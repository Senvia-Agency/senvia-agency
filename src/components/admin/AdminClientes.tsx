import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCustomers } from "@/hooks/useCustomers";
import { Edit, Search, Eye, Plus, Target, Package } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import EditClientModal from "./EditClientModal";

const AdminClientes = () => {
  const { data: customers, isLoading } = useCustomers();
  
  // Recuperar termo de busca do localStorage ou usar valor padrão
  const [searchTerm, setSearchTerm] = useState(() => {
    const saved = localStorage.getItem('admin-clientes-search');
    return saved || "";
  });
  
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Salvar termo de busca no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('admin-clientes-search', searchTerm);
  }, [searchTerm]);

  // Listener para detectar quando a aba volta ao foco
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Quando a aba volta ao foco, recuperar termo de busca do localStorage
        const savedSearch = localStorage.getItem('admin-clientes-search');
        if (savedSearch !== null && savedSearch !== searchTerm) {
          setSearchTerm(savedSearch);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [searchTerm]);

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

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'in_progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'on_hold': return 'bg-orange-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getProjectStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Progresso';
      case 'completed': return 'Concluído';
      case 'on_hold': return 'Em Pausa';
      case 'cancelled': return 'Cancelado';
      default: return 'Não definido';
    }
  };

  const handleEditClient = (client: any) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-8 p-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Gestão de Clientes</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-400">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Gestão de Clientes</h1>
          <p className="text-gray-400 text-sm sm:text-base">Gerencie todos os clientes da SENVIA</p>
        </div>
        <div className="w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-3 md:p-4">
            <div className="text-lg md:text-2xl font-bold text-white">{customers?.length || 0}</div>
            <p className="text-gray-400 text-xs md:text-sm">Total de Clientes</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-3 md:p-4">
            <div className="text-lg md:text-2xl font-bold text-green-400">
              {customers?.filter(c => c.customer_status === 'active').length || 0}
            </div>
            <p className="text-gray-400 text-xs md:text-sm">Clientes Ativos</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-3 md:p-4">
            <div className="text-lg md:text-2xl font-bold text-senvia-500">
              €{customers?.reduce((sum, c) => sum + Number(c.total_spent || 0), 0).toFixed(2) || '0.00'}
            </div>
            <p className="text-gray-400 text-xs md:text-sm">Receita Total</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-3 md:p-4">
            <div className="text-lg md:text-2xl font-bold text-blue-400">
              €{customers?.length ? (customers.reduce((sum, c) => sum + Number(c.total_spent || 0), 0) / customers.length).toFixed(2) : '0.00'}
            </div>
            <p className="text-gray-400 text-xs md:text-sm">Valor Médio por Cliente</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Clientes */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-white text-lg md:text-xl">Clientes ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="space-y-3 md:space-y-4">
            {filteredClients.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Nenhum cliente encontrado</p>
              </div>
            ) : (
              filteredClients.map((client) => (
                <div key={client.id} className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-base truncate">{client.full_name}</h3>
                      <p className="text-gray-400 text-sm truncate">{client.email}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClient(client)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-600 ml-4"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver/Editar
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
