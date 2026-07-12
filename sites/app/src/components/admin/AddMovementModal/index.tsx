
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCustomers } from "@/hooks/useCustomers";
import { getInitialFormData, validateForm, formatMovementForSubmission, MovementFormData } from "./utils";
import MovementTypeField from "./MovementTypeField";
import BasicInfoFields from "./BasicInfoFields";
import CategoryField from "./CategoryField";
import CustomerField from "./CustomerField";
import DateNotesFields from "./DateNotesFields";

interface AddMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (movement: any) => void;
  isLoading?: boolean;
}

const AddMovementModal = ({ isOpen, onClose, onSubmit, isLoading }: AddMovementModalProps) => {
  const { data: customers } = useCustomers();
  const [movement, setMovement] = useState<MovementFormData>(getInitialFormData());

  // Debug logs for modal state
  useEffect(() => {
    console.log('AddMovementModal: isOpen changed to:', isOpen);
  }, [isOpen]);

  // Debug logs for component lifecycle
  useEffect(() => {
    console.log('AddMovementModal: Component mounted/updated');
    
    // Track visibility changes
    const handleVisibilityChange = () => {
      console.log('AddMovementModal: Visibility changed, document.hidden:', document.hidden, 'isOpen:', isOpen);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      console.log('AddMovementModal: Component will unmount');
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOpen]);

  const handleSubmit = () => {
    if (!validateForm(movement)) {
      return;
    }

    onSubmit(formatMovementForSubmission(movement));

    // Reset form
    setMovement(getInitialFormData());
    onClose();
  };

  const handleClose = () => {
    console.log('AddMovementModal: handleClose called');
    onClose();
  };

  const handleMovementTypeChange = (value: 'receita' | 'despesa') => {
    setMovement({
      ...movement, 
      movement_type: value, 
      customer_id: value === 'despesa' ? '' : movement.customer_id
    });
  };

  const updateField = (field: keyof MovementFormData, value: string) => {
    setMovement(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      console.log('AddMovementModal: Dialog onOpenChange called with:', open);
      if (!open) {
        handleClose();
      }
    }}>
      <DialogContent className="bg-gray-800 border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Novo Movimento Financeiro</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <MovementTypeField
            value={movement.movement_type}
            onChange={handleMovementTypeChange}
          />

          <BasicInfoFields
            description={movement.description}
            amount={movement.amount}
            onDescriptionChange={(value) => updateField('description', value)}
            onAmountChange={(value) => updateField('amount', value)}
          />

          <CategoryField
            value={movement.category}
            movementType={movement.movement_type}
            onChange={(value) => updateField('category', value)}
          />

          {movement.movement_type === 'receita' && (
            <CustomerField
              value={movement.customer_id}
              customers={customers}
              onChange={(value) => updateField('customer_id', value)}
            />
          )}

          <DateNotesFields
            date={movement.movement_date}
            notes={movement.notes}
            onDateChange={(value) => updateField('movement_date', value)}
            onNotesChange={(value) => updateField('notes', value)}
          />

          <Button 
            onClick={handleSubmit} 
            className="w-full bg-senvia-500 hover:bg-senvia-400 text-black"
            disabled={isLoading || !validateForm(movement)}
          >
            {isLoading ? 'Adicionando...' : 'Adicionar Movimento'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMovementModal;
