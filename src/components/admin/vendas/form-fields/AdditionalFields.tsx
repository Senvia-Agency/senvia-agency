
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdditionalFieldsProps {
  paymentMethod: string;
  expectedDeliveryDate: string;
  notes: string;
  onPaymentMethodChange: (value: string) => void;
  onExpectedDeliveryDateChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

const AdditionalFields = ({ 
  paymentMethod, 
  expectedDeliveryDate, 
  notes, 
  onPaymentMethodChange, 
  onExpectedDeliveryDateChange, 
  onNotesChange 
}: AdditionalFieldsProps) => {
  return (
    <>
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

      <div>
        <Label className="text-gray-300">Data Prevista de Entrega</Label>
        <Input
          type="date"
          value={expectedDeliveryDate}
          onChange={(e) => onExpectedDeliveryDateChange(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
        />
      </div>

      <div>
        <Label className="text-gray-300">Observações</Label>
        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Observações sobre a venda"
          className="bg-gray-700 border-gray-600 text-white"
        />
      </div>
    </>
  );
};

export default AdditionalFields;
