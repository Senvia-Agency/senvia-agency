
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StatusFieldsProps {
  saleStatus: string;
  paymentStatus: string;
  onSaleStatusChange: (value: string) => void;
  onPaymentStatusChange: (value: string) => void;
}

const StatusFields = ({ 
  saleStatus, 
  paymentStatus, 
  onSaleStatusChange, 
  onPaymentStatusChange 
}: StatusFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label className="text-gray-300">Status da Venda</Label>
        <Select value={saleStatus} onValueChange={onSaleStatusChange}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="confirmed">Confirmada</SelectItem>
            <SelectItem value="in_progress">Em Andamento</SelectItem>
            <SelectItem value="completed">Concluída</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label className="text-gray-300">Status Pagamento</Label>
        <Select value={paymentStatus} onValueChange={onPaymentStatusChange}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="partial">Parcial</SelectItem>
            <SelectItem value="paid">Pago</SelectItem>
            <SelectItem value="overdue">Em Atraso</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StatusFields;
