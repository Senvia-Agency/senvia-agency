
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useConvertLeadToCustomer } from "@/hooks/useCustomers";

interface ConvertLeadModalProps {
  lead: any;
  isOpen: boolean;
  onClose: () => void;
  onConvert: () => void;
}

const ConvertLeadModal = ({ lead, isOpen, onClose, onConvert }: ConvertLeadModalProps) => {
  const { toast } = useToast();
  const convertMutation = useConvertLeadToCustomer();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    website: '',
    project_status: 'pending' as const,
    customer_tier: 'basic' as const,
    notes: ''
  });

  // Preencher automaticamente os dados do lead quando o modal abrir
  useEffect(() => {
    if (lead && isOpen) {
      setFormData({
        full_name: lead.full_name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company_name: lead.company_name || '',
        website: lead.website || '',
        project_status: 'pending',
        customer_tier: 'basic',
        notes: lead.notes || ''
      });
    }
  }, [lead, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lead) return;

    try {
      await convertMutation.mutateAsync(lead.id);
      
      toast({
        title: "Lead convertido com sucesso!",
        description: "O lead foi convertido para cliente e adicionado à base de dados."
      });
      
      onConvert();
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao converter lead",
        description: "Não foi possível converter o lead para cliente.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Converter Lead para Cliente</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-300">Nome Completo</Label>
              <Input
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-300">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-300">Telefone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-300">Empresa</Label>
              <Input
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-300">Website</Label>
              <Input
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-300">Status do Projeto</Label>
              <Select 
                value={formData.project_status} 
                onValueChange={(value) => handleInputChange('project_status', value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="in_progress">Em Progresso</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="on_hold">Em Pausa</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Categoria do Cliente */}
          <div>
            <Label className="text-sm font-medium text-gray-300">Categoria do Cliente</Label>
            <Select 
              value={formData.customer_tier} 
              onValueChange={(value) => handleInputChange('customer_tier', value)}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="basic">Básico</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notas */}
          <div>
            <Label className="text-sm font-medium text-gray-300">Notas</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white mt-1"
              rows={3}
              placeholder="Adicione notas sobre o cliente..."
            />
          </div>

          {/* Informações do Lead Original */}
          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Informações do Lead Original</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
              {lead.objective && (
                <div>
                  <span className="font-medium">Objetivo:</span>
                  <p className="mt-1">{lead.objective}</p>
                </div>
              )}
              {lead.main_product_service && (
                <div>
                  <span className="font-medium">Produto/Serviço:</span>
                  <p className="mt-1">{lead.main_product_service}</p>
                </div>
              )}
              {lead.target_audience && (
                <div>
                  <span className="font-medium">Público-Alvo:</span>
                  <p className="mt-1">{lead.target_audience}</p>
                </div>
              )}
              <div>
                <span className="font-medium">Origem:</span>
                <p className="mt-1">
                  {lead.source_page === 'landing_page_basic' ? 'Landing Page Básica' : 'Landing Page Premium'}
                </p>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-700">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={convertMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-senvia-500 hover:bg-senvia-400 text-black"
              disabled={convertMutation.isPending}
            >
              {convertMutation.isPending ? 'Convertendo...' : 'Converter para Cliente'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConvertLeadModal;
