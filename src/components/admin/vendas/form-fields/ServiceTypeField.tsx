
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ServiceTypeFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const ServiceTypeField = ({ value, onChange }: ServiceTypeFieldProps) => {
  return (
    <div>
      <Label className="text-gray-300">Tipo de Serviço</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="manual">Serviço Manual</SelectItem>
          <SelectItem value="custom_service">Serviço Personalizado</SelectItem>
          <SelectItem value="stripe_product">Produto do Stripe</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ServiceTypeField;
