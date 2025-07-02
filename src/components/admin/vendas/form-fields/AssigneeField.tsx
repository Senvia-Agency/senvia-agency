import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";
import { useAdminUsers } from "@/hooks/useAdminUsers";

interface AssigneeFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const AssigneeField = ({ value, onChange }: AssigneeFieldProps) => {
  const { data: adminUsers, isLoading } = useAdminUsers();

  return (
    <div className="space-y-2">
      <Label htmlFor="assigned_to" className="text-white flex items-center gap-2">
        <User className="h-4 w-4" />
        Responsável pelo Projeto
      </Label>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={isLoading}
      >
        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
          <SelectValue placeholder={isLoading ? "Carregando..." : "Selecionar responsável"} />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 border-gray-600">
          <SelectItem value="unassigned">Não atribuído</SelectItem>
          {adminUsers?.map((user) => (
            <SelectItem key={user.user_id} value={user.user_id}>
              {user.full_name} ({user.email})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AssigneeField;