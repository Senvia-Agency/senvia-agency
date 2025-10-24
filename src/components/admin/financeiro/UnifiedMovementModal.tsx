import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFinancialMovements } from "@/hooks/useFinancialMovements";
import { useCreateRecurringService } from "@/hooks/useRecurringServices";
import { useAdminCustomers } from "@/hooks/useAdminCustomers";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import CategoryField from "../AddMovementModal/CategoryField";
import CustomerField from "../AddMovementModal/CustomerField";

interface UnifiedMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UnifiedMovementModal = ({ isOpen, onClose }: UnifiedMovementModalProps) => {
  const [type, setType] = useState<'receita' | 'despesa'>('receita');
  const [isRecurring, setIsRecurring] = useState(false);
  
  // Campos casuais
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [movementDate, setMovementDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState('');
  
  // Campos recorrentes
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [billingDay, setBillingDay] = useState('');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const { data: customers } = useAdminCustomers();
  const { addMovement, isAddingMovement } = useFinancialMovements(null);
  const createRecurringMutation = useCreateRecurringService();
  const queryClient = useQueryClient();

  const resetForm = () => {
    setType('receita');
    setIsRecurring(false);
    setDescription('');
    setAmount('');
    setCategory('');
    setCustomerId('');
    setMovementDate(format(new Date(), 'yyyy-MM-dd'));
    setNotes('');
    setServiceName('');
    setServiceDescription('');
    setBillingDay('');
    setStartDate(format(new Date(), 'yyyy-MM-dd'));
  };

  const handleSubmit = async () => {
    if (isRecurring) {
      // Validação para recorrente
      if (!serviceName || !amount || !billingDay || !startDate) {
        return;
      }
      
      if (type === 'receita' && !customerId) {
        return;
      }

      await createRecurringMutation.mutateAsync({
        recurrence_type: type,
        service_name: serviceName,
        service_description: serviceDescription,
        amount: parseFloat(amount),
        billing_day: parseInt(billingDay),
        start_date: startDate,
        customer_id: type === 'receita' ? (customerId && customerId !== 'none' && customerId.trim() !== '' ? customerId : null) : undefined,
        status: 'active'
      });
    } else {
      // Validação para casual
      if (!description || !amount || !category) {
        return;
      }

      await addMovement({
        movement_type: type,
        amount: parseFloat(amount),
        description,
        category,
        movement_date: movementDate,
        customer_id: (customerId && customerId !== 'none' && customerId.trim() !== '' ? customerId : null),
        notes
      });
    }

    // Invalidar queries para atualizar dados
    await queryClient.invalidateQueries({ queryKey: ['all-financial-movements'] });
    await queryClient.invalidateQueries({ queryKey: ['real-financial-data'] });
    await queryClient.invalidateQueries({ queryKey: ['recurring-services'] });

    resetForm();
    onClose();
  };

  const isLoading = isAddingMovement || createRecurringMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Registro Financeiro</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Tipo */}
          <div className="space-y-3">
            <Label className="text-gray-300">Tipo</Label>
            <RadioGroup
              value={type}
              onValueChange={(value) => setType(value as 'receita' | 'despesa')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="receita" id="receita" />
                <Label htmlFor="receita" className="cursor-pointer">Receita</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="despesa" id="despesa" />
                <Label htmlFor="despesa" className="cursor-pointer">Despesa</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Checkbox Recorrente */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="recurring"
              checked={isRecurring}
              onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
            />
            <Label htmlFor="recurring" className="cursor-pointer text-gray-300">
              É recorrente?
            </Label>
          </div>

          {/* Campos Dinâmicos */}
          {isRecurring ? (
            // Campos para Recorrente
            <div className="space-y-4">
              {type === 'receita' && (
                <CustomerField
                  value={customerId}
                  customers={customers?.customers}
                  onChange={setCustomerId}
                />
              )}

              <div>
                <Label className="text-gray-300">Nome do {type === 'receita' ? 'Serviço' : 'Despesa'}*</Label>
                <Input
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                  placeholder={type === 'receita' ? 'Ex: Plano Premium' : 'Ex: Servidor AWS'}
                />
              </div>

              <div>
                <Label className="text-gray-300">Descrição (opcional)</Label>
                <Textarea
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                  placeholder="Informações adicionais..."
                  rows={2}
                />
              </div>

              <div>
                <Label className="text-gray-300">Valor Mensal (€)*</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label className="text-gray-300">Dia de {type === 'receita' ? 'Cobrança' : 'Pagamento'}* (1-28)</Label>
                <Input
                  type="number"
                  min="1"
                  max="28"
                  value={billingDay}
                  onChange={(e) => setBillingDay(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                  placeholder="15"
                />
              </div>

              <div>
                <Label className="text-gray-300">Data de Início*</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
            </div>
          ) : (
            // Campos para Casual
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Descrição*</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                  placeholder="Ex: Venda de Landing Page"
                />
              </div>

              <div>
                <Label className="text-gray-300">Valor (€)*</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                  placeholder="0.00"
                />
              </div>

              <CategoryField
                value={category}
                movementType={type}
                onChange={setCategory}
              />

              {type === 'receita' && (
                <CustomerField
                  value={customerId}
                  customers={customers?.customers}
                  onChange={setCustomerId}
                />
              )}

              <div>
                <Label className="text-gray-300">Data*</Label>
                <Input
                  type="date"
                  value={movementDate}
                  onChange={(e) => setMovementDate(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div>
                <Label className="text-gray-300">Notas (opcional)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                  placeholder="Informações adicionais..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Adicionando...' : 'Adicionar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnifiedMovementModal;
