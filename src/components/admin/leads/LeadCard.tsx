
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
      <CardContent className="p-4 md:p-6">
        <div className="space-y-3 md:space-y-0 md:flex md:items-center md:justify-between">
          {/* Informações Principais - Stack no mobile */}
          <div className="min-w-0 flex-1 space-y-2 md:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <h3 className="font-semibold text-white text-base md:text-lg min-w-0 truncate">
                {lead.full_name || lead.company_name || 'Nome não informado'}
              </h3>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs w-fit flex-shrink-0", 
                  lead.source_page === 'landing_page_basic' 
                    ? 'border-senvia-500 text-senvia-400' 
                    : 'border-purple-500 text-purple-400'
                )}
              >
                {getSourceLabel(lead.source_page)}
              </Badge>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 md:gap-6 text-xs md:text-sm text-gray-400">
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                <span className="truncate">{lead.email || 'N/A'}</span>
              </div>
              
              {lead.phone && (
                <div className="flex items-center gap-2 min-w-0">
                  <Phone className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                  <span className="truncate">{lead.phone}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <CalendarIcon className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{format(new Date(lead.created_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
              </div>
            </div>
          </div>

          {/* Status Clicável - Melhor posicionamento no mobile */}
          <div className="flex justify-end md:justify-start">
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
                  <SelectTrigger className="w-28 sm:w-32 bg-gray-700 border-gray-600 text-white h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 z-50">
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
                    "cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 border text-xs",
                    getStatusColor(lead.lead_status)
                  )}
                >
                  {getStatusIcon(lead.lead_status)}
                  <span className="hidden sm:inline">{getStatusLabel(lead.lead_status)}</span>
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
