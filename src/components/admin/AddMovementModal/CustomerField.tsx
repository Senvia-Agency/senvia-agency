
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Customer {
  id: string;
  full_name: string;
  email: string;
}

interface CustomerFieldProps {
  value: string;
  customers?: Customer[];
  onChange: (value: string) => void;
}

const CustomerField = ({ value, customers, onChange }: CustomerFieldProps) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-300">Cliente (opcional)</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-gray-700 border-gray-600">
          <SelectValue placeholder="Selecionar cliente" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Sem cliente específico</SelectItem>
          {customers?.map(customer => (
            <SelectItem key={customer.id} value={customer.id}>
              {customer.full_name} ({customer.email})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CustomerField;
