
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomers } from "@/hooks/useCustomers";

interface CustomerSelectFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const CustomerSelectField = ({ value, onChange }: CustomerSelectFieldProps) => {
  const { data: customers } = useCustomers();

  return (
    <div>
      <Label className="text-gray-300">Cliente (Opcional)</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
          <SelectValue placeholder="Selecionar cliente existente" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Venda direta (sem cliente)</SelectItem>
          {customers?.map((customer) => (
            <SelectItem key={customer.id} value={customer.id}>
              {customer.full_name} - {customer.email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CustomerSelectField;
