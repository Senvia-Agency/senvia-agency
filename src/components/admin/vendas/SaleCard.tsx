
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Sale } from "@/hooks/sales/types";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface SaleCardProps {
  sale: Sale;
  onViewDetails: (sale: Sale) => void;
  onConvertToRecurring?: (sale: Sale) => void;
  onEdit?: (sale: Sale) => void;
  onDelete?: (sale: Sale) => void;
}

const SaleCard = ({ sale, onViewDetails, onConvertToRecurring, onEdit, onDelete }: SaleCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Código da Venda */}
        <div className="flex-shrink-0 w-24">
          <span className="text-sm text-gray-400 font-mono">#{sale.sale_number}</span>
        </div>

        {/* Nome do Cliente */}
        <div className="flex-shrink-0 w-48">
          <span className="text-sm text-white truncate block">
            {sale.customers?.full_name || 'Venda Direta'}
          </span>
        </div>

        {/* Nome do Serviço */}
        <div className="flex-1 min-w-0">
          <span className="text-sm text-white truncate block">
            {sale.service_name}
          </span>
        </div>

        {/* Valor */}
        <div className="flex-shrink-0 w-20 text-right">
          <span className="text-sm font-medium text-green-400">
            €{sale.total_value}
          </span>
        </div>

        {/* Status */}
        <div className="flex-shrink-0">
          <Badge variant="outline" className={`${getStatusColor(sale.sale_status)} text-xs`}>
            {getStatusText(sale.sale_status)}
          </Badge>
        </div>

        {/* Data da Venda */}
        <div className="flex-shrink-0 w-24 text-right">
          <span className="text-sm text-gray-400">
            {format(new Date(sale.sale_date), 'dd/MM/yy', { locale: ptBR })}
          </span>
        </div>

        {/* Menu de Ações */}
        <div className="flex-shrink-0">
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </ContextMenuTrigger>
            <ContextMenuContent className="bg-gray-800 border-gray-700">
              <ContextMenuItem 
                onClick={() => onViewDetails(sale)}
                className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalhes
              </ContextMenuItem>
              {onEdit && (
                <ContextMenuItem 
                  onClick={() => onEdit(sale)}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </ContextMenuItem>
              )}
              {onDelete && sale.sale_status !== 'cancelled' && (
                <ContextMenuItem 
                  onClick={() => onDelete(sale)}
                  className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </ContextMenuItem>
              )}
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </div>
    </div>
  );
};

export default SaleCard;
