
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useUpdateCustomService, CustomService } from "@/hooks/useCustomServices";

interface EditCustomServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: CustomService | null;
}

const EditCustomServiceModal = ({ isOpen, onClose, service }: EditCustomServiceModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: '',
    category: 'custom',
    service_type: 'one_time' as 'one_time' | 'recurring' | 'custom',
    pricing_model: 'fixed' as 'fixed' | 'hourly' | 'project',
    estimated_hours: '',
    includes_features: [] as string[],
    status: 'active' as 'active' | 'inactive'
  });

  const [newFeature, setNewFeature] = useState('');
  const updateServiceMutation = useUpdateCustomService();

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description || '',
        base_price: service.base_price.toString(),
        category: service.category,
        service_type: service.service_type,
        pricing_model: service.pricing_model,
        estimated_hours: service.estimated_hours?.toString() || '',
        includes_features: Array.isArray(service.includes_features) ? service.includes_features : [],
        status: service.status
      });
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service) return;
    
    try {
      await updateServiceMutation.mutateAsync({
        id: service.id,
        updates: {
          name: formData.name,
          description: formData.description,
          base_price: Number(formData.base_price),
          category: formData.category,
          service_type: formData.service_type,
          pricing_model: formData.pricing_model,
          estimated_hours: formData.estimated_hours ? Number(formData.estimated_hours) : undefined,
          includes_features: formData.includes_features,
          status: formData.status
        }
      });
      
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.includes_features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        includes_features: [...prev.includes_features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      includes_features: prev.includes_features.filter(f => f !== feature)
    }));
  };

  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Editar Serviço Personalizado</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <Label className="text-gray-300">Nome do Serviço *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Landing Page Premium, Website Corporativo"
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <Label className="text-gray-300">Descrição</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição detalhada do serviço"
              className="bg-gray-700 border-gray-600 text-white"
              rows={3}
            />
          </div>

          {/* Preço Base e Categoria */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Preço Base (€) *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.base_price}
                onChange={(e) => setFormData(prev => ({ ...prev, base_price: e.target.value }))}
                placeholder="0.00"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            
            <div>
              <Label className="text-gray-300">Categoria</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Personalizado</SelectItem>
                  <SelectItem value="landing_pages">Landing Pages</SelectItem>
                  <SelectItem value="websites">Websites</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tipo de Serviço e Modelo de Preço */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Tipo de Serviço</Label>
              <Select value={formData.service_type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, service_type: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_time">Único</SelectItem>
                  <SelectItem value="recurring">Recorrente</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-gray-300">Modelo de Preço</Label>
              <Select value={formData.pricing_model} onValueChange={(value: any) => setFormData(prev => ({ ...prev, pricing_model: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Preço Fixo</SelectItem>
                  <SelectItem value="hourly">Por Hora</SelectItem>
                  <SelectItem value="project">Por Projeto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Horas Estimadas (opcional) */}
          {formData.pricing_model === 'hourly' && (
            <div>
              <Label className="text-gray-300">Horas Estimadas</Label>
              <Input
                type="number"
                value={formData.estimated_hours}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_hours: e.target.value }))}
                placeholder="Ex: 40"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          )}

          {/* Funcionalidades Incluídas */}
          <div>
            <Label className="text-gray-300">Funcionalidades Incluídas</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Ex: Design responsivo, SEO básico"
                  className="bg-gray-700 border-gray-600 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button
                  type="button"
                  onClick={addFeature}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Adicionar
                </Button>
              </div>
              
              {formData.includes_features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.includes_features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="border-senvia-500 text-senvia-500">
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <Label className="text-gray-300">Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateServiceMutation.isPending}
              className="bg-senvia-500 hover:bg-senvia-400 text-black"
            >
              {updateServiceMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomServiceModal;
