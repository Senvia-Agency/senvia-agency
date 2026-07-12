import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateRecurringService } from "@/hooks/useRecurringServices";
import { useCustomers } from "@/hooks/useCustomers";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";

interface CreateRecurringItemModalProps {
  type: 'receita' | 'despesa';
}

const CreateRecurringItemModal = ({ type }: CreateRecurringItemModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    service_name: '',
    service_description: '',
    customer_id: '',
    amount: '',
    billing_day: '1',
    start_date: new Date().toISOString().split('T')[0],
  });

  const createService = useCreateRecurringService();
  const { data: customers } = useCustomers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (type === 'receita' && !formData.customer_id) {
      return;
    }

    await createService.mutateAsync({
      recurrence_type: type,
      service_name: formData.service_name,
      service_description: formData.service_description || undefined,
      customer_id: formData.customer_id || undefined,
      amount: parseFloat(formData.amount),
      billing_day: parseInt(formData.billing_day),
      start_date: formData.start_date,
      status: 'active',
    });

    setFormData({
      service_name: '',
      service_description: '',
      customer_id: '',
      amount: '',
      billing_day: '1',
      start_date: new Date().toISOString().split('T')[0],
    });
    setOpen(false);
  };

  const isReceita = type === 'receita';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={isReceita ? "default" : "destructive"}
          className="gap-2"
        >
          {isReceita ? (
            <><TrendingUp className="h-4 w-4" /> Nova Receita Recorrente</>
          ) : (
            <><TrendingDown className="h-4 w-4" /> Nova Despesa Recorrente</>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isReceita ? 'Criar Receita Recorrente' : 'Criar Despesa Recorrente'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isReceita && (
            <div>
              <Label htmlFor="customer" className="text-gray-300">
                Cliente *
              </Label>
              <Select
                value={formData.customer_id}
                onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {customers?.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="service_name" className="text-gray-300">
              {isReceita ? 'Nome do Serviço *' : 'Nome da Despesa *'}
            </Label>
            <Input
              id="service_name"
              value={formData.service_name}
              onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
              placeholder={isReceita ? "Ex: Manutenção de Website" : "Ex: Servidor Cloud AWS"}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="service_description" className="text-gray-300">
              Descrição (opcional)
            </Label>
            <Textarea
              id="service_description"
              value={formData.service_description}
              onChange={(e) => setFormData({ ...formData, service_description: e.target.value })}
              placeholder={isReceita ? "Descreva o serviço prestado" : "Descreva a despesa"}
              className="bg-gray-700 border-gray-600 text-white"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount" className="text-gray-300">
                Valor Mensal (€) *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="billing_day" className="text-gray-300">
                {isReceita ? 'Dia de Cobrança *' : 'Dia de Pagamento *'}
              </Label>
              <Select
                value={formData.billing_day}
                onValueChange={(value) => setFormData({ ...formData, billing_day: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 max-h-60">
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
            <Label htmlFor="start_date" className="text-gray-300">
              Data de Início *
            </Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createService.isPending || (isReceita && !formData.customer_id)}
              className="flex-1"
            >
              {createService.isPending ? "Criando..." : `Criar ${isReceita ? 'Receita' : 'Despesa'}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRecurringItemModal;
