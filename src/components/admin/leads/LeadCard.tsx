
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { getStatusIcon, getStatusColor, getSourceLabel, getStatusLabel } from "../../../utils/leadUtils";

interface LeadCardProps {
  lead: any;
  editingStatus: string | null;
  onLeadClick: (lead: any) => void;
  onStatusEdit: (leadId: string) => void;
  onStatusUpdate: (leadId: string, status: string) => void;
}

const LeadCard = ({ 
  lead, 
  editingStatus, 
  onLeadClick, 
  onStatusEdit, 
  onStatusUpdate 
}: LeadCardProps) => {
  return (
    <Card 
      className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all cursor-pointer hover:bg-gray-750"
      onClick={() => onLeadClick(lead)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 flex-1">
            {/* Informações Principais */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-white text-lg">
                  {lead.full_name || lead.company_name || 'Nome não informado'}
                </h3>
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", lead.source_page === 'landing_page_basic' ? 'border-senvia-500 text-senvia-400' : 'border-purple-500 text-purple-400')}
                >
                  {getSourceLabel(lead.source_page)}
                </Badge>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{lead.email || 'N/A'}</span>
                </div>
                
                {lead.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{lead.phone}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{format(new Date(lead.created_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
                </div>
              </div>
            </div>

            {/* Status Clicável */}
            <div 
              className="flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                onStatusEdit(lead.id);
              }}
            >
              {editingStatus === lead.id ? (
                <Select 
                  value={lead.lead_status} 
                  onValueChange={(value) => onStatusUpdate(lead.id, value)}
                >
                  <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="new">Novo</SelectItem>
                    <SelectItem value="contacted">Contatado</SelectItem>
                    <SelectItem value="qualified">Qualificado</SelectItem>
                    <SelectItem value="converted">Convertido</SelectItem>
                    <SelectItem value="lost">Perdido</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge 
                  className={cn(
                    "cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2 px-3 py-1 border",
                    getStatusColor(lead.lead_status)
                  )}
                >
                  {getStatusIcon(lead.lead_status)}
                  {getStatusLabel(lead.lead_status)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadCard;
