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
  const {
    formData,
    setFormData,
    handleSubmit,
    createSaleMutation
  } = useCreateSaleForm(onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Nova Venda</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* CONDICIONAL: Se for recorrente, mostrar Dia de Vencimento */}
              {formData.is_recurring && (
                <div>
                  <Label className="text-gray-300">
                    Dia de Vencimento Mensal (1-28) *
                  </Label>
                  {!formData.customer_id || formData.customer_id === 'none' ? (
                    <div className="flex items-center h-10 px-3 bg-gray-700/50 border border-amber-500/50 rounded-md">
                      <span className="text-sm text-amber-400">
                        ⚠️ Selecione um cliente primeiro
                      </span>
                    </div>
                  ) : (
                    <>
                      <Input
                        type="number"
                        min="1"
                        max="28"
                        value={formData.recurring_billing_day}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          recurring_billing_day: e.target.value 
                        }))}
                        placeholder="5"
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        💡 Cobranças geradas automaticamente todo dia {formData.recurring_billing_day || '5'} do mês
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
                    setFormData(prev => ({ 
                      ...prev, 
                      is_recurring: isChecked,
                      recurring_billing_day: isChecked ? prev.recurring_billing_day : '5',
                      due_date: isChecked ? '' : prev.due_date
                    }))
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
            >
              {createSaleMutation.isPending ? 'Criando...' : 'Criar Venda'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSaleModal;
