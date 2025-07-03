
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomers } from "@/hooks/useCustomers";
import { useCreateSaleForm } from "./hooks/useCreateSaleForm";
import ServiceSelectionField from "./form-fields/ServiceSelectionField";
import CustomerSelectField from "./form-fields/CustomerSelectField";
import StatusFields from "./form-fields/StatusFields";
import ValueFields from "./form-fields/ValueFields";
import AdditionalFields from "./form-fields/AdditionalFields";
import AssigneeField from "./form-fields/AssigneeField";
import { useCustomServices } from "@/hooks/useCustomServices";
import { useCreateRecurringService } from "@/hooks/useRecurringServices";

interface CreateSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateSaleModal = ({ isOpen, onClose }: CreateSaleModalProps) => {
  const [recurringData, setRecurringData] = useState({
    billing_day: '1',
    start_date: new Date().toISOString().split('T')[0]
  });

  const { data: customers } = useCustomers();
  const { data: customServices } = useCustomServices();
  const createRecurringService = useCreateRecurringService();
  
  const {
    formData,
    setFormData,
    handleSubmit: originalHandleSubmit,
    handleServiceTypeChange,
    handleServiceSelect,
    createSaleMutation
  } = useCreateSaleForm(onClose);

  // Verificar se o serviço selecionado é recorrente
  const selectedService = customServices?.find(s => s.id === formData.service_id);
  const isRecurringService = selectedService?.service_type === 'recurring';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Criar a venda primeiro
      const saleData = {
        customer_id: formData.customer_id === 'none' ? undefined : formData.customer_id || undefined,
        service_type: formData.service_type,
        service_id: formData.service_id || undefined,
        service_name: formData.service_name,
        service_description: formData.service_description,
        total_value: Number(formData.total_value),
        paid_amount: Number(formData.paid_amount) || 0,
        payment_method: formData.payment_method,
        sale_status: formData.sale_status,
        payment_status: formData.payment_status,
        notes: formData.notes,
        expected_delivery_date: formData.expected_delivery_date || undefined,
        sale_date: new Date().toISOString(),
        commission_rate: 0,
        assigned_to: formData.assigned_to === 'unassigned' ? undefined : formData.assigned_to || undefined
      };

      const createdSale = await createSaleMutation.mutateAsync(saleData);

      // Se for um serviço recorrente e tem cliente, criar automaticamente o serviço recorrente
      if (isRecurringService && formData.customer_id && formData.customer_id !== 'none') {
        await createRecurringService.mutateAsync({
          customer_id: formData.customer_id,
          service_id: formData.service_id || undefined,
          service_name: formData.service_name,
          service_description: formData.service_description,
          monthly_amount: Number(formData.total_value),
          billing_day: parseInt(recurringData.billing_day),
          start_date: recurringData.start_date,
          status: 'active' as const,
          next_billing_date: recurringData.start_date
        });
      }

      onClose();
    } catch (error) {
      console.error('Erro ao criar venda:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Nova Venda</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cliente */}
            <CustomerSelectField
              customers={customers}
              value={formData.customer_id}
              onChange={(value) => setFormData(prev => ({ ...prev, customer_id: value }))}
            />

            {/* Seleção de Serviço */}
            <ServiceSelectionField
              serviceType={formData.service_type}
              serviceId={formData.service_id}
              onServiceTypeChange={handleServiceTypeChange}
              onServiceSelect={handleServiceSelect}
            />
          </div>

          {/* Informações do Serviço */}
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

          {/* Descrição do Serviço */}
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

          {/* Configurações de Recorrência - só aparece se for serviço recorrente */}
          {isRecurringService && formData.customer_id && formData.customer_id !== 'none' && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <h4 className="text-blue-400 font-medium mb-4 flex items-center gap-2">
                🔄 Configurações de Recorrência
              </h4>
              <p className="text-sm text-gray-300 mb-4">
                Este serviço é recorrente e será automaticamente adicionado ao módulo financeiro.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Dia de Cobrança</Label>
                  <Select value={recurringData.billing_day} onValueChange={(value) => setRecurringData(prev => ({ ...prev, billing_day: value }))}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          Dia {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300">Data de Início</Label>
                  <Input
                    type="date"
                    value={recurringData.start_date}
                    onChange={(e) => setRecurringData(prev => ({ ...prev, start_date: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            </div>
          )}

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
            onSaleStatusChange={(value) => setFormData(prev => ({ ...prev, sale_status: value }))}
            onPaymentStatusChange={(value) => setFormData(prev => ({ ...prev, payment_status: value }))}
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

          <div className="flex justify-end gap-2 pt-4">
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
              disabled={createSaleMutation.isPending || createRecurringService.isPending}
              className="bg-senvia-500 hover:bg-senvia-400 text-black"
            >
              {(createSaleMutation.isPending || createRecurringService.isPending) ? 'Criando...' : 'Criar Venda'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSaleModal;
