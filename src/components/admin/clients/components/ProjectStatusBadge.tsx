
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit3 } from "lucide-react";

type SaleStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

interface ProjectStatusBadgeProps {
  status: SaleStatus;
  saleId: string;
  onStatusUpdate: (saleId: string, newStatus: SaleStatus) => void;
}

const getStatusColor = (status: SaleStatus) => {
  const colorMap: { [key in SaleStatus]: string } = {
    'pending': 'bg-yellow-500',
    'confirmed': 'bg-blue-500',
    'in_progress': 'bg-orange-500',
    'completed': 'bg-green-500',
    'cancelled': 'bg-red-500'
  };
  return colorMap[status];
};

const getStatusLabel = (status: SaleStatus) => {
  const statusMap: { [key in SaleStatus]: string } = {
    'pending': 'Pendente',
    'confirmed': 'Confirmado',
    'in_progress': 'Em Progresso',
    'completed': 'Concluído',
    'cancelled': 'Cancelado'
  };
  return statusMap[status];
};

export const ProjectStatusBadge = ({ status, saleId, onStatusUpdate }: ProjectStatusBadgeProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    onStatusUpdate(saleId, newStatus as SaleStatus);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-28 h-6 text-xs bg-gray-600 border-gray-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="confirmed">Confirmado</SelectItem>
            <SelectItem value="in_progress">Em Progresso</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
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
    );
  }

  return (
    <div className="flex gap-1 ml-2">
      <Badge className={`${getStatusColor(status)} text-white text-xs px-2 py-1`}>
        {getStatusLabel(status)}
      </Badge>
      <Button
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0 ml-1"
        onClick={() => setIsEditing(true)}
      >
        <Edit3 className="h-3 w-3" />
      </Button>
    </div>
  );
};
