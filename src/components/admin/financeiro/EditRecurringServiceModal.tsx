import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateRecurringService, RecurringService } from "@/hooks/useRecurringServices";

interface EditRecurringServiceModalProps {
  service: RecurringService | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditRecurringServiceModal = ({
  service,
  open,
  onOpenChange,
}: EditRecurringServiceModalProps) => {
  const updateService = useUpdateRecurringService();

  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [billingDay, setBillingDay] = useState("");

  useEffect(() => {
    if (service) {
      setServiceName(service.service_name || "");
      setDescription(service.service_description || "");
      setAmount(String(service.amount || 0));
      setBillingDay(String(service.billing_day || 1));
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service) return;

    await updateService.mutateAsync({
      id: service.id,
      updates: {
        service_name: serviceName,
        service_description: description || null,
        amount: Number(amount),
        billing_day: Number(billingDay),
      },
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Serviço Recorrente</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serviceName">Nome do Serviço</Label>
            <Input
              id="serviceName"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Ex: Manutenção Mensal"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do serviço (opcional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor Mensal (€)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingDay">Dia de Cobrança</Label>
              <Input
                id="billingDay"
                type="number"
                min="1"
                max="31"
                value={billingDay}
                onChange={(e) => setBillingDay(e.target.value)}
                placeholder="1-31"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={updateService.isPending}>
              {updateService.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
