
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSaleStatusLabel, getSaleStatusColor } from "@/utils/saleStatusUtils";

type SaleStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

interface ProjectStatusBadgeProps {
  status: SaleStatus;
  saleId: string;
  onStatusUpdate: (saleId: string, newStatus: SaleStatus) => void;
}


export const ProjectStatusBadge = ({ status, saleId, onStatusUpdate }: ProjectStatusBadgeProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pendente' },
    { value: 'confirmed', label: 'Confirmada' },
    { value: 'in_progress', label: 'Em Andamento' },
    { value: 'completed', label: 'Concluída' },
    { value: 'cancelled', label: 'Cancelada' }
  ];

  const handleStatusChange = (newStatus: SaleStatus) => {
    onStatusUpdate(saleId, newStatus);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Badge 
        className={`${getSaleStatusColor(status)} text-white text-xs hover:opacity-80 transition-opacity cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
        title="Clique para alterar o status"
      >
        {getSaleStatusLabel(status)}
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
