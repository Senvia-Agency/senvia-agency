
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface DateNotesFieldsProps {
  date: string;
  notes: string;
  onDateChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

const DateNotesFields = ({ 
  date, 
  notes, 
  onDateChange, 
  onNotesChange 
}: DateNotesFieldsProps) => {
  return (
    <>
      <div>
        <label className="text-sm font-medium text-gray-300">Data</label>
        <Input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="bg-gray-700 border-gray-600"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-300">Notas (opcional)</label>
        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="bg-gray-700 border-gray-600"
          placeholder="Informações adicionais..."
          rows={3}
        />
      </div>
    </>
  );
};

export default DateNotesFields;
