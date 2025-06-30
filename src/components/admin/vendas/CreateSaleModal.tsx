
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCreateSaleForm } from "./hooks/useCreateSaleForm";
import CustomerSelectField from "./form-fields/CustomerSelectField";
import ServiceTypeField from "./form-fields/ServiceTypeField";
import ServiceSelectionField from "./form-fields/ServiceSelectionField";
import BasicServiceFields from "./form-fields/BasicServiceFields";
import ValueFields from "./form-fields/ValueFields";
import StatusFields from "./form-fields/StatusFields";
import AdditionalFields from "./form-fields/AdditionalFields";
import { useCustomers } from "@/hooks/useCustomers";

interface CreateSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateSaleModal = ({ isOpen, onClose }: CreateSaleModalProps) => {
  const {
    formData,
    setFormData,
    handleSubmit,
    handleServiceTypeChange,
    handleServiceSelect,
    handleNewCustomerCreated,
    tempCustomers,
    createSaleMutation
  } = useCreateSaleForm(onClose);

  const { data: customers } = useCustomers();

  // Combinar clientes reais com temporários para exibição
  const allCustomers = [
    ...(customers || []),
    ...tempCustomers
  ];

  // Encontrar o cliente selecionado (real ou temporário)
  const selectedCustomer = allCustomers.find(c => c.id === formData.customer_id);
  const selectedCustomerName = selectedCustomer ? 
    `${selectedCustomer.full_name} - ${selectedCustomer.email}${selectedCustomer.id.startsWith('temp_') ? ' (Novo)' : ''}` : 
    '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Nova Venda</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <CustomerSelectField
            value={formData.customer_id}
            onChange={(value) => setFormData(prev => ({ ...prev, customer_id: value }))}
            onNewCustomerCreated={handleNewCustomerCreated}
          />

          {/* Mostrar cliente selecionado se for novo */}
          {formData.customer_id.startsWith('temp_') && (
            <div className="bg-gray-700 p-3 rounded border border-senvia-500">
              <p className="text-sm text-senvia-400">
                ✓ Novo cliente: {selectedCustomerName}
              </p>
              <p className="text-xs text-gray-400">
                Este cliente será criado quando a venda for salva.
              </p>
            </div>
          )}

          <ServiceTypeField
            value={formData.service_type}
            onChange={handleServiceTypeChange}
          />

          <ServiceSelectionField
            serviceType={formData.service_type}
            serviceId={formData.service_id}
            onServiceSelect={handleServiceSelect}
          />

          <BasicServiceFields
            serviceName={formData.service_name}
            serviceDescription={formData.service_description}
            onServiceNameChange={(value) => setFormData(prev => ({ ...prev, service_name: value }))}
            onServiceDescriptionChange={(value) => setFormData(prev => ({ ...prev, service_description: value }))}
          />

          <ValueFields
            totalValue={formData.total_value}
            paidAmount={formData.paid_amount}
            onTotalValueChange={(value) => setFormData(prev => ({ ...prev, total_value: value }))}
            onPaidAmountChange={(value) => setFormData(prev => ({ ...prev, paid_amount: value }))}
          />

          <StatusFields
            saleStatus={formData.sale_status}
            paymentStatus={formData.payment_status}
            onSaleStatusChange={(value) => setFormData(prev => ({ ...prev, sale_status: value as any }))}
            onPaymentStatusChange={(value) => setFormData(prev => ({ ...prev, payment_status: value as any }))}
          />

          <AdditionalFields
            paymentMethod={formData.payment_method}
            expectedDeliveryDate={formData.expected_delivery_date}
            notes={formData.notes}
            onPaymentMethodChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
            onExpectedDeliveryDateChange={(value) => setFormData(prev => ({ ...prev, expected_delivery_date: value }))}
            onNotesChange={(value) => setFormData(prev => ({ ...prev, notes: value }))}
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
              disabled={createSaleMutation.isPending}
              className="bg-senvia-500 hover:bg-senvia-400 text-black"
            >
              {createSaleMutation.isPending ? 'Criando...' : 'Criar Venda'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSaleModal;
