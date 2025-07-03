
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateRecurringFromCustomService } from "@/hooks/useCustomServices";
import { useCreateRecurringService } from "@/hooks/useRecurringServices";
import { useCustomers } from "@/hooks/useCustomers";
import { Sale } from "@/hooks/sales/types";

interface ConvertToRecurringModalProps {
  sale: Sale | null;
  isOpen: boolean;
  onClose: () => void;
}

const ConvertToRecurringModal = ({ sale, isOpen, onClose }: ConvertToRecurringModalProps) => {
  const [customerId, setCustomerId] = useState("");
  const [billingDay, setBillingDay] = useState("1");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: customers } = useCustomers();
  const createRecurringFromCustom = useCreateRecurringFromCustomService();
  const createRecurringDirect = useCreateRecurringService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sale) return;

    try {
      if (sale.service_type === 'custom_service' && sale.service_id) {
        // Usar serviço personalizado existente
        await createRecurringFromCustom.mutateAsync({
          customServiceId: sale.service_id,
          customerId: customerId || sale.customer_id || '',
          billingDay: parseInt(billingDay),
          startDate: startDate
        });
      } else {
        // Criar serviço recorrente direto
        await createRecurringDirect.mutateAsync({
          customer_id: customerId || sale.customer_id || '',
          service_name: sale.service_name,
          service_description: sale.service_description,
          monthly_amount: sale.total_value,
          billing_day: parseInt(billingDay),
          start_date: startDate,
          status: 'active',
          next_billing_date: startDate
        });
      }

      onClose();
    } catch (error) {
      console.error('Erro ao converter para recorrente:', error);
    }
  };

  if (!sale) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Converter para Serviço Recorrente</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-gray-700 rounded">
            <h4 className="font-medium text-white mb-2">Detalhes da Venda</h4>
            <p className="text-sm text-gray-300"><strong>Serviço:</strong> {sale.service_name}</p>
            <p className="text-sm text-gray-300"><strong>Valor:</strong> €{sale.total_value}</p>
            {sale.customers && (
              <p className="text-sm text-gray-300"><strong>Cliente:</strong> {sale.customers.full_name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="customer" className="text-gray-300">Cliente</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder={sale.customers?.full_name || "Selecione um cliente"} />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {customers?.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.full_name} ({customer.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billing-day" className="text-gray-300">Dia de Cobrança</Label>
              <Select value={billingDay} onValueChange={setBillingDay}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      Dia {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="start-date" className="text-gray-300">Data de Início</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createRecurringFromCustom.isPending || createRecurringDirect.isPending}
              className="flex-1"
            >
              {(createRecurringFromCustom.isPending || createRecurringDirect.isPending) ? "Convertendo..." : "Converter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConvertToRecurringModal;
