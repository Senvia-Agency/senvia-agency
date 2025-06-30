
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Edit3 } from "lucide-react";
import { useAdminUsers } from "@/hooks/useAdminUsers";

interface ProjectAssigneeFieldProps {
  saleId: string;
  assignedTo?: string;
  onAssigneeUpdate: (saleId: string, newAssignee: string) => void;
}

export const ProjectAssigneeField = ({ saleId, assignedTo, onAssigneeUpdate }: ProjectAssigneeFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: adminUsers, isLoading, error } = useAdminUsers();

  const getAssignedUserName = (assignedTo: string) => {
    if (!assignedTo) return 'Não atribuído';
    
    const user = adminUsers?.find(u => u.user_id === assignedTo || u.email === assignedTo);
    return user?.full_name || assignedTo;
  };

  const handleAssigneeChange = (newAssignee: string) => {
    console.log('🔄 Alterando responsável de', assignedTo, 'para:', newAssignee);
    const finalAssignee = newAssignee === 'unassigned' ? '' : newAssignee;
    onAssigneeUpdate(saleId, finalAssignee);
    setIsEditing(false);
  };

  if (error) {
    console.error('❌ Erro ao carregar usuários admin:', error);
    return (
      <div className="flex items-center gap-2">
        <User className="h-3 w-3 text-red-400" />
        <span className="text-xs text-red-400">Erro ao carregar usuários: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <User className="h-3 w-3 text-gray-400" />
      <span className="text-xs text-gray-400">Responsável:</span>
      {isEditing ? (
        <div className="flex items-center gap-1 flex-1">
          <Select
            value={assignedTo || 'unassigned'}
            onValueChange={handleAssigneeChange}
          >
            <SelectTrigger className="h-6 text-xs bg-gray-600 border-gray-500 flex-1">
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
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => setIsEditing(false)}
          >
            ×
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-1 flex-1">
          <span className="text-xs text-white flex-1">
            {isLoading ? 'Carregando...' : getAssignedUserName(assignedTo || '')}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => setIsEditing(true)}
            disabled={isLoading}
          >
            <Edit3 className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};
