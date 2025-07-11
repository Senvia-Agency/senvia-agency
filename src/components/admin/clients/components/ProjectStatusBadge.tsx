
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="cursor-pointer">
          <Badge 
            className={`${getStatusColor(status)} text-white text-xs hover:opacity-80 transition-opacity`}
            title="Clique para alterar o status"
          >
            {getStatusLabel(status)}
          </Badge>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-1 bg-gray-700 border-gray-600 z-[9999]" align="start" side="bottom" sideOffset={5}>
         <div className="flex flex-col gap-1">
           {statusOptions.map((option) => (
             <Button
               key={option.value}
               variant="ghost"
               size="sm"
               className="justify-start text-xs h-8 text-white hover:bg-gray-600"
               onPointerDown={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 console.log('ProjectStatusBadge: Clicando para atualizar status', { saleId, newStatus: option.value });
                 onStatusUpdate(saleId, option.value as SaleStatus);
                 setIsOpen(false);
               }}
               onMouseDown={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
               }}
             >
              {option.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
