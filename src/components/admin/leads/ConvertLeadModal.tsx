
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useConvertLeadToCustomer } from "@/hooks/useCustomers";
import { getInitialFormData } from "./utils/convertLeadUtils";
import BasicInfoFields from "./components/BasicInfoFields";
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
    customer_tier: 'basic' as const,
    conversion_value: 0,
    notes: ''
  });

  // Debug logs for modal state
  useEffect(() => {
    console.log('ConvertLeadModal: isOpen changed to:', isOpen);
    if (isOpen && lead) {
      console.log('ConvertLeadModal: Opening modal for lead:', lead.id);
    } else if (!isOpen) {
      console.log('ConvertLeadModal: Modal closed');
    }
  }, [isOpen, lead]);

  // Debug logs for component lifecycle
  useEffect(() => {
    console.log('ConvertLeadModal: Component mounted/updated');
    
    // Track visibility changes
    const handleVisibilityChange = () => {
      console.log('ConvertLeadModal: Visibility changed, document.hidden:', document.hidden, 'isOpen:', isOpen);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      console.log('ConvertLeadModal: Component will unmount');
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOpen]);

  // Preencher automaticamente os dados do lead quando o modal abrir
  useEffect(() => {
    if (lead && isOpen) {
      console.log('ConvertLeadModal: Setting initial form data for lead:', lead.id);
      setFormData(getInitialFormData(lead));
    }
  }, [lead, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lead) return;

    try {
      console.log('Enviando dados para conversão:', { leadId: lead.id, customerData: formData });
      
      await convertMutation.mutateAsync({
        leadId: lead.id,
        customerData: formData
      });
      
      toast({
        title: "Lead convertido com sucesso!",
        description: `Cliente criado com valor de €${formData.conversion_value.toFixed(2)} registrado.`
      });
      
      onConvert();
      onClose();
    } catch (error) {
      console.error('Erro detalhado na conversão:', error);
      toast({
        title: "Erro ao converter lead",
        description: "Não foi possível converter o lead para cliente.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    console.log('Alterando campo:', field, 'para:', value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClose = () => {
    console.log('ConvertLeadModal: handleClose called');
    onClose();
  };

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      console.log('ConvertLeadModal: Dialog onOpenChange called with:', open);
      if (!open) {
        handleClose();
      }
    }}>
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
              onClick={handleClose}
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
