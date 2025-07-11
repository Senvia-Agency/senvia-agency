export const getSaleStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'Pendente';
    case 'confirmed': return 'Confirmada';
    case 'in_progress': return 'Em Andamento';
    case 'completed': return 'Concluída';
    case 'cancelled': return 'Cancelada';
    default: return status;
  }
};

export const getSaleStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500';
    case 'confirmed': return 'bg-blue-500';
    case 'in_progress': return 'bg-purple-500';
    case 'completed': return 'bg-green-500';
    case 'cancelled': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

export const getSaleStatusColorWithOpacity = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    case 'confirmed': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    case 'in_progress': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
    case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
    case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/50';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  }
};

export const getPaymentStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'Pendente';
    case 'partial': return 'Parcial';
    case 'paid': return 'Pago';
    case 'overdue': return 'Em Atraso';
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
    default: return 'bg-gray-500';
  }
};