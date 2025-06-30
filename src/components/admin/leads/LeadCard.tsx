
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Globe, 
  Calendar, 
  Edit, 
  CreditCard,
  Euro,
  Target,
  Package
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LeadCardProps {
  lead: any;
  editingStatus: string | null;
  onLeadClick: (lead: any) => void;
  onStatusEdit: (leadId: string) => void;
  onStatusUpdate: (leadId: string, status: string) => void;
  onPaymentManage?: (lead: any) => void;
}

const LeadCard = ({ 
  lead, 
  editingStatus, 
  onLeadClick, 
  onStatusEdit, 
  onStatusUpdate,
  onPaymentManage
}: LeadCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'qualified': return 'bg-purple-500';
      case 'converted': return 'bg-green-500';
      case 'lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Novo';
      case 'contacted': return 'Contactado';
      case 'qualified': return 'Qualificado';
      case 'converted': return 'Convertido';
      case 'lost': return 'Perdido';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'partial': return 'bg-orange-500';
      case 'paid': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'partial': return 'Parcial';
      case 'paid': return 'Pago';
      case 'overdue': return 'Em Atraso';
      default: return status;
    }
  };

  const remainingAmount = (lead.total_value || 0) - (lead.paid_amount || 0);

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
            
            <div className="flex flex-wrap gap-1">
              <Badge className={`${getStatusColor(lead.lead_status)} text-white text-xs`}>
                {getStatusLabel(lead.lead_status)}
              </Badge>
              
              {lead.payment_status && (
                <Badge className={`${getPaymentStatusColor(lead.payment_status)} text-white text-xs`}>
                  {getPaymentStatusLabel(lead.payment_status)}
                </Badge>
              )}
              
              <Badge variant="outline" className="border-blue-500 text-blue-500 text-xs">
                {lead.source_page === 'landing_page_basic' ? 'LP Básica' : 'LP Premium'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3 text-gray-500" />
              <span className="truncate">{lead.email}</span>
            </div>
            
            {lead.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-gray-500" />
                <span>{lead.phone}</span>
              </div>
            )}
            
            {lead.company_name && (
              <div className="flex items-center gap-2">
                <Building className="h-3 w-3 text-gray-500" />
                <span className="truncate">{lead.company_name}</span>
              </div>
            )}
            
            {lead.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3 text-gray-500" />
                <span className="truncate">{lead.website}</span>
              </div>
            )}
          </div>

          {/* Objetivo e Produto/Serviço */}
          {(lead.objective || lead.main_product_service) && (
            <div className="mt-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-300">
                {lead.objective && (
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-senvia-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-200">Objetivo:</span>
                      <p className="mt-1 text-gray-300">{lead.objective}</p>
                    </div>
                  </div>
                )}
                {lead.main_product_service && (
                  <div className="flex items-start gap-2">
                    <Package className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-200">Produto/Serviço:</span>
                      <p className="mt-1 text-gray-300">{lead.main_product_service}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Info */}
          {(lead.total_value > 0 || lead.paid_amount > 0) && (
            <div className="mt-3 p-2 bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Pagamento:</span>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">€{(lead.paid_amount || 0).toFixed(2)}</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-white">€{(lead.total_value || 0).toFixed(2)}</span>
                  {remainingAmount > 0 && (
                    <span className="text-yellow-500 ml-2">
                      (Faltam €{remainingAmount.toFixed(2)})
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>Criado em {format(new Date(lead.created_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
          </div>
        </div>

        {/* Actions */}
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
      </div>
    </div>
  );
};

export default LeadCard;
