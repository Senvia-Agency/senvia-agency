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
    
    console.log('🚀 [FORM] Iniciando submissão do formulário...');
    console.log('📋 [FORM] Dados do formulário:', formData);
    
    try {
      // ===== VALIDAÇÕES =====
      console.log('✅ [VALIDATION] Iniciando validações...');
      
      // Validar campos obrigatórios
      if (!formData.service_name.trim()) {
        console.log('❌ [VALIDATION] Nome do serviço está vazio');
        toast({
          title: "Erro de validação",
          description: "Nome do serviço é obrigatório.",
          variant: "destructive"
        });
        return;
      }
      console.log('✅ [VALIDATION] Nome do serviço OK:', formData.service_name);
      
      if (!formData.total_value || Number(formData.total_value) <= 0) {
        console.log('❌ [VALIDATION] Valor total inválido:', formData.total_value);
        toast({
          title: "Erro de validação",
          description: "Valor total deve ser maior que zero.",
          variant: "destructive"
        });
        return;
      }
      console.log('✅ [VALIDATION] Valor total OK:', formData.total_value);
      
      // Validar data de vencimento para vendas não recorrentes
      if (!formData.is_recurring && !formData.due_date) {
        console.log('❌ [VALIDATION] Data de vencimento ausente para venda não recorrente');
        toast({
          title: "Erro de validação",
          description: "Data de vencimento é obrigatória para vendas não recorrentes.",
          variant: "destructive"
        });
        return;
      }
      console.log('✅ [VALIDATION] Data de vencimento OK');
      
      // Validar cliente para vendas recorrentes
      if (formData.is_recurring && (!formData.customer_id || formData.customer_id === 'none')) {
        console.log('❌ [VALIDATION] Cliente ausente para venda recorrente');
        toast({
          title: "Erro de validação",
          description: "Cliente é obrigatório para serviços recorrentes.",
          variant: "destructive"
        });
        return;
      }
      console.log('✅ [VALIDATION] Validação de cliente OK');
      
      // Validar billing day para recorrentes
      if (formData.is_recurring) {
        const billingDay = Number(formData.recurring_billing_day);
        if (isNaN(billingDay) || billingDay < 1 || billingDay > 28) {
          console.log('❌ [VALIDATION] Dia de vencimento inválido:', billingDay);
          toast({
            title: "Erro de validação",
            description: "Dia de vencimento deve ser entre 1 e 28.",
            variant: "destructive"
          });
          return;
        }
        console.log('✅ [VALIDATION] Dia de vencimento OK:', billingDay);
      }
      
      // Validar pagamento
      if (formData.is_paid) {
        if (!formData.paid_amount || Number(formData.paid_amount) <= 0) {
          console.log('❌ [VALIDATION] Valor pago inválido:', formData.paid_amount);
          toast({
            title: "Erro de validação",
            description: "Valor pago é obrigatório quando marcado como pago.",
            variant: "destructive"
          });
          return;
        }
        
        if (!formData.payment_method) {
          console.log('❌ [VALIDATION] Método de pagamento ausente');
          toast({
            title: "Erro de validação",
            description: "Método de pagamento é obrigatório quando marcado como pago.",
            variant: "destructive"
          });
          return;
        }
        console.log('✅ [VALIDATION] Dados de pagamento OK');
      }
      
      console.log('✅ [VALIDATION] Todas as validações passaram!');
      
      // ===== CÁLCULOS =====
      
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
      let dueDate: string;
      
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
        console.log('📅 Data calculada para recorrente:', dueDate);
      } else {
        // Se não for recorrente, usar a data de vencimento do form
        dueDate = formData.due_date;
        console.log('📅 Data de vencimento fornecida:', dueDate);
      }
      
      // Preparar dados para envio
      const saleData = {
        customer_id: formData.customer_id === 'none' ? undefined : formData.customer_id || undefined,
        service_type: 'manual' as const,
        service_name: formData.service_name,
        service_description: formData.service_description || undefined,
        total_value: totalValue,
        paid_amount: paidAmount,
        payment_method: formData.payment_method || undefined,
        payment_status: paymentStatus,
        notes: formData.notes || undefined,
        sale_date: new Date().toISOString(),
        commission_rate: 0,
        assigned_to: undefined,
        is_recurring: formData.is_recurring,
        recurring_billing_day: formData.is_recurring ? Number(formData.recurring_billing_day) : undefined,
        recurring_start_date: formData.is_recurring ? dueDate : undefined,
        due_date: dueDate,
      };
      
      console.log('📤 [API] Enviando dados para API:', saleData);
      
      // Mostrar toast de processamento
      toast({
        title: "Processando...",
        description: "Criando venda no sistema...",
      });
      
      await createSaleMutation.mutateAsync(saleData);
      
      console.log('✅ [API] Venda criada com sucesso!');
      
      toast({
        title: "✅ Venda criada",
        description: "A venda foi criada com sucesso!"
      });
      
      console.log('🔄 [MODAL] Fechando modal e resetando formulário...');
      onClose();
      resetForm();
    } catch (error) {
      console.error('❌ [ERROR] Erro ao criar venda:', error);
      console.error('❌ [ERROR] Stack trace:', error instanceof Error ? error.stack : 'N/A');
      
      // Erro mais específico
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível criar a venda. Tente novamente.';
      
      console.error('❌ [ERROR] Mensagem de erro:', errorMessage);
      
      toast({
        title: "❌ Erro ao criar venda",
        description: errorMessage,
        variant: "destructive"
      });
      
      // NÃO fechar o modal em caso de erro para permitir correção
      console.log('⚠️ [MODAL] Modal permanece aberto para correção');
    }
  };

  return {
    formData,
    setFormData,
    handleSubmit,
    createSaleMutation
  };
};
