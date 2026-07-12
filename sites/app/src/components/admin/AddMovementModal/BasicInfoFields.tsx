
import { Input } from "@/components/ui/input";

interface BasicInfoFieldsProps {
  description: string;
  amount: string;
  onDescriptionChange: (value: string) => void;
  onAmountChange: (value: string) => void;
}

const BasicInfoFields = ({ 
  description, 
  amount, 
  onDescriptionChange, 
  onAmountChange 
}: BasicInfoFieldsProps) => {
  return (
    <>
      <div>
        <label className="text-sm font-medium text-gray-300">Descrição</label>
        <Input
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="bg-gray-700 border-gray-600"
          placeholder="Ex: Venda de Landing Page"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-300">Valor (€)</label>
        <Input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="bg-gray-700 border-gray-600"
          placeholder="0.00"
        />
      </div>
    </>
  );
};

export default BasicInfoFields;
