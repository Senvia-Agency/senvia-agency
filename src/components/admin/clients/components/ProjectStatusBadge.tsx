
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  const [isOpen, setIsOpen] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pendente' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'in_progress', label: 'Em Progresso' },
    { value: 'completed', label: 'Concluído' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  const handleStatusChange = (newStatus: SaleStatus) => {
    onStatusUpdate(saleId, newStatus);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Badge 
        className={`${getStatusColor(status)} text-white text-xs hover:opacity-80 transition-opacity cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
        title="Clique para alterar o status"
      >
        {getStatusLabel(status)}
      </Badge>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg z-[9999] min-w-[120px]">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              className="w-full text-left px-3 py-2 text-xs text-white hover:bg-gray-600 first:rounded-t-md last:rounded-b-md"
              onClick={() => handleStatusChange(option.value as SaleStatus)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
