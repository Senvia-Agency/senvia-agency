
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Euro } from "lucide-react";

interface LeadActionsProps {
  lead: any;
  editingStatus: string | null;
  onStatusEdit: (leadId: string) => void;
  onStatusUpdate: (leadId: string, status: string) => void;
  onPaymentManage?: (lead: any) => void;
}

const LeadActions = ({ 
  lead, 
  editingStatus, 
  onStatusEdit, 
  onStatusUpdate,
  onPaymentManage
}: LeadActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      {/* Payment Management Button */}
      {onPaymentManage && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPaymentManage(lead)}
          className="border-senvia-500 text-senvia-500 hover:bg-senvia-500 hover:text-black"
        >
          <Euro className="h-4 w-4" />
        </Button>
      )}

      {/* Status Management */}
      {editingStatus === lead.id ? (
        <Select
          value={lead.lead_status}
          onValueChange={(value) => onStatusUpdate(lead.id, value)}
        >
          <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">Novo</SelectItem>
            <SelectItem value="contacted">Contactado</SelectItem>
            <SelectItem value="qualified">Qualificado</SelectItem>
            <SelectItem value="converted">Convertido</SelectItem>
            <SelectItem value="lost">Perdido</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onStatusEdit(lead.id)}
          className="border-gray-600 text-gray-300 hover:bg-gray-600"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default LeadActions;
