import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: any;
  onUpdateSuccess: () => void;
}

const EditClientModal = ({ isOpen, onClose, client, onUpdateSuccess }: EditClientModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    website: '',
    customer_status: 'active',
    customer_tier: 'basic',
    project_status: 'pending',
    notes: '',
    // Novos campos
    tax_id: '', // NIF
    date_of_birth: '',
    address: {
      street: '',
      city: '',
      postal_code: '',
      country: 'Portugal'
    },
    additional_info: {
      profession: '',
      industry: '',
      company_size: '',
      annual_revenue: ''
    }
  });

  useEffect(() => {
    if (client) {
      setFormData({
        full_name: client.full_name || '',
        email: client.email || '',
        phone: client.phone || '',
        company_name: client.company_name || '',
        website: client.website || '',
        customer_status: client.customer_status || 'active',
        customer_tier: client.customer_tier || 'basic',
        project_status: client.project_status || 'pending',
        notes: client.notes || '',
        tax_id: client.address?.tax_id || '',
        date_of_birth: client.address?.date_of_birth || '',
        address: {
          street: client.address?.street || '',
          city: client.address?.city || '',
          postal_code: client.address?.postal_code || '',
          country: client.address?.country || 'Portugal'
        },
        additional_info: {
          profession: client.address?.profession || '',
          industry: client.address?.industry || '',
          company_size: client.address?.company_size || '',
          annual_revenue: client.address?.annual_revenue || ''
        }
      });
    }
  }, [client]);

  const handleSubmit = async () => {
    if (!client) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          company_name: formData.company_name,
          website: formData.website,
          customer_status: formData.customer_status,
          customer_tier: formData.customer_tier,
          project_status: formData.project_status,
          notes: formData.notes,
          address: {
            ...formData.address,
            tax_id: formData.tax_id,
            date_of_birth: formData.date_of_birth,
            profession: formData.additional_info.profession,
            industry: formData.additional_info.industry,
            company_size: formData.additional_info.company_size,
            annual_revenue: formData.additional_info.annual_revenue
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', client.id);

      if (error) throw error;

      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas com sucesso."
      });

      queryClient.invalidateQueries({ queryKey: ['customers'] });
      onUpdateSuccess();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar cliente",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500';
      case 'in_progress': return 'text-blue-500';
      case 'completed': return 'text-green-500';
      case 'on_hold': return 'text-orange-500';
      case 'cancelled': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getProjectStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Progresso';
      case 'completed': return 'Concluído';
      case 'on_hold': return 'Em Pausa';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconhecido';
    }
  };

  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Editar Cliente</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Nome Completo *</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label className="text-gray-300">Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label className="text-gray-300">Telefone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label className="text-gray-300">NIF</Label>
                <Input
                  value={formData.tax_id}
                  onChange={(e) => setFormData({...formData, tax_id: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                  placeholder="123456789"
                />
              </div>
              <div>
                <Label className="text-gray-300">Data de Nascimento</Label>
                <Input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Informações da Empresa */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Informações da Empresa</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Nome da Empresa</Label>
                <Input
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label className="text-gray-300">Website</Label>
                <Input
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label className="text-gray-300">Setor</Label>
                <Input
                  value={formData.additional_info.industry}
                  onChange={(e) => setFormData({
                    ...formData, 
                    additional_info: {...formData.additional_info, industry: e.target.value}
                  })}
                  className="bg-gray-700 border-gray-600"
                  placeholder="Tecnologia, Saúde, etc."
                />
              </div>
              <div>
                <Label className="text-gray-300">Tamanho da Empresa</Label>
                <Select 
                  value={formData.additional_info.company_size} 
                  onValueChange={(value) => setFormData({
                    ...formData, 
                    additional_info: {...formData.additional_info, company_size: value}
                  })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Selecionar tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 funcionários</SelectItem>
                    <SelectItem value="11-50">11-50 funcionários</SelectItem>
                    <SelectItem value="51-200">51-200 funcionários</SelectItem>
                    <SelectItem value="201-1000">201-1000 funcionários</SelectItem>
                    <SelectItem value="1000+">1000+ funcionários</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Endereço</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label className="text-gray-300">Rua</Label>
                <Input
                  value={formData.address.street}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: {...formData.address, street: e.target.value}
                  })}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label className="text-gray-300">Cidade</Label>
                <Input
                  value={formData.address.city}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: {...formData.address, city: e.target.value}
                  })}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label className="text-gray-300">Código Postal</Label>
                <Input
                  value={formData.address.postal_code}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: {...formData.address, postal_code: e.target.value}
                  })}
                  className="bg-gray-700 border-gray-600"
                  placeholder="1000-000"
                />
              </div>
            </div>
          </div>

          {/* Status do Cliente e Projeto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Status</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-gray-300">Status do Cliente</Label>
                <Select value={formData.customer_status} onValueChange={(value) => setFormData({...formData, customer_status: value})}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="churned">Perdido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Nível do Cliente</Label>
                <Select value={formData.customer_tier} onValueChange={(value) => setFormData({...formData, customer_tier: value})}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Básico</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Status do Projeto</Label>
                <Select value={formData.project_status} onValueChange={(value) => setFormData({...formData, project_status: value})}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        Pendente
                      </span>
                    </SelectItem>
                    <SelectItem value="in_progress">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Em Progresso
                      </span>
                    </SelectItem>
                    <SelectItem value="completed">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Concluído
                      </span>
                    </SelectItem>
                    <SelectItem value="on_hold">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        Em Pausa
                      </span>
                    </SelectItem>
                    <SelectItem value="cancelled">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        Cancelado
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notas */}
          <div>
            <Label className="text-gray-300">Notas</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="bg-gray-700 border-gray-600"
              rows={3}
              placeholder="Informações adicionais sobre o cliente..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} className="border-gray-600">
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="bg-senvia-500 hover:bg-senvia-400 text-black"
              disabled={isLoading || !formData.full_name || !formData.email}
            >
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientModal;
