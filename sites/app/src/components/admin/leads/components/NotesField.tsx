
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NotesFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const NotesField = ({ value, onChange }: NotesFieldProps) => {
  return (
    <div>
      <Label className="text-sm font-medium text-gray-300">Notas</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-700 border-gray-600 text-white mt-1"
        rows={3}
        placeholder="Adicione notas sobre o cliente..."
      />
    </div>
  );
};

export default NotesField;
