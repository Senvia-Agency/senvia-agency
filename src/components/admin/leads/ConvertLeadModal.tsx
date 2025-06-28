
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useConvertLeadToCustomer } from "@/hooks/useCustomers";
import { getInitialFormData } from "./utils/convertLeadUtils";
import BasicInfoFields from "./components/BasicInfoFields";
import ProjectStatusField from "./components/ProjectStatusField";
import CustomerTierValueFields from "./components/CustomerTierValueFields";
import NotesField from "./components/NotesField";
import OriginalLeadInfo from "./components/OriginalLeadInfo";

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
    conversion_value: 0,
    notes: ''
  });

  // Preencher automaticamente os dados do lead quando o modal abrir
  useEffect(() => {
    if (lead && isOpen) {
      setFormData(getInitialFormData(lead));
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

  const handleInputChange = (field: string, value: string | number) => {
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
          <BasicInfoFields
            formData={formData}
            onInputChange={handleInputChange}
          />

          {/* Status do Projeto */}
          <ProjectStatusField
            value={formData.project_status}
            onChange={(value) => handleInputChange('project_status', value)}
          />

          {/* Categoria e Valor */}
          <CustomerTierValueFields
            customerTier={formData.customer_tier}
            conversionValue={formData.conversion_value}
            onInputChange={handleInputChange}
          />

          {/* Notas */}
          <NotesField
            value={formData.notes}
            onChange={(value) => handleInputChange('notes', value)}
          />

          {/* Informações do Lead Original */}
          <OriginalLeadInfo lead={lead} />

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
