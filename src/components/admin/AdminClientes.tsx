
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, Search, Plus, Eye, Edit, Mail, Phone, Calendar, User } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import EditClientModal from "./EditClientModal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AdminClientes = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: customers, isLoading, refetch } = useCustomers();

  const filteredCustomers = customers?.filter(customer => {
    const matchesSearch = 
      customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleEditCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleUpdateSuccess = () => {
    refetch();
    setIsEditModalOpen(false);
    setSelectedCustomer(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 lg:space-y-6 p-4 lg:p-6">
        <div className="text-center py-8 text-gray-400">
          Carregando clientes...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6 p-4 lg:p-6 w-full max-w-full overflow-x-hidden">
      {/* Header - Mobile Optimized */}
      <div className="space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl lg:text-3xl font-bold mb-1 lg:mb-2 truncate">Gestão de Clientes</h1>
          <p className="text-sm lg:text-base text-gray-400 truncate">Gerencie todos os clientes da SENVIA</p>
        </div>
        <div className="flex items-center justify-between lg:justify-end gap-2">
          <Badge 
            variant="outline" 
            className="text-blue-500 border-blue-500/50 bg-blue-500/10 text-xs lg:text-sm px-2 py-1 flex-shrink-0"
          >
            {filteredCustomers?.length || 0} clientes
          </Badge>
        </div>
      </div>

      {/* Filtros - Mobile Optimized */}
      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
        <CardContent className="p-3 lg:p-6">
          <div className="space-y-3 lg:space-y-4">
            {/* Search - Full Width */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600/50 text-white text-sm"
              />
            </div>
            
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800/95 border-slate-600/50 backdrop-blur-sm">
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <div className="space-y-3 lg:space-y-4">
        {filteredCustomers?.map((customer) => (
          <Card 
            key={customer.id}
            className="bg-slate-800/80 border-slate-600/50 hover:border-slate-500/50 transition-all cursor-pointer hover:bg-slate-750/80"
            onClick={() => handleEditCustomer(customer)}
          >
            <CardContent className="p-4 lg:p-6">
              {/* Mobile-First Layout */}
              <div className="space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4">
                {/* Main Info */}
                <div className="min-w-0 flex-1 space-y-2 lg:space-y-3">
                  {/* Name and Status */}
                  <div className="flex items-start gap-2 lg:gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white text-sm lg:text-lg truncate">
                        {customer.full_name || 'Nome não informado'}
                      </h3>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs flex-shrink-0 px-2 py-0.5 ${
                        customer.status === 'active' 
                          ? 'border-green-500/50 text-green-400 bg-green-500/10' 
                          : customer.status === 'inactive'
                          ? 'border-red-500/50 text-red-400 bg-red-500/10'
                          : 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'
                      }`}
                    >
                      {customer.status === 'active' ? 'Ativo' : customer.status === 'inactive' ? 'Inativo' : 'Pendente'}
                    </Badge>
                  </div>
                  
                  {/* Contact Info - Stack on Mobile */}
                  <div className="space-y-1 lg:space-y-0 lg:flex lg:items-center lg:gap-4 text-xs lg:text-sm text-slate-400">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
                      <span className="truncate">{customer.email || 'N/A'}</span>
                    </div>
                    
                    {customer.phone && (
                      <div className="flex items-center gap-2 min-w-0">
                        <Phone className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
                        <span className="truncate">{customer.phone}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
                      <span>{format(new Date(customer.created_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button - Right aligned on desktop */}
                <div className="flex justify-start lg:justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50 text-xs lg:text-sm px-3 py-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCustomer(customer);
                    }}
                  >
                    <Edit className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {(!filteredCustomers || filteredCustomers.length === 0) && (
        <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
          <CardContent className="text-center py-8 lg:py-12">
            <Users className="h-8 w-8 lg:h-12 lg:w-12 text-slate-500 mx-auto mb-3 lg:mb-4" />
            <h3 className="text-base lg:text-lg font-medium text-white mb-2">Nenhum cliente encontrado</h3>
            <p className="text-sm lg:text-base text-slate-400">Ajuste os filtros ou aguarde novos clientes.</p>
          </CardContent>
        </Card>
      )}

      {/* Modal de Edição */}
      <EditClientModal
        customer={selectedCustomer}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCustomer(null);
        }}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default AdminClientes;
