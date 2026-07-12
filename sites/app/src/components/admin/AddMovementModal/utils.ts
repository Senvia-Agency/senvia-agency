
import { format } from "date-fns";

export interface MovementFormData {
  movement_type: 'receita' | 'despesa';
  amount: string;
  description: string;
  category: string;
  movement_date: string;
  customer_id: string;
  notes: string;
}

export const getInitialFormData = (): MovementFormData => ({
  movement_type: 'despesa',
  amount: '',
  description: '',
  category: '',
  movement_date: format(new Date(), 'yyyy-MM-dd'),
  customer_id: '',
  notes: ''
});

export const validateForm = (movement: MovementFormData): boolean => {
  return !!(movement.amount && movement.description && movement.category);
};

export const formatMovementForSubmission = (movement: MovementFormData) => ({
  ...movement,
  amount: parseFloat(movement.amount),
  customer_id: movement.customer_id && movement.customer_id !== 'none' && movement.customer_id.trim() !== '' ? movement.customer_id : null
});
