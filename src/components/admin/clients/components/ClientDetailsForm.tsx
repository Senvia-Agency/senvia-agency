
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ClientDetailsFormProps {
  client: any;
  onClose: () => void;
}

export const ClientDetailsForm = ({ client, onClose }: ClientDetailsFormProps) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    full_name: client.full_name || '',
    email: client.email || '',
    phone: client.phone || '',
    company_name: client.company_name || '',
    website: client.website || '',
    customer_status: client.customer_status || 'active',
    customer_tier: client.customer_tier || 'bronze',
    project_status: client.project_status || 'planning',
    objective: client.objective || '',
    main_product_service: client.main_product_service || ''
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
      const { error } = await supabase
        .from('customers')
        .update(formData)
        .eq('id', client.id);

      if (error) throw error;

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
          <Label htmlFor="objective">Objetivo Principal</Label>
          <Input
            id="objective"
            value={formData.objective}
            onChange={(e) => handleInputChange('objective', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Ex: Aumentar vendas, captar leads..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="main_product_service">Produto/Serviço Principal</Label>
          <Input
            id="main_product_service"
            value={formData.main_product_service}
            onChange={(e) => handleInputChange('main_product_service', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Ex: Consultoria, E-commerce, App..."
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

        <div className="space-y-2">
          <Label htmlFor="customer_tier">Nível do Cliente</Label>
          <Select value={formData.customer_tier} onValueChange={(value) => handleInputChange('customer_tier', value)}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="bronze">Bronze</SelectItem>
              <SelectItem value="silver">Prata</SelectItem>
              <SelectItem value="gold">Ouro</SelectItem>
              <SelectItem value="platinum">Platina</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="project_status">Status do Projeto</Label>
          <Select value={formData.project_status} onValueChange={(value) => handleInputChange('project_status', value)}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="planning">Planejamento</SelectItem>
              <SelectItem value="in_progress">Em Progresso</SelectItem>
              <SelectItem value="review">Em Revisão</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="on_hold">Em Espera</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
