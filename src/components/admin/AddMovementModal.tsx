
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomers } from "@/hooks/useCustomers";
import { format } from "date-fns";

interface AddMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (movement: any) => void;
  isLoading?: boolean;
}

const AddMovementModal = ({ isOpen, onClose, onSubmit, isLoading }: AddMovementModalProps) => {
  const { data: customers } = useCustomers();

  const [movement, setMovement] = useState({
    movement_type: 'despesa' as 'receita' | 'despesa',
    amount: '',
    description: '',
    category: '',
    movement_date: format(new Date(), 'yyyy-MM-dd'),
    customer_id: '',
    notes: ''
  });

  const handleSubmit = () => {
    if (!movement.amount || !movement.description || !movement.category) {
      return;
    }

    onSubmit({
      ...movement,
      amount: parseFloat(movement.amount),
      customer_id: movement.customer_id || undefined
    });

    // Reset form
    setMovement({
      movement_type: 'despesa',
      amount: '',
      description: '',
      category: '',
      movement_date: format(new Date(), 'yyyy-MM-dd'),
      customer_id: '',
      notes: ''
    });
    onClose();
  };

  const receitaCategories = ['vendas_landing_pages', 'assinaturas', 'consultoria', 'outros_servicos'];
  const despesaCategories = ['infraestrutura', 'marketing', 'saas', 'taxas', 'operacional', 'outros'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Novo Movimento Financeiro</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300">Tipo</label>
            <Select 
              value={movement.movement_type} 
              onValueChange={(value: 'receita' | 'despesa') => setMovement({...movement, movement_type: value, customer_id: value === 'despesa' ? '' : movement.customer_id})}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="receita">Receita</SelectItem>
                <SelectItem value="despesa">Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Descrição</label>
            <Input
              value={movement.description}
              onChange={(e) => setMovement({...movement, description: e.target.value})}
              className="bg-gray-700 border-gray-600"
              placeholder="Ex: Venda de Landing Page"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Valor (€)</label>
            <Input
              type="number"
              step="0.01"
              value={movement.amount}
              onChange={(e) => setMovement({...movement, amount: e.target.value})}
              className="bg-gray-700 border-gray-600"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Categoria</label>
            <Select 
              value={movement.category} 
              onValueChange={(value) => setMovement({...movement, category: value})}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Selecionar categoria" />
              </SelectTrigger>
              <SelectContent>
                {(movement.movement_type === 'receita' ? receitaCategories : despesaCategories).map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {movement.movement_type === 'receita' && (
            <div>
              <label className="text-sm font-medium text-gray-300">Cliente (opcional)</label>
              <Select 
                value={movement.customer_id} 
                onValueChange={(value) => setMovement({...movement, customer_id: value})}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Selecionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sem cliente específico</SelectItem>
                  {customers?.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.full_name} ({customer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-300">Data</label>
            <Input
              type="date"
              value={movement.movement_date}
              onChange={(e) => setMovement({...movement, movement_date: e.target.value})}
              className="bg-gray-700 border-gray-600"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Notas (opcional)</label>
            <Textarea
              value={movement.notes}
              onChange={(e) => setMovement({...movement, notes: e.target.value})}
              className="bg-gray-700 border-gray-600"
              placeholder="Informações adicionais..."
              rows={3}
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full bg-senvia-500 hover:bg-senvia-400 text-black"
            disabled={isLoading || !movement.amount || !movement.description || !movement.category}
          >
            {isLoading ? 'Adicionando...' : 'Adicionar Movimento'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMovementModal;
