
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import LeadBadges from "./components/LeadBadges";
import LeadContactInfo from "./components/LeadContactInfo";
import LeadPaymentInfo from "./components/LeadPaymentInfo";
import LeadActions from "./components/LeadActions";

interface LeadCardProps {
  lead: any;
  editingStatus: string | null;
  onLeadClick: (lead: any) => void;
  onStatusEdit: (leadId: string) => void;
  onStatusUpdate: (leadId: string, status: string) => void;
  onTemperatureUpdate?: (leadId: string, temperature: string) => void;
  onPaymentManage?: (lead: any) => void;
}

const LeadCard = ({ 
  lead, 
  editingStatus, 
  onLeadClick, 
  onStatusEdit, 
  onStatusUpdate,
  onTemperatureUpdate,
  onPaymentManage
}: LeadCardProps) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Lead Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h3 
              className="font-semibold text-white text-sm md:text-base cursor-pointer hover:text-senvia-500 transition-colors"
              onClick={() => onLeadClick(lead)}
            >
              {lead.full_name || lead.email}
            </h3>
            
            <LeadBadges 
              lead={lead} 
              onStatusUpdate={(leadId, status) => {
                console.log('LeadCard passing status update:', { leadId, status });
                onStatusUpdate(leadId, status);
              }}
              onTemperatureUpdate={onTemperatureUpdate}
            />
          </div>

          <LeadContactInfo lead={lead} />

          <LeadPaymentInfo lead={lead} />

          {/* Plano escolhido */}
          {lead.plan && (
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-1 bg-senvia-500/20 text-senvia-400 rounded text-xs font-medium">
                Plano: {lead.plan}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>Criado em {format(new Date(lead.created_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
          </div>
        </div>

        {/* Actions */}
        <LeadActions
          lead={lead}
          editingStatus={editingStatus}
          onStatusEdit={onStatusEdit}
          onStatusUpdate={onStatusUpdate}
        />
      </div>
    </div>
  );
};

export default LeadCard;
