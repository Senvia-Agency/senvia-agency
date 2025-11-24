import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AccountReceivable } from "@/hooks/useAccountsReceivable";
import { UnifiedReceivable } from "@/hooks/useUnifiedReceivables";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Calculator, CheckCircle2, AlertCircle } from "lucide-react";

interface PaymentModalProps {
  account: AccountReceivable | UnifiedReceivable | null;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal = ({ account, isOpen, onClose }: PaymentModalProps) => {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [paymentDate, setPaymentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Helper para pegar o número de referência
  const getReferenceNumber = () => {
    if (!account) return '';
    return 'sale_number' in account ? account.sale_number : account.reference_number || '';
  };

  // Helper para pegar a data
  const getAccountDate = () => {
    if (!account) return new Date();
    return 'sale_date' in account ? new Date(account.sale_date) : new Date(account.due_date);
  };

  const handlePayment = async () => {
    if (!account || !paymentAmount || isLoading) return;

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "❌ Valor inválido",
        description: "Por favor, insira um valor válido para o pagamento.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const isFullyPaid = amount >= account.remaining_amount;
      const overpayment = Math.max(0, amount - account.remaining_amount);

      // Detectar se é uma receita prevista (ID começa com 'svc-')
      const isPredictedRecurring = account.id.startsWith('svc-');
      let actualReceivableId = account.id;

      // Se for receita prevista, criar o recurring_receivable primeiro
      if (isPredictedRecurring) {
        // Formato do ID: svc-{service_id}-{date}
        const parts = account.id.split('-');
        if (parts.length < 3) {
          throw new Error('ID de receita prevista inválido');
        }
        
        // Extrair service_id (UUID é formado por 5 partes separadas por hífen)
        const serviceId = parts.slice(1, 6).join('-'); // Reconstrói o UUID
        const dueDate = parts.slice(6).join('-'); // Pega a data

        console.log('Criando recurring_receivable para serviço:', serviceId, 'com vencimento:', dueDate);

        // Criar o recurring_receivable
        const { data: newReceivable, error: createError } = await supabase
          .from('recurring_receivables')
          .insert({
            recurring_service_id: serviceId,
            customer_id: account.customer_id,
            amount: account.total_value,
            due_date: dueDate,
            payment_status: 'pending'
          })
          .select()
          .single();

        if (createError) {
          console.error('Erro ao criar recurring_receivable:', createError);
          throw createError;
        }

        actualReceivableId = newReceivable.id;
        console.log('Recurring_receivable criado com sucesso:', actualReceivableId);

        // CORREÇÃO 1: Buscar o sale_id do recurring_service e atualizar a venda original
        const { data: recurringService, error: serviceError } = await supabase
          .from('recurring_services')
          .select('sale_id, billing_day')
          .eq('id', serviceId)
          .single();

        if (serviceError) {
          console.error('Erro ao buscar recurring_service:', serviceError);
          throw serviceError;
        }

        // Se existe venda vinculada, atualizar a venda original
        if (recurringService?.sale_id) {
          console.log('Atualizando venda original:', recurringService.sale_id);
          const { error: saleUpdateError } = await supabase
            .from('sales')
            .update({
              paid_amount: amount,
              payment_status: isFullyPaid ? 'paid' : 'partial',
              remaining_amount: Math.max(0, account.total_value - amount),
              updated_at: new Date().toISOString()
            })
            .eq('id', recurringService.sale_id);

          if (saleUpdateError) {
            console.error('Erro ao atualizar venda original:', saleUpdateError);
            throw saleUpdateError;
          }
        }

        // CORREÇÃO 3: Atualizar next_billing_date do recurring_service
        if (isFullyPaid) {
          const currentDueDate = new Date(dueDate);
          const nextMonth = new Date(currentDueDate);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          
          console.log('Atualizando next_billing_date para:', format(nextMonth, 'yyyy-MM-dd'));
          const { error: serviceUpdateError } = await supabase
            .from('recurring_services')
            .update({
              next_billing_date: format(nextMonth, 'yyyy-MM-dd')
            })
            .eq('id', serviceId);

          if (serviceUpdateError) {
            console.error('Erro ao atualizar next_billing_date:', serviceUpdateError);
            throw serviceUpdateError;
          }
        }
      }

      // Determinar o tipo de conta e atualizar adequadamente
      const isRecurringType = isPredictedRecurring || ('type' in account && account.type === 'recurring');
      
      if (isRecurringType) {
        // Atualizar recurring_receivable
        const { error: updateError } = await supabase
          .from('recurring_receivables')
          .update({
            paid_amount: amount,
            payment_status: isFullyPaid ? 'paid' : 'partial',
            paid_at: isFullyPaid ? new Date().toISOString() : null,
            payment_method: paymentMethod,
            notes: notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', actualReceivableId);

        if (updateError) throw updateError;

        // CORREÇÃO 2: Atualizar venda original para receivables existentes (não apenas previstos)
        if (!isPredictedRecurring) {
          console.log('Buscando sale_id para recurring_receivable:', actualReceivableId);
          
          const { data: receivableData, error: receivableError } = await supabase
            .from('recurring_receivables')
            .select(`
              recurring_service_id,
              recurring_services!inner(sale_id)
            `)
            .eq('id', actualReceivableId)
            .single();

          if (receivableError) {
            console.error('Erro ao buscar receivable data:', receivableError);
            throw receivableError;
          }

          const recurringServices = receivableData?.recurring_services as any;
          const saleId = recurringServices?.sale_id;
          
          if (saleId) {
            console.log('Atualizando venda original (receivable existente):', saleId);
            
            // Buscar valores atuais da venda
            const { data: currentSale, error: fetchSaleError } = await supabase
              .from('sales')
              .select('paid_amount, total_value')
              .eq('id', saleId)
              .single();

            if (fetchSaleError) {
              console.error('Erro ao buscar venda atual:', fetchSaleError);
              throw fetchSaleError;
            }

            const newPaidAmount = (currentSale?.paid_amount || 0) + amount;
            const totalValue = currentSale?.total_value || 0;
            const newRemainingAmount = Math.max(0, totalValue - newPaidAmount);
            const newPaymentStatus = newPaidAmount >= totalValue ? 'paid' : 'partial';

            console.log('Valores da venda:', {
              paid_before: currentSale?.paid_amount,
              payment: amount,
              new_paid: newPaidAmount,
              total: totalValue,
              remaining: newRemainingAmount,
              status: newPaymentStatus
            });

            const { error: saleUpdateError } = await supabase
              .from('sales')
              .update({
                paid_amount: newPaidAmount,
                remaining_amount: newRemainingAmount,
                payment_status: newPaymentStatus,
                updated_at: new Date().toISOString()
              })
              .eq('id', saleId);

            if (saleUpdateError) {
              console.error('❌ ERRO CRÍTICO ao atualizar venda:', saleUpdateError);
              toast({
                title: "⚠️ Aviso",
                description: "Pagamento registrado, mas houve erro ao atualizar a venda. Atualize a página.",
                variant: "destructive"
              });
            } else {
              console.log('✅ Venda original atualizada com sucesso');
            }
          } else {
            console.log('⚠️ Nenhuma venda vinculada a este receivable');
          }
        }
      } else {
        // Atualizar venda
        const newPaidAmount = account.paid_amount + amount;
        const { error: updateError } = await supabase
          .from('sales')
          .update({
            paid_amount: newPaidAmount,
            payment_status: isFullyPaid ? 'paid' : 'partial',
            updated_at: new Date().toISOString()
          })
          .eq('id', account.id);

        if (updateError) throw updateError;
      }

      // 2. Criar movimento financeiro (receita)
      // CORREÇÃO 2: Buscar o sale_number real se for receita prevista
      let referenceNumber = getReferenceNumber();
      if (isPredictedRecurring) {
        const parts = account.id.split('-');
        const serviceId = parts.slice(1, 6).join('-');
        
        const { data: recurringService } = await supabase
          .from('recurring_services')
          .select('sale_id')
          .eq('id', serviceId)
          .single();

        if (recurringService?.sale_id) {
          const { data: saleData } = await supabase
            .from('sales')
            .select('sale_number')
            .eq('id', recurringService.sale_id)
            .single();
          
          if (saleData) {
            referenceNumber = saleData.sale_number;
            console.log('Usando sale_number real:', referenceNumber);
          }
        }
      }
      
      const newRemainingAmount = account.total_value - amount;
      const movementDescription = overpayment > 0 
        ? `Recebimento ${isFullyPaid ? 'total' : 'parcial'} ${referenceNumber ? `da venda ${referenceNumber}` : ''} + gorjeta de €${overpayment.toFixed(2)} - ${account.service_name}`
        : `Recebimento ${isFullyPaid ? 'total' : 'parcial'} ${referenceNumber ? `da venda ${referenceNumber}` : ''} - ${account.service_name}`;
        
      const { error: movementError } = await supabase
        .from('financial_movements')
        .insert({
          movement_type: 'receita',
          category: 'vendas',
          description: movementDescription,
          amount,
          currency: 'EUR',
          customer_id: account.customer_id,
          movement_date: paymentDate,
          notes: notes || `Pagamento ${isFullyPaid ? 'total' : 'parcial'} ${referenceNumber ? `da venda ${referenceNumber}` : ''}. Cliente: ${account.customer_name}. Método: ${paymentMethod}${overpayment > 0 ? `. Gorjeta: €${overpayment.toFixed(2)}` : ''}`
        });

      if (movementError) throw movementError;

      // 3. Registrar no histórico de atividades
      const activityTitle = overpayment > 0 
        ? `Pagamento ${isFullyPaid ? 'Total' : 'Parcial'} + Gorjeta Recebido`
        : `Pagamento ${isFullyPaid ? 'Total' : 'Parcial'} Recebido`;
        
      const activityDescription = overpayment > 0
        ? `Pagamento de €${amount.toFixed(2)} recebido de ${account.customer_name} (inclui gorjeta de €${overpayment.toFixed(2)})`
        : `Pagamento de €${amount.toFixed(2)} recebido de ${account.customer_name}`;
        
      const { error: activityError } = await supabase
        .from('activity_history')
        .insert({
          entity_type: 'customer',
          entity_id: account.customer_id || account.id,
          activity_type: 'payment_update',
          title: activityTitle,
          description: activityDescription,
          metadata: {
            payment_amount: amount,
            overpayment: overpayment,
            payment_method: paymentMethod,
            remaining_amount: Math.max(0, newRemainingAmount),
            is_fully_paid: isFullyPaid,
            notes
          }
        });

      if (activityError) throw activityError;

      // 4. Invalidar queries para atualizar os dados
      queryClient.invalidateQueries({ queryKey: ['accounts-receivable'] });
      queryClient.invalidateQueries({ queryKey: ['unified-receivables'] });
      queryClient.invalidateQueries({ queryKey: ['financial-movements'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['recurring-services'] });
      queryClient.invalidateQueries({ queryKey: ['recurring-receivables'] });
      queryClient.invalidateQueries({ queryKey: ['admin-revenue-metrics'] });

      toast({
        title: isFullyPaid ? "✅ Conta liquidada!" : "✅ Pagamento parcial registrado",
        description: overpayment > 0
          ? `${referenceNumber ? `Venda ${referenceNumber}` : 'Conta'} ${isFullyPaid ? 'totalmente paga' : 'parcialmente paga'} + gorjeta de €${overpayment.toFixed(2)}. Receita total: €${amount.toFixed(2)}`
          : isFullyPaid 
            ? `${referenceNumber ? `Venda ${referenceNumber}` : 'Conta'} totalmente paga. Receita de €${amount.toFixed(2)} adicionada.`
            : `Pagamento de €${amount.toFixed(2)} registrado. Restante: €${Math.max(0, newRemainingAmount).toFixed(2)}`,
      });

      // Reset form and close
      setPaymentAmount("");
      setPaymentMethod("bank_transfer");
      setPaymentDate(format(new Date(), 'yyyy-MM-dd'));
      setNotes("");
      onClose();

    } catch (error: any) {
      console.error('Erro ao registrar pagamento:', error);
      toast({
        title: "❌ Erro ao registrar pagamento",
        description: error.message || "Não foi possível registrar o pagamento.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateRemaining = () => {
    if (!account || !paymentAmount) return account?.remaining_amount || 0;
    const amount = parseFloat(paymentAmount) || 0;
    return Math.max(0, account.remaining_amount - amount);
  };

  const calculateOverpayment = () => {
    if (!account || !paymentAmount) return 0;
    const amount = parseFloat(paymentAmount) || 0;
    return Math.max(0, amount - account.remaining_amount);
  };

  const isFullPayment = () => {
    if (!account || !paymentAmount) return false;
    const amount = parseFloat(paymentAmount) || 0;
    return amount >= account.remaining_amount;
  };

  const isOverpayment = () => {
    if (!account || !paymentAmount) return false;
    const amount = parseFloat(paymentAmount) || 0;
    return amount > account.remaining_amount;
  };

  if (!account) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Calculator className="h-5 w-5 text-senvia-500" />
            Registrar Pagamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações da Conta */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="font-medium text-white mb-2">{account.customer_name}</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
              {getReferenceNumber() && (
                <div>
                  <span className="text-gray-400">Ref: </span>
                  <span>{getReferenceNumber()}</span>
                </div>
              )}
              <div>
                <span className="text-gray-400">Data: </span>
                <span>{format(getAccountDate(), 'dd/MM/yyyy', { locale: ptBR })}</span>
              </div>
              <div>
                <span className="text-gray-400">Valor Total: </span>
                <span className="font-medium">€{account.total_value.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-400">Já Pago: </span>
                <span className="text-green-400">€{account.paid_amount.toFixed(2)}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400">Valor Pendente: </span>
                <span className="font-medium text-yellow-400">€{account.remaining_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Valor do Pagamento */}
          <div className="space-y-2">
            <Label htmlFor="payment-amount" className="text-gray-300">
              Valor do Pagamento (€)
            </Label>
            <div className="relative">
              <Input
                id="payment-amount"
              type="number"
              step="0.01"
              min="0"
              value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="0.00"
                className="bg-gray-700 border-gray-600 text-white pl-8"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">€</span>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPaymentAmount(account.remaining_amount.toString())}
                className="border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                Valor Total
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPaymentAmount((account.remaining_amount / 2).toFixed(2))}
                className="border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                50%
              </Button>
            </div>
              </div>

              {/* Data do Pagamento */}
              <div className="space-y-2">
                <Label htmlFor="payment-date" className="text-gray-300">
                  Data do Pagamento
                </Label>
                <Input
                  id="payment-date"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  max={format(new Date(), 'yyyy-MM-dd')}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {/* Método de Pagamento */}
              <div className="space-y-2">
            <Label htmlFor="payment-method" className="text-gray-300">
              Método de Pagamento
            </Label>
            <select
              id="payment-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
            >
              <option value="bank_transfer">Transferência Bancária</option>
              <option value="mbway">MB WAY</option>
              <option value="multibanco">Multibanco</option>
              <option value="credit_card">Cartão de Crédito</option>
              <option value="debit_card">Cartão de Débito</option>
              <option value="cash">Dinheiro</option>
              <option value="paypal">PayPal</option>
              <option value="other">Outro</option>
            </select>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-300">
              Notas (opcional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações sobre o pagamento..."
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          {/* Resumo do Pagamento */}
          {paymentAmount && (
            <div className={`p-4 rounded-lg border-l-4 ${isOverpayment() ? 'bg-blue-900/20 border-blue-500' : 'bg-gray-700 border-senvia-500'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isFullPayment() ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
                <span className="font-medium text-white">
                  {isOverpayment() ? "Pagamento com Gorjeta" : isFullPayment() ? "Pagamento Total" : "Pagamento Parcial"}
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Valor a receber:</span>
                  <span className="text-white">€{paymentAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Restante após pagamento:</span>
                  <span className={calculateRemaining() > 0 ? "text-yellow-400" : "text-green-400"}>
                    €{calculateRemaining().toFixed(2)}
                  </span>
                </div>
                {isOverpayment() && (
                  <div className="flex justify-between border-t border-gray-600 pt-2 mt-2">
                    <span className="text-blue-400">Gorjeta/Prenda:</span>
                    <span className="text-blue-400 font-medium">€{calculateOverpayment().toFixed(2)}</span>
                  </div>
                )}
                {isFullPayment() && (
                  <div className="text-green-400 text-sm font-medium mt-2">
                    ✅ Esta conta será totalmente liquidada{isOverpayment() ? " (com gorjeta)" : ""}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-600"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handlePayment}
              disabled={!paymentAmount || isLoading || parseFloat(paymentAmount) <= 0}
              className="flex-1 bg-senvia-500 hover:bg-senvia-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Registrar Pagamento
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;