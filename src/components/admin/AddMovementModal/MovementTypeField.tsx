
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MovementTypeFieldProps {
  value: 'receita' | 'despesa';
  onChange: (value: 'receita' | 'despesa') => void;
}

const MovementTypeField = ({ value, onChange }: MovementTypeFieldProps) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-300">Tipo</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-gray-700 border-gray-600">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="receita">Receita</SelectItem>
          <SelectItem value="despesa">Despesa</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MovementTypeField;
