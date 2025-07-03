
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useCreateRecurringService } from "@/hooks/useRecurringServices";
import { useCustomers } from "@/hooks/useCustomers";

const CreateRecurringServiceModal = () => {
  const [open, setOpen] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [billingDay, setBillingDay] = useState("1");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const createService = useCreateRecurringService();
  const { data: customers } = useCustomers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceName || !customerId || !monthlyAmount) return;

    try {
      await createService.mutateAsync({
        service_name: serviceName,
        service_description: serviceDescription,
        customer_id: customerId,
        monthly_amount: parseFloat(monthlyAmount),
        billing_day: parseInt(billingDay),
        start_date: startDate,
        status: 'active',
        next_billing_date: startDate
      });

      // Reset form
      setServiceName("");
      setServiceDescription("");
      setCustomerId("");
      setMonthlyAmount("");
      setBillingDay("1");
      setStartDate(new Date().toISOString().split('T')[0]);
      setOpen(false);
    } catch (error) {
      console.error('Erro ao criar serviço recorrente:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Serviço Recorrente
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Criar Serviço Recorrente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customer" className="text-gray-300">Cliente *</Label>
            <Select value={customerId} onValueChange={setCustomerId} required>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Selecione um cliente" />
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

          <div>
            <Label htmlFor="service-name" className="text-gray-300">Nome do Serviço *</Label>
            <Input
              id="service-name"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Ex: Gestão de Redes Sociais"
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="service-description" className="text-gray-300">Descrição</Label>
            <Textarea
              id="service-description"
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              placeholder="Descreva o serviço..."
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monthly-amount" className="text-gray-300">Valor Mensal (€) *</Label>
              <Input
                id="monthly-amount"
                type="number"
                step="0.01"
                min="0"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(e.target.value)}
                placeholder="0.00"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

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

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createService.isPending}
              className="flex-1"
            >
              {createService.isPending ? "Criando..." : "Criar Serviço"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRecurringServiceModal;
