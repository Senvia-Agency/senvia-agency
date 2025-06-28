
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Edit, UserCheck } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { getStatusIcon, getStatusColor, getSourceLabel, getStatusLabel } from "../../../utils/leadUtils";

interface LeadCardProps {
  lead: any;
  onView: (lead: any) => void;
  onEdit: (lead: any) => void;
  onConvert: (lead: any) => void;
}

const LeadCard = ({ lead, onView, onEdit, onConvert }: LeadCardProps) => {
  return (
    <Card className="bg-gray-700 border-gray-600 hover:bg-gray-600 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-white">{lead.full_name}</h3>
              <Badge 
                variant="outline" 
                className={cn("", lead.source_page === 'landing_page_basic' ? 'border-senvia-500 text-senvia-400' : 'border-purple-500 text-purple-400')}
              >
                {getSourceLabel(lead.source_page)}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-gray-300">
              <div>
                <span className="text-gray-400">Email:</span> {lead.email}
              </div>
              {lead.phone && (
                <div>
                  <span className="text-gray-400">Telefone:</span> {lead.phone}
                </div>
              )}
              {lead.company_name && (
                <div>
                  <span className="text-gray-400">Empresa:</span> {lead.company_name}
                </div>
              )}
              <div>
                <span className="text-gray-400">Data:</span> {format(new Date(lead.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={cn("flex items-center gap-1", getStatusColor(lead.lead_status))}>
              {getStatusIcon(lead.lead_status)}
              {getStatusLabel(lead.lead_status)}
            </Badge>
            {lead.converted && (
              <Badge variant="default" className="bg-green-600">
                Convertido
              </Badge>
            )}
            {lead.payment_status === 'paid' && (
              <Badge variant="default" className="bg-blue-600">
                Pago
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(lead)}
            className="border-gray-600 text-gray-300 hover:bg-gray-600"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(lead)}
            className="border-gray-600 text-gray-300 hover:bg-gray-600"
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          {!lead.converted && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onConvert(lead)}
              className="border-senvia-500 text-senvia-400 hover:bg-senvia-500 hover:text-black"
            >
              <UserCheck className="h-4 w-4 mr-1" />
              Converter
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadCard;
