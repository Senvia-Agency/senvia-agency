
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Sale } from "@/hooks/sales/types";
import { getPaymentStatusLabel, getPaymentStatusColorWithOpacity } from "@/utils/saleStatusUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SaleCardProps {
  sale: Sale;
  onViewDetails: (sale: Sale) => void;
  onConvertToRecurring?: (sale: Sale) => void;
  onEdit?: (sale: Sale) => void;
  onDelete?: (sale: Sale) => void;
}

const SaleCard = ({ sale, onViewDetails, onConvertToRecurring, onEdit, onDelete }: SaleCardProps) => {

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
          <span className="text-sm text-white truncate block flex items-center gap-2">
            {sale.service_name}
            {sale.is_recurring && (
              <Badge className="bg-senvia-500/20 text-senvia-500 text-xs">
                <RefreshCw className="w-3 h-3 mr-1" />
                Recorrente
              </Badge>
            )}
          </span>
        </div>

        {/* Valor - Alinhado à direita para combinar com o cabeçalho */}
        <div className="flex-shrink-0 w-24 text-right">
          <span className="text-sm font-medium text-green-400">
            €{sale.total_value}
          </span>
        </div>

        {/* Status - Centralizado para combinar com o cabeçalho */}
        <div className="flex-shrink-0 w-24 flex justify-center">
          <Badge variant="outline" className={`${getPaymentStatusColorWithOpacity(sale.payment_status)} text-xs`}>
            {getPaymentStatusLabel(sale.payment_status)}
          </Badge>
        </div>

        {/* Data da Venda - Alinhada à direita para combinar com o cabeçalho */}
        <div className="flex-shrink-0 w-20 text-right">
          <span className="text-sm text-gray-400">
            {format(new Date(sale.sale_date), 'dd/MM/yy', { locale: ptBR })}
          </span>
        </div>

        {/* Menu de Ações */}
        <div className="flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700" align="end">
              <DropdownMenuItem 
                onClick={() => onViewDetails(sale)}
                className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalhes
              </DropdownMenuItem>
              {onEdit && (
                <DropdownMenuItem 
                  onClick={() => onEdit(sale)}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
              )}
              {onDelete && sale.payment_status !== 'cancelled' && (
                <DropdownMenuItem 
                  onClick={() => onDelete(sale)}
                  className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default SaleCard;
