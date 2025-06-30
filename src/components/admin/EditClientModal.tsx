import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUpdateCustomer } from "@/hooks/useCustomers";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ActivityHistorySection from "./shared/ActivityHistorySection";
import { useCreateActivity } from "@/hooks/useActivityHistory";
import CustomerProjectsSection from "./clients/CustomerProjectsSection";

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: any;
}

const EditClientModal = ({ isOpen, onClose, client }: EditClientModalProps) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    customer_status: 'active',
    customer_tier: 'basic',
    project_status: 'pending',
    notes: ''
  });

  const updateCustomer = useUpdateCustomer();
  const createActivity = useCreateActivity();

  useEffect(() => {
    if (client) {
      setFormData({
        full_name: client.full_name || '',
        email: client.email || '',
        phone: client.phone || '',
        company_name: client.company_name || '',
        customer_status: client.customer_status || 'active',
        customer_tier: client.customer_tier || 'basic',
        project_status: client.project_status || 'pending',
        notes: client.notes || ''
      });
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;

    try {
      // Verificar mudanças para histórico
      const statusChanged = formData.customer_status !== client.customer_status;
      const tierChanged = formData.customer_tier !== client.customer_tier;
      const projectStatusChanged = formData.project_status !== client.project_status;

      await updateCustomer.mutateAsync({
        customerId: client.id,
        updates: formData
      });

      // Gravar histórico automaticamente para mudanças importantes
      if (statusChanged) {
        await createActivity.mutateAsync({
          entity_type: 'customer',
          entity_id: client.id,
          activity_type: 'status_change',
          title: `Status do cliente alterado para ${formData.customer_status}`,
          description: `Status alterado de "${client.customer_status}" para "${formData.customer_status}"`,
          contact_person: 'Admin', // TODO: Usar nome do usuário logado
          contact_method: 'sistema'
        });
      }

      if (tierChanged) {
        await createActivity.mutateAsync({
          entity_type: 'customer',
          entity_id: client.id,
          activity_type: 'status_change',
          title: `Nível do cliente alterado para ${formData.customer_tier}`,
          description: `Nível alterado de "${client.customer_tier}" para "${formData.customer_tier}"`,
          contact_person: 'Admin', // TODO: Usar nome do usuário logado
          contact_method: 'sistema'
        });
      }

      if (projectStatusChanged) {
        await createActivity.mutateAsync({
          entity_type: 'customer',
          entity_id: client.id,
          activity_type: 'status_change',
          title: `Status do projeto alterado para ${formData.project_status}`,
          description: `Status do projeto alterado de "${client.project_status}" para "${formData.project_status}"`,
          contact_person: 'Admin', // TODO: Usar nome do usuário logado
          contact_method: 'sistema'
        });
      }

      onClose();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
    }
  };

  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-gray-800 border-gray-600 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Editar Cliente - {client.full_name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-700">
            <TabsTrigger value="details" className="data-[state=active]:bg-senvia-500">Detalhes</TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-senvia-500">Projetos</TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-senvia-500">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Informações básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Nome Completo</label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="bg-gray-700 border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-gray-700 border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Telefone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Empresa</label>
                  <Input
                    value={formData.company_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              {/* Status e Tier */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Status do Cliente</label>
                  <Select 
                    value={formData.customer_status} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, customer_status: value }))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="churned">Perdido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Nível do Cliente</label>
                  <Select 
                    value={formData.customer_tier} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, customer_tier: value }))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="basic">Básico</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Status do Projeto</label>
                  <Select 
                    value={formData.project_status} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, project_status: value }))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="in_progress">Em Progresso</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="on_hold">Em Pausa</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="text-sm font-medium text-gray-300">Notas</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="bg-gray-700 border-gray-600"
                  rows={4}
                  placeholder="Adicione observações sobre este cliente..."
                />
              </div>

              {/* Informações de cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Cliente desde</label>
                  <p className="text-sm text-gray-400 mt-1">
                    {format(new Date(client.acquisition_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Total gasto</label>
                  <p className="text-sm text-gray-400 mt-1">
                    €{Number(client.total_spent || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-gray-600"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={updateCustomer.isPending}
                  className="bg-senvia-500 hover:bg-senvia-600"
                >
                  {updateCustomer.isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <CustomerProjectsSection customerId={client.id} />
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <ActivityHistorySection 
              entityType="customer" 
              entityId={client.id} 
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientModal;
