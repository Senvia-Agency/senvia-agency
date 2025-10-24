import { useState } from "react";
import { useCreateSale } from "@/hooks/useSales";
import { useToast } from "@/hooks/use-toast";

export const useCreateSaleForm = (onClose: () => void) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    service_name: '',
    service_description: '',
    total_value: '',
    due_date: '',
    is_paid: false,
    paid_amount: '',
    payment_method: '',
    notes: '',
    is_recurring: false,
    recurring_billing_day: '5'
  });

  const { toast } = useToast();
  const createSaleMutation = useCreateSale();

  const resetForm = () => {
    setFormData({
      customer_id: '',
      service_name: '',
      service_description: '',
      total_value: '',
      due_date: '',
      is_paid: false,
      paid_amount: '',
      payment_method: '',
      notes: '',
      is_recurring: false,
      recurring_billing_day: '5'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Creating sale with data:', formData);
      
      // Calcular payment_status automaticamente
      const totalValue = Number(formData.total_value);
      const paidAmount = Number(formData.paid_amount) || 0;
      let paymentStatus: 'pending' | 'partial' | 'paid' = 'pending';
      
      if (paidAmount >= totalValue) {
        paymentStatus = 'paid';
      } else if (paidAmount > 0) {
        paymentStatus = 'partial';
      }
      
      // Calcular due_date baseado em is_recurring
      let dueDate: string | undefined;
      
      if (formData.is_recurring) {
        // Se for recorrente, calcular a próxima data baseado no billing_day
        const today = new Date();
        const billingDay = Number(formData.recurring_billing_day);
        const nextBillingDate = new Date(today.getFullYear(), today.getMonth(), billingDay);
        
        // Se o dia já passou neste mês, usar o próximo mês
        if (nextBillingDate < today) {
          nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        }
        
        dueDate = nextBillingDate.toISOString().split('T')[0];
      } else {
        // Se não for recorrente, usar a data de vencimento do form
        dueDate = formData.due_date;
      }
      
      await createSaleMutation.mutateAsync({
        customer_id: formData.customer_id === 'none' ? undefined : formData.customer_id || undefined,
        service_type: 'manual',
        service_name: formData.service_name,
        service_description: formData.service_description,
        total_value: totalValue,
        paid_amount: paidAmount,
        payment_method: formData.payment_method || undefined,
        sale_status: 'pending',
        payment_status: paymentStatus,
        notes: formData.notes,
        sale_date: new Date().toISOString(),
        commission_rate: 0,
        assigned_to: undefined,
        is_recurring: formData.is_recurring,
        recurring_billing_day: formData.is_recurring ? Number(formData.recurring_billing_day) : undefined,
        recurring_start_date: formData.is_recurring ? dueDate : undefined,
        due_date: dueDate,
      });
      
      toast({
        title: "Venda criada",
        description: "A venda foi criada com sucesso."
      });
      
      onClose();
      resetForm();
    } catch (error) {
      console.error('Erro ao criar venda:', error);
      toast({
        title: "Erro ao criar venda",
        description: "Não foi possível criar a venda. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return {
    formData,
    setFormData,
    handleSubmit,
    createSaleMutation
  };
};
