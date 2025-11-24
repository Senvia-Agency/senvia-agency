import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateSaleForm } from "./hooks/useCreateSaleForm";
import CustomerSearchField from "./form-fields/CustomerSearchField";

interface CreateSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadData?: any;
}

const CreateSaleModal = ({ isOpen, onClose, leadData }: CreateSaleModalProps) => {
  console.log('🟢 [MODAL] CreateSaleModal renderizado - isOpen:', isOpen);
  
  const {
    formData,
    setFormData,
    handleSubmit,
    createSaleMutation
  } = useCreateSaleForm(onClose);

  console.log('🟢 [MODAL] Estado da mutação:', {
    isPending: createSaleMutation.isPending,
    isError: createSaleMutation.isError,
    isSuccess: createSaleMutation.isSuccess
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      console.log('🟡 [MODAL] Dialog onOpenChange chamado - novo estado:', open);
      onClose();
    }}>
      <DialogContent className="bg-gray-800 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Nova Venda</DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => {
          console.log('📝 [MODAL] Formulário submetido via onSubmit');
          handleSubmit(e);
        }} className="space-y-6">
          {/* Seção 1: Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomerSearchField
              value={formData.customer_id}
              onChange={(value) => setFormData(prev => ({ ...prev, customer_id: value }))}
              leadData={leadData}
            />

            <div>
              <Label className="text-gray-300">Nome do Serviço *</Label>
              <Input
                value={formData.service_name}
                onChange={(e) => setFormData(prev => ({ ...prev, service_name: e.target.value }))}
                placeholder="Nome do serviço"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
          </div>


          {/* Seção 2: Descrição */}
          <div>
            <Label className="text-gray-300">Descrição do Serviço</Label>
            <Textarea
              value={formData.service_description}
              onChange={(e) => setFormData(prev => ({ ...prev, service_description: e.target.value }))}
              placeholder="Descrição detalhada do serviço"
              className="bg-gray-700 border-gray-600 text-white"
              rows={3}
            />
          </div>

          {/* Seção 3: Valores e Pagamento */}
          <div className="space-y-4 p-4 border border-gray-700 rounded-lg bg-gray-800/50">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Valores e Pagamento</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Valor Total (€) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.total_value}
                  onChange={(e) => setFormData(prev => ({ ...prev, total_value: e.target.value }))}
                  placeholder="0.00"
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>

              {/* CONDICIONAL: Se NÃO for recorrente, mostrar Data de Vencimento */}
              {!formData.is_recurring && (
                <div>
                  <Label className="text-gray-300">Data de Vencimento *</Label>
                  <Input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
              )}

              {/* CONDICIONAL: Se for recorrente, mostrar Data da Primeira Cobrança */}
              {formData.is_recurring && (
                <div>
                  <Label className="text-gray-300">Data da Primeira Cobrança *</Label>
                  {!formData.customer_id || formData.customer_id === 'none' ? (
                    <div className="flex items-center h-10 px-3 bg-gray-700/50 border border-amber-500/50 rounded-md">
                      <span className="text-sm text-amber-400">
                        ⚠️ Selecione um cliente primeiro
                      </span>
                    </div>
                  ) : (
                    <>
                      <Input
                        type="date"
                        value={formData.recurring_start_date}
                        onChange={(e) => {
                          const selectedDate = e.target.value;
                          
                          // Validar formato da data
                          if (!selectedDate || !/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
                            console.warn('⚠️ Data inválida selecionada:', selectedDate);
                            return;
                          }
                          
                          const day = parseInt(selectedDate.split('-')[2], 10);
                          
                          console.log('📅 Data selecionada:', selectedDate, '- Dia extraído:', day);
                          
                          setFormData(prev => ({ 
                            ...prev, 
                            recurring_start_date: selectedDate,
                            recurring_billing_day: day.toString()
                          }));
                        }}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        💡 Primeira cobrança nesta data. Próximas cobranças todo dia {formData.recurring_billing_day || '-'}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Checkboxes lado a lado: "Pago" e "Serviço Recorrente" */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Checkbox "Pago" */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_paid"
                  checked={formData.is_paid}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      is_paid: checked as boolean,
                      paid_amount: checked ? prev.total_value : '',
                      payment_method: checked ? prev.payment_method : ''
                    }))
                  }
                />
                <Label htmlFor="is_paid" className="text-gray-300 text-sm font-medium cursor-pointer">
                  ✓ Pago
                </Label>
              </div>

              {/* Checkbox "Serviço Recorrente" */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_recurring"
                  checked={formData.is_recurring}
                  onCheckedChange={(checked) => {
                    const isChecked = checked as boolean;
                    console.log('🔄 [CHECKBOX] Alternando modo recorrente:', isChecked);
                    
                    setFormData(prev => {
                      console.log('📅 [CHECKBOX] Dados atuais:', {
                        due_date: prev.due_date,
                        recurring_start_date: prev.recurring_start_date
                      });
                      
                      let newData = { 
                        ...prev, 
                        is_recurring: isChecked
                      };
                      
                      // Se ATIVOU recorrente: copiar due_date → recurring_start_date
                      if (isChecked) {
                        if (prev.due_date) {
                          newData.recurring_start_date = prev.due_date;
                          const day = parseInt(prev.due_date.split('-')[2], 10);
                          newData.recurring_billing_day = day.toString();
                          console.log('✅ [CHECKBOX] Data copiada de due_date → recurring_start_date:', prev.due_date);
                        }
                        newData.due_date = '';
                      } 
                      // Se DESATIVOU recorrente: copiar recurring_start_date → due_date
                      else {
                        if (prev.recurring_start_date) {
                          newData.due_date = prev.recurring_start_date;
                          console.log('✅ [CHECKBOX] Data copiada de recurring_start_date → due_date:', prev.recurring_start_date);
                        }
                        newData.recurring_start_date = '';
                        newData.recurring_billing_day = '';
                      }
                      
                      console.log('📊 [CHECKBOX] Novo estado:', newData);
                      return newData;
                    });
                  }}
                />
                <Label htmlFor="is_recurring" className="text-gray-300 text-sm font-medium cursor-pointer">
                  🔄 Serviço Recorrente
                </Label>
              </div>
            </div>

            {/* Campos condicionais quando marcado como "Pago" */}
            {formData.is_paid && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-green-500/30 bg-green-500/5 p-4 rounded-r-lg">
                <div>
                  <Label className="text-gray-300">Valor Pago (€) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.paid_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, paid_amount: e.target.value }))}
                    placeholder="0.00"
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Método de Pagamento *</Label>
                  <Select 
                    value={formData.payment_method} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Selecionar método" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="mbway">MB Way</SelectItem>
                      <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                      <SelectItem value="card">Cartão</SelectItem>
                      <SelectItem value="cash">Dinheiro</SelectItem>
                      <SelectItem value="check">Cheque</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Seção 4: Observações */}
          <div>
            <Label className="text-gray-300">Observações</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Observações sobre a venda"
              className="bg-gray-700 border-gray-600 text-white"
              rows={3}
            />
          </div>

          <DialogFooter>
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
              disabled={createSaleMutation.isPending}
              className="bg-senvia-500 hover:bg-senvia-400 text-black"
              onClick={() => console.log('🔵 [MODAL] Botão "Criar Venda" clicado')}
            >
              {createSaleMutation.isPending ? '⏳ Criando...' : 'Criar Venda'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSaleModal;
