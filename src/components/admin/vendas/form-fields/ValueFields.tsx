
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ValueFieldsProps {
  totalValue: string;
  paidAmount: string;
  paymentMethod?: string;
  onTotalValueChange: (value: string) => void;
  onPaidAmountChange: (value: string) => void;
  onPaymentMethodChange?: (value: string) => void;
}

const ValueFields = ({ 
  totalValue, 
  paidAmount, 
  paymentMethod,
  onTotalValueChange, 
  onPaidAmountChange,
  onPaymentMethodChange
}: ValueFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-gray-300">Valor Total (€) *</Label>
          <Input
            type="number"
            step="0.01"
            value={totalValue}
            onChange={(e) => onTotalValueChange(e.target.value)}
            placeholder="0.00"
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        
        <div>
          <Label className="text-gray-300">Valor Pago (€)</Label>
          <Input
            type="number"
            step="0.01"
            value={paidAmount}
            onChange={(e) => onPaidAmountChange(e.target.value)}
            placeholder="0.00"
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
      </div>

      {paymentMethod !== undefined && onPaymentMethodChange && (
        <div>
          <Label className="text-gray-300">Método de Pagamento</Label>
          <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Selecionar método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stripe">Stripe</SelectItem>
              <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
              <SelectItem value="mbway">MB Way</SelectItem>
              <SelectItem value="cash">Dinheiro</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default ValueFields;
