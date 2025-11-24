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
    recurring_billing_day: '',
    recurring_start_date: ''
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
      recurring_billing_day: '',
      recurring_start_date: ''
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
      
      // Validar data de início para recorrentes
      if (formData.is_recurring) {
        if (!formData.recurring_start_date) {
          console.log('❌ [VALIDATION] Data da primeira cobrança ausente');
          toast({
            title: "Erro de validação",
            description: "Data da primeira cobrança é obrigatória para serviços recorrentes.",
            variant: "destructive"
          });
          return;
        }
        
        const startDate = new Date(formData.recurring_start_date);
        const billingDay = startDate.getDate();
        
        if (billingDay > 28) {
          console.log('❌ [VALIDATION] Dia maior que 28:', billingDay);
          toast({
            title: "Erro de validação",
            description: "Para garantir recorrência em todos os meses, escolha uma data entre os dias 1 e 28.",
            variant: "destructive"
          });
          return;
        }
        console.log('✅ [VALIDATION] Data de início OK:', formData.recurring_start_date, '- Dia:', billingDay);
      }
      
      // Validar pagamento (não necessário para vendas recorrentes)
      if (formData.is_paid && !formData.is_recurring) {
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
      
      // Para vendas recorrentes, resetar dados de pagamento inicial
      if (formData.is_recurring) {
        console.log('🔄 [PAYMENT] Resetando dados de pagamento para venda recorrente');
      }
      
      console.log('✅ [VALIDATION] Todas as validações passaram!');
      
      // ===== CÁLCULOS =====
      
      // Calcular payment_status automaticamente
      const totalValue = Number(formData.total_value);
      const paidAmount = Number(formData.paid_amount) || 0;
      let paymentStatus: 'pending' | 'partial' | 'paid' | 'recurring' = 'pending';
      
      // Para vendas recorrentes, o status é sempre 'recurring'
      if (formData.is_recurring) {
        paymentStatus = 'recurring';
        console.log('💰 [PAYMENT] Status definido como "recurring" para venda recorrente');
      } else {
        // Para vendas normais, calcular baseado no pagamento
        if (paidAmount >= totalValue) {
          paymentStatus = 'paid';
        } else if (paidAmount > 0) {
          paymentStatus = 'partial';
        }
        console.log('💰 [PAYMENT] Status calculado:', paymentStatus, '(Pago:', paidAmount, '/ Total:', totalValue, ')');
      }
      
      // ===== CALCULAR DATA DE VENCIMENTO =====
      let dueDate: string;
      
      if (formData.is_recurring) {
        // Para vendas recorrentes, usar a data de início fornecida
        dueDate = formData.recurring_start_date;
        console.log('📅 [DATE] Data de vencimento recorrente:', dueDate);
      } else {
        dueDate = formData.due_date;
        console.log('📅 [DATE] Data de vencimento manual:', dueDate);
      }
      
      // ===== PREPARAR DADOS PARA ENVIO =====
      console.log('📦 [DATA] Preparando dados para envio...');
      
      // Extrair o dia da data de início para recorrentes
      const billingDay = formData.is_recurring && formData.recurring_start_date
        ? parseInt(formData.recurring_start_date.split('-')[2], 10)
        : undefined;

      // Validar billing day se for recorrente
      if (formData.is_recurring) {
        if (!billingDay || isNaN(billingDay) || billingDay < 1 || billingDay > 28) {
          console.error('❌ [ERROR] Billing day inválido:', billingDay);
          toast({
            title: "Erro ao processar data",
            description: "Não foi possível extrair o dia de cobrança da data selecionada.",
            variant: "destructive"
          });
          return;
        }
        console.log('✅ [VALIDATION] Billing day extraído:', billingDay);
      }
      
    const saleData = {
      customer_id: (!formData.customer_id || formData.customer_id === 'none' || formData.customer_id === '') 
        ? null 
        : formData.customer_id,
        sale_date: new Date().toISOString(),
        service_type: 'manual' as const,
        service_name: formData.service_name,
        service_description: formData.service_description || null,
        total_value: Number(formData.total_value),
        // Para vendas recorrentes, paid_amount sempre 0 inicialmente
        paid_amount: formData.is_recurring ? 0 : paidAmount,
        // ✅ remaining_amount é calculado automaticamente pelo DB: (total_value - paid_amount)
        payment_status: paymentStatus,
        // Para vendas recorrentes, payment_method é null inicialmente
        payment_method: formData.is_recurring ? null : (formData.payment_method || null),
        due_date: dueDate,
        notes: formData.notes || null,
        commission_rate: 0,
        is_recurring: formData.is_recurring,
        recurring_billing_day: billingDay || null,
        recurring_start_date: formData.is_recurring ? dueDate : null
      };
      
      console.log('📤 [API] Enviando dados para API:', saleData);
      console.log('🔍 [DEBUG] Tipos dos dados:', {
        customer_id: typeof saleData.customer_id,
        total_value: typeof saleData.total_value,
        recurring_billing_day: typeof saleData.recurring_billing_day,
        is_recurring: typeof saleData.is_recurring,
        due_date: typeof saleData.due_date,
        recurring_start_date: typeof saleData.recurring_start_date
      });
      
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
