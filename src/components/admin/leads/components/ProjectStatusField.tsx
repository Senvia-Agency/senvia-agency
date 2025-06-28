
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProjectStatusFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const ProjectStatusField = ({ value, onChange }: ProjectStatusFieldProps) => {
  return (
    <div>
      <Label className="text-sm font-medium text-gray-300">Status do Projeto</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          <SelectItem value="pending">Pendente</SelectItem>
          <SelectItem value="in_progress">Em Progresso</SelectItem>
          <SelectItem value="completed">Concluído</SelectItem>
          <SelectItem value="on_hold">Em Pausa</SelectItem>
          <SelectItem value="cancelled">Cancelado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProjectStatusField;
