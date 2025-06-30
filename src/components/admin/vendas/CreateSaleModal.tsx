
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCreateSaleForm } from "./hooks/useCreateSaleForm";
import CustomerSearchField from "./form-fields/CustomerSearchField";
import ServiceTypeField from "./form-fields/ServiceTypeField";
import ServiceSearchField from "./form-fields/ServiceSearchField";
import BasicServiceFields from "./form-fields/BasicServiceFields";
import ValueFields from "./form-fields/ValueFields";
import StatusFields from "./form-fields/StatusFields";
import AdditionalFields from "./form-fields/AdditionalFields";

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
    createSaleMutation
  } = useCreateSaleForm(onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] bg-gray-800 border-gray-700 my-4 flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4 border-b border-gray-700">
          <DialogTitle className="text-white">Nova Venda</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <CustomerSearchField
              value={formData.customer_id}
              onChange={(value) => setFormData(prev => ({ ...prev, customer_id: value }))}
            />

            <ServiceTypeField
              value={formData.service_type}
              onChange={handleServiceTypeChange}
            />

            <ServiceSearchField
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
          </form>
        </div>

        <div className="flex-shrink-0 flex justify-end gap-2 pt-4 border-t border-gray-700 mt-4">
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
            onClick={handleSubmit}
            className="bg-senvia-500 hover:bg-senvia-400 text-black"
          >
            {createSaleMutation.isPending ? 'Criando...' : 'Criar Venda'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSaleModal;
