
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "lucide-react";
import { useCreateSaleForm } from "./hooks/useCreateSaleForm";
import CustomerSearchField from "./form-fields/CustomerSearchField";
import ServiceSearchField from "./form-fields/ServiceSearchField";
import StatusFields from "./form-fields/StatusFields";
import ValueFields from "./form-fields/ValueFields";
import AdditionalFields from "./form-fields/AdditionalFields";
import AssigneeField from "./form-fields/AssigneeField";

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
    handleServiceTypeChange,
    handleServiceSelect,
    createSaleMutation
  } = useCreateSaleForm(onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Nova Venda</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomerSearchField
              value={formData.customer_id}
              onChange={(value) => setFormData(prev => ({ ...prev, customer_id: value }))}
              leadData={leadData}
            />

            <div className="space-y-2">
              <Label className="text-gray-300">Tipo de Serviço</Label>
              <Select value={formData.service_type} onValueChange={handleServiceTypeChange}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="custom_service">Serviço Personalizado</SelectItem>
                  <SelectItem value="stripe_product">Produto do Stripe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.service_type !== 'manual' && (
            <ServiceSearchField
              serviceType={formData.service_type}
              serviceId={formData.service_id}
              onServiceSelect={handleServiceSelect}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

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

          <ValueFields
            totalValue={formData.total_value}
            paidAmount={formData.paid_amount}
            paymentMethod={formData.payment_method}
            onTotalValueChange={(value) => setFormData(prev => ({ ...prev, total_value: value }))}
            onPaidAmountChange={(value) => setFormData(prev => ({ ...prev, paid_amount: value }))}
            onPaymentMethodChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
          />

          <StatusFields
            saleStatus={formData.sale_status}
            paymentStatus={formData.payment_status}
            onSaleStatusChange={(value: any) => setFormData(prev => ({ ...prev, sale_status: value }))}
            onPaymentStatusChange={(value: any) => setFormData(prev => ({ ...prev, payment_status: value }))}
          />

          <AdditionalFields
            notes={formData.notes}
            expectedDeliveryDate={formData.expected_delivery_date}
            onNotesChange={(value) => setFormData(prev => ({ ...prev, notes: value }))}
            onExpectedDeliveryDateChange={(value) => setFormData(prev => ({ ...prev, expected_delivery_date: value }))}
          />

          <AssigneeField
            value={formData.assigned_to}
            onChange={(value) => setFormData(prev => ({ ...prev, assigned_to: value }))}
          />

          {/* Configuração de Pagamento Recorrente */}
          <div className="space-y-4 pt-4 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_recurring"
                checked={formData.is_recurring}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, is_recurring: checked as boolean }))
                }
              />
              <Label htmlFor="is_recurring" className="text-gray-300 text-sm font-medium cursor-pointer">
                🔄 Este serviço é recorrente? (Gera cobranças mensais automáticas)
              </Label>
            </div>

            {formData.is_recurring && (
              <div className="space-y-4 pl-6 border-l-2 border-senvia-500/30 bg-senvia-500/5 p-4 rounded-r-lg">
                {!formData.customer_id || formData.customer_id === 'none' ? (
                  <p className="text-sm text-amber-400">
                    ⚠️ Selecione um cliente para configurar pagamento recorrente
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recurring_billing_day" className="text-gray-300">
                          Dia de Vencimento (1-28)
                        </Label>
                        <Input
                          id="recurring_billing_day"
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
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="recurring_start_date" className="text-gray-300">
                          <Calendar className="inline w-4 h-4 mr-1" />
                          Data de Início
                        </Label>
                        <Input
                          id="recurring_start_date"
                          type="date"
                          value={formData.recurring_start_date}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            recurring_start_date: e.target.value 
                          }))}
                          min={new Date().toISOString().split('T')[0]}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">
                      💡 O sistema gerará automaticamente as cobranças mensais todo dia {formData.recurring_billing_day} do mês
                    </p>
                  </>
                )}
              </div>
            )}
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
