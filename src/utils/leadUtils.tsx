
import { Clock, Phone, CheckCircle, Crown, XCircle, AlertCircle } from "lucide-react";

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'new': return <Clock className="h-4 w-4" />;
    case 'contacted': return <Phone className="h-4 w-4" />;
    case 'qualified': return <CheckCircle className="h-4 w-4" />;
    case 'converted': return <Crown className="h-4 w-4" />;
    case 'lost': return <XCircle className="h-4 w-4" />;
    default: return <AlertCircle className="h-4 w-4" />;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'contacted': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'qualified': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'converted': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'lost': return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

export const getSourceLabel = (sourcePage: string) => {
  switch (sourcePage) {
    case 'landing_page_basic': return 'Landing Page €4.99';
    case 'landing_page_premium': return 'Landing Page Premium';
    default: return sourcePage;
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'new': return 'Novo';
    case 'contacted': return 'Contatado';
    case 'qualified': return 'Qualificado';
    case 'converted': return 'Convertido';
    case 'lost': return 'Perdido';
    default: return status;
  }
};
