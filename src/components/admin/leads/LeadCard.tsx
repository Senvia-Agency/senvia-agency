
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
      className="bg-slate-800/80 border-slate-600/50 hover:border-slate-500/50 transition-all cursor-pointer hover:bg-slate-750/80 w-full min-w-0"
      onClick={() => onLeadClick(lead)}
    >
      <CardContent className="p-4 lg:p-6">
        {/* Mobile-First Layout */}
        <div className="space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4">
          {/* Main Info Section */}
          <div className="min-w-0 flex-1 space-y-2 lg:space-y-3">
            {/* Name and Source Badge */}
            <div className="flex items-start gap-2 lg:gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white text-sm lg:text-lg truncate">
                  {lead.full_name || lead.company_name || 'Nome não informado'}
                </h3>
              </div>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs flex-shrink-0 px-2 py-0.5", 
                  lead.source_page === 'landing_page_basic' 
                    ? 'border-senvia-500/50 text-senvia-400 bg-senvia-500/10' 
                    : 'border-purple-500/50 text-purple-400 bg-purple-500/10'
                )}
              >
                {getSourceLabel(lead.source_page)}
              </Badge>
            </div>
            
            {/* Contact Info - Stack on Mobile */}
            <div className="space-y-1 lg:space-y-0 lg:flex lg:items-center lg:gap-4 text-xs lg:text-sm text-slate-400">
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
                <span className="truncate">{lead.email || 'N/A'}</span>
              </div>
              
              {lead.phone && (
                <div className="flex items-center gap-2 min-w-0">
                  <Phone className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
                  <span className="truncate">{lead.phone}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <CalendarIcon className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
                <span>{format(new Date(lead.created_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
              </div>
            </div>
          </div>

          {/* Status Section - Right aligned on desktop, full width on mobile */}
          <div 
            className="flex justify-start lg:justify-end"
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
                <SelectTrigger className="w-full lg:w-32 bg-slate-700/50 border-slate-600/50 text-white text-xs lg:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800/95 border-slate-600/50 backdrop-blur-sm">
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
                  "cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1.5 px-3 py-1.5 border text-xs lg:text-sm whitespace-nowrap",
                  getStatusColor(lead.lead_status)
                )}
              >
                {getStatusIcon(lead.lead_status)}
                <span className="truncate">{getStatusLabel(lead.lead_status)}</span>
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadCard;
