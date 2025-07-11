
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCreateActivity } from "@/hooks/useActivityHistory";

interface ClientDetailsFormProps {
  client: any;
  onClose: () => void;
}

export const ClientDetailsForm = ({ client, onClose }: ClientDetailsFormProps) => {
  const { toast } = useToast();
  const createActivity = useCreateActivity();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    full_name: client.full_name || '',
    email: client.email || '',
    phone: client.phone || '',
    company_name: client.company_name || '',
    website: client.website || '',
    customer_status: client.customer_status || 'active'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsUpdating(true);
    
    try {
      // Detectar mudanças nos dados
      const changes: string[] = [];
      
      if (formData.full_name !== client.full_name) changes.push(`Nome: ${client.full_name} → ${formData.full_name}`);
      if (formData.email !== client.email) changes.push(`Email: ${client.email} → ${formData.email}`);
      if (formData.phone !== client.phone) changes.push(`Telefone: ${client.phone || 'vazio'} → ${formData.phone || 'vazio'}`);
      if (formData.company_name !== client.company_name) changes.push(`Empresa: ${client.company_name || 'vazio'} → ${formData.company_name || 'vazio'}`);
      if (formData.website !== client.website) changes.push(`Website: ${client.website || 'vazio'} → ${formData.website || 'vazio'}`);
      if (formData.customer_status !== client.customer_status) changes.push(`Status: ${client.customer_status} → ${formData.customer_status}`);

      const { error } = await supabase
        .from('customers')
        .update(formData)
        .eq('id', client.id);

      if (error) throw error;

      // Criar atividade no histórico se houver mudanças
      if (changes.length > 0) {
        createActivity.mutate({
          entity_type: 'customer',
          entity_id: client.id,
          activity_type: 'status_change',
          title: 'Dados do cliente atualizados',
          description: `Alterações realizadas:\n${changes.join('\n')}`,
          contact_method: 'sistema'
        });
      }

      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas com sucesso."
      });

      onClose();
    } catch (error: any) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Expose handleSave to parent component
  useEffect(() => {
    // Store the save function in a way the parent can access it
    (window as any).saveClientDetails = handleSave;
    
    return () => {
      delete (window as any).saveClientDetails;
    };
  }, [handleSave]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Nome Completo</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_name">Empresa</Label>
          <Input
            id="company_name"
            value={formData.company_name}
            onChange={(e) => handleInputChange('company_name', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer_status">Status do Cliente</Label>
          <Select value={formData.customer_status} onValueChange={(value) => handleInputChange('customer_status', value)}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>
    </div>
  );
};
