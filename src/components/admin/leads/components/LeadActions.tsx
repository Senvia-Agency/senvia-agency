
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LeadActionsProps {
  lead: any;
  editingStatus: string | null;
  onStatusEdit: (leadId: string) => void;
  onStatusUpdate: (leadId: string, status: string) => void;
}

const LeadActions = ({ 
  lead, 
  editingStatus, 
  onStatusEdit, 
  onStatusUpdate
}: LeadActionsProps) => {
  return (
    <div className="flex items-center gap-2">
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
      ) : null}
    </div>
  );
};

export default LeadActions;
