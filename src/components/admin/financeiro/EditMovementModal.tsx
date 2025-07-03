
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { FinancialMovement } from "@/hooks/useFinancialMovements";
import { useCustomers } from "@/hooks/useCustomers";
import { DollarSign, Calendar, FileText } from "lucide-react";

interface EditMovementModalProps {
  movement: FinancialMovement | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<FinancialMovement>) => void;
  isUpdating: boolean;
}

const EditMovementModal = ({ movement, isOpen, onClose, onUpdate, isUpdating }: EditMovementModalProps) => {
  const { toast } = useToast();
  const { data: customers } = useCustomers();

  const [formData, setFormData] = useState({
    movement_type: 'receita' as 'receita' | 'despesa',
    amount: '',
    description: '',
    category: '',
    movement_date: '',
    customer_id: '',
    notes: ''
  });

  useEffect(() => {
    if (movement) {
      console.log('Setting form data for movement:', movement);
      setFormData({
        movement_type: movement.movement_type,
        amount: movement.amount.toString(),
        description: movement.description,
        category: movement.category,
        movement_date: movement.movement_date,
        customer_id: movement.customer_id || 'none',
        notes: movement.notes || ''
      });
    }
  }, [movement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!movement) return;

    console.log('Submitting update with data:', formData);

    const updates = {
      movement_type: formData.movement_type,
      amount: Number(formData.amount),
      description: formData.description,
      category: formData.category,
      movement_date: formData.movement_date,
      customer_id: formData.customer_id === 'none' ? null : formData.customer_id,
      notes: formData.notes || null
    };

    console.log('Final updates object:', updates);

    onUpdate(movement.id, updates);
    onClose();
  };

  if (!movement) return null;

  const receiptCategories = [
    'vendas', 'servicos', 'consultoria', 'assinatura', 'comissao', 'parceria', 'investimento', 'outros'
  ];

  const expenseCategories = [
    'marketing', 'escritorio', 'tecnologia', 'pessoal', 'contabilidade', 'juridico', 'viagem',
    'material', 'fornecedor', 'imposto', 'banco', 'seguro', 'aluguel', 'utilidades', 'estorno', 'outros'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-senvia-500" />
            Editar Movimento Financeiro
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo e Valor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="movement_type" className="text-white">Tipo de Movimento</Label>
              <Select
                value={formData.movement_type}
                onValueChange={(value: 'receita' | 'despesa') => setFormData(prev => ({ ...prev, movement_type: value }))}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount" className="text-white flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Valor (€)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <Label htmlFor="description" className="text-white">Descrição</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Descreva o movimento financeiro..."
              required
            />
          </div>

          {/* Categoria e Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-white">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {(formData.movement_type === 'receita' ? receiptCategories : expenseCategories).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="movement_date" className="text-white flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data do Movimento
              </Label>
              <Input
                id="movement_date"
                type="date"
                value={formData.movement_date}
                onChange={(e) => {
                  console.log('Date changed to:', e.target.value);
                  setFormData(prev => ({ ...prev, movement_date: e.target.value }));
                }}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
          </div>

          {/* Cliente */}
          <div>
            <Label htmlFor="customer_id" className="text-white">Cliente (Opcional)</Label>
            <Select
              value={formData.customer_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, customer_id: value }))}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Selecionar cliente (opcional)" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="none">Nenhum cliente</SelectItem>
                {customers?.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.full_name} ({customer.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="notes" className="text-white">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Informações adicionais..."
              rows={3}
            />
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-600">
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
              disabled={isUpdating}
              className="bg-senvia-500 hover:bg-senvia-400 text-black"
            >
              {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMovementModal;
