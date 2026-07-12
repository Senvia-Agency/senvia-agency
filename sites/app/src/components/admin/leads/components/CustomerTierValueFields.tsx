
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CustomerTierValueFieldsProps {
  customerTier: string;
  conversionValue: number;
  onInputChange: (field: string, value: string | number) => void;
}

const CustomerTierValueFields = ({ customerTier, conversionValue, onInputChange }: CustomerTierValueFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label className="text-sm font-medium text-gray-300">Categoria do Cliente</Label>
        <Select 
          value={customerTier} 
          onValueChange={(value) => onInputChange('customer_tier', value)}
        >
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="basic">Básico</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-300">Valor Pago (€)</Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={conversionValue}
          onChange={(e) => onInputChange('conversion_value', parseFloat(e.target.value) || 0)}
          className="bg-gray-700 border-gray-600 text-white mt-1"
          placeholder="0.00"
        />
      </div>
    </div>
  );
};

export default CustomerTierValueFields;
