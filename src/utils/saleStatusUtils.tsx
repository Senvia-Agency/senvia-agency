export const getPaymentStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'Pendente';
    case 'partial': return 'Parcial';
    case 'paid': return 'Pago';
    case 'overdue': return 'Em Atraso';
    case 'cancelled': return 'Cancelada';
    case 'recurring': return 'Recorrente';
    default: return status;
  }
};

export const getServiceTypeLabel = (serviceType: string) => {
  switch (serviceType) {
    case 'one_time': return 'Único';
    case 'recurring': return 'Recorrente';
    case 'custom': return 'Personalizado';
    case 'subscription': return 'Assinatura';
    default: return serviceType;
  }
};

export const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500';
    case 'partial': return 'bg-orange-500';
    case 'paid': return 'bg-green-500';
    case 'overdue': return 'bg-red-500';
    case 'cancelled': return 'bg-red-500';
    case 'recurring': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
};

export const getPaymentStatusColorWithOpacity = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    case 'partial': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    case 'paid': return 'bg-green-500/20 text-green-400 border-green-500/50';
    case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/50';
    case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/50';
    case 'recurring': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  }
};