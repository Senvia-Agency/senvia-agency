
import { Badge } from "@/components/ui/badge";

interface LeadBadgesProps {
  lead: any;
}

const LeadBadges = ({ lead }: LeadBadgesProps) => {
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

  return (
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
  );
};

export default LeadBadges;
