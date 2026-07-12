
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Euro } from "lucide-react";

interface PaymentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadOrCustomer: any;
  onUpdate: (updates: any) => void;
  type: 'lead' | 'customer';
}

const PaymentStatusModal = ({ isOpen, onClose, leadOrCustomer, onUpdate, type }: PaymentStatusModalProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    service_type: leadOrCustomer?.service_type || 'landing_page_basic',
    total_value: leadOrCustomer?.total_value || 0,
    paid_amount: leadOrCustomer?.paid_amount || 0,
    payment_status: leadOrCustomer?.payment_status || 'pending',
    payment_method: leadOrCustomer?.payment_method || 'stripe',
    notes: leadOrCustomer?.payment_notes || ''
  });

  const serviceOptions = [
    { value: 'landing_page_basic', label: 'Landing Page Básica', price: 4.99 },
    { value: 'landing_page_premium', label: 'Landing Page Premium', price: 49.99 },
    { value: 'website_basic', label: 'Website Básico', price: 299.99 },
    { value: 'website_premium', label: 'Website Premium', price: 599.99 },
    { value: 'ecommerce', label: 'E-commerce', price: 999.99 },
    { value: 'custom', label: 'Serviço Personalizado', price: 0 }
  ];

  const paymentStatusOptions = [
    { value: 'pending', label: 'Pendente' },
    { value: 'partial', label: 'Pagamento Parcial' },
    { value: 'paid', label: 'Pago Completamente' },
    { value: 'overdue', label: 'Em Atraso' }
  ];

  const handleServiceChange = (value: string) => {
    const service = serviceOptions.find(s => s.value === value);
    setFormData(prev => ({
      ...prev,
      service_type: value,
      total_value: service?.price || prev.total_value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates = {
      service_type: formData.service_type,
      total_value: parseFloat(formData.total_value.toString()),
      paid_amount: parseFloat(formData.paid_amount.toString()),
      payment_status: formData.payment_status,
      payment_method: formData.payment_method,
      payment_notes: formData.notes,
      remaining_amount: parseFloat(formData.total_value.toString()) - parseFloat(formData.paid_amount.toString())
    };

    onUpdate(updates);
    onClose();
    
    toast({
      title: "Status de pagamento atualizado",
      description: "As informações de pagamento foram atualizadas com sucesso."
    });
  };

  const remainingAmount = parseFloat(formData.total_value.toString()) - parseFloat(formData.paid_amount.toString());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Gerenciar Pagamentos</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-gray-300">Tipo de Serviço</Label>
            <Select value={formData.service_type} onValueChange={handleServiceChange}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {serviceOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label} {option.price > 0 && `(€${option.price})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-gray-300">Valor Total</Label>
              <div className="relative">
                <Euro className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  step="0.01"
                  value={formData.total_value}
                  onChange={(e) => setFormData(prev => ({ ...prev, total_value: parseFloat(e.target.value) || 0 }))}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Valor Pago</Label>
              <div className="relative">
                <Euro className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  step="0.01"
                  value={formData.paid_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, paid_amount: parseFloat(e.target.value) || 0 }))}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Valor em falta:</span>
              <span className={`font-bold ${remainingAmount > 0 ? 'text-yellow-500' : 'text-green-500'}`}>
                €{remainingAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <Label className="text-gray-300">Status do Pagamento</Label>
            <Select value={formData.payment_status} onValueChange={(value) => setFormData(prev => ({ ...prev, payment_status: value }))}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentStatusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-300">Método de Pagamento</Label>
            <Select value={formData.payment_method} onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                <SelectItem value="cash">Dinheiro</SelectItem>
                <SelectItem value="mbway">MB Way</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-300">Notas</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Adicione notas sobre o pagamento..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-senvia-500 hover:bg-senvia-400 text-black">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentStatusModal;
