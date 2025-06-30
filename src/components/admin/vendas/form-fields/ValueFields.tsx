
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ValueFieldsProps {
  totalValue: string;
  paidAmount: string;
  onTotalValueChange: (value: string) => void;
  onPaidAmountChange: (value: string) => void;
}

const ValueFields = ({ 
  totalValue, 
  paidAmount, 
  onTotalValueChange, 
  onPaidAmountChange 
}: ValueFieldsProps) => {
  return (
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
  );
};

export default ValueFields;
