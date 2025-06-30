
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AccountReceivable, useUpdateDueDate } from "@/hooks/useAccountsReceivable";
import { format } from "date-fns";

interface EditDueDateModalProps {
  account: AccountReceivable | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditDueDateModal = ({ account, isOpen, onClose }: EditDueDateModalProps) => {
  const [newDueDate, setNewDueDate] = useState("");
  const updateDueDateMutation = useUpdateDueDate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account || !newDueDate) return;

    try {
      await updateDueDateMutation.mutateAsync({
        saleId: account.id,
        newDueDate: newDueDate
      });
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar data:', error);
    }
  };

  const formatDateForInput = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch {
      return '';
    }
  };

  // Resetar o formulário quando abrir/fechar
  React.useEffect(() => {
    if (isOpen && account?.due_date) {
      setNewDueDate(formatDateForInput(account.due_date));
    } else if (!isOpen) {
      setNewDueDate("");
    }
  }, [isOpen, account]);

  if (!account) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-600 text-white">
        <DialogHeader>
          <DialogTitle>Editar Data de Vencimento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-gray-300">Cliente</Label>
            <div className="text-white font-medium">{account.customer_name}</div>
          </div>

          <div>
            <Label className="text-gray-300">Venda</Label>
            <div className="text-white">{account.sale_number} - {account.service_name}</div>
          </div>

          <div>
            <Label className="text-gray-300">Valor Pendente</Label>
            <div className="text-yellow-400 font-medium">€{account.remaining_amount.toFixed(2)}</div>
          </div>

          <div>
            <Label htmlFor="dueDate" className="text-gray-300">
              Nova Data de Vencimento
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
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
              disabled={updateDueDateMutation.isPending}
              className="bg-senvia-500 hover:bg-senvia-600"
            >
              {updateDueDateMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDueDateModal;
