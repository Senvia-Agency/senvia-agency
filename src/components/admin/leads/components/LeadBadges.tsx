
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface LeadBadgesProps {
  lead: any;
  onStatusUpdate?: (leadId: string, status: string) => void;
}

const LeadBadges = ({ lead, onStatusUpdate }: LeadBadgesProps) => {
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

  const statusOptions = [
    { value: 'new', label: 'Novo' },
    { value: 'contacted', label: 'Contactado' },
    { value: 'qualified', label: 'Qualificado' },
    { value: 'converted', label: 'Convertido' },
    { value: 'lost', label: 'Perdido' }
  ];

  return (
    <div className="flex flex-wrap gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Badge 
            className={`${getStatusColor(lead.lead_status)} text-white text-xs cursor-pointer hover:opacity-80 transition-opacity`}
            title="Clique para alterar o status"
          >
            {getStatusLabel(lead.lead_status)}
          </Badge>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-1">
          <div className="flex flex-col gap-1">
            {statusOptions.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                size="sm"
                className="justify-start text-xs h-8"
                onClick={() => {
                  console.log('Status option clicked:', option.value, 'for lead:', lead.id);
                  onStatusUpdate?.(lead.id, option.value);
                }}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      
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
