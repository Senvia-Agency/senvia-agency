
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalFieldsProps {
  expectedDeliveryDate: string;
  notes: string;
  onExpectedDeliveryDateChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

const AdditionalFields = ({ 
  expectedDeliveryDate, 
  notes, 
  onExpectedDeliveryDateChange, 
  onNotesChange 
}: AdditionalFieldsProps) => {
  return (
    <>
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
