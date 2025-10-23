import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Calendar, DollarSign, Pause, Play, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUpdateRecurringService } from "@/hooks/useRecurringServices";
import { useToast } from "@/hooks/use-toast";

interface RecurringServicesSectionProps {
  customerId: string;
}

export const RecurringServicesSection = ({ customerId }: RecurringServicesSectionProps) => {
  const { toast } = useToast();
  const updateService = useUpdateRecurringService();

  const { data: services, isLoading } = useQuery({
    queryKey: ['customer-recurring-services', customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recurring_services')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handlePause = async (serviceId: string) => {
    await updateService.mutateAsync({
      id: serviceId,
      updates: { status: 'paused' }
    });
  };

  const handleResume = async (serviceId: string) => {
    await updateService.mutateAsync({
      id: serviceId,
      updates: { status: 'active' }
    });
  };

  const handleCancel = async (serviceId: string) => {
    if (confirm('Tem certeza que deseja cancelar este serviço recorrente?')) {
      await updateService.mutateAsync({
        id: serviceId,
        updates: { status: 'cancelled', end_date: new Date().toISOString().split('T')[0] }
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-500">Ativo</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-500/20 text-yellow-500">Pausado</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/20 text-red-500">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="text-gray-400">Carregando...</div>;
  }

  if (!services || services.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Serviços Recorrentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm">Nenhum serviço recorrente ativo.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Serviços Recorrentes ({services.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-4 bg-gray-750 border border-gray-700 rounded-lg space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-white font-medium">{service.service_name}</h4>
                {service.service_description && (
                  <p className="text-sm text-gray-400 mt-1">{service.service_description}</p>
                )}
              </div>
              {getStatusBadge(service.status)}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <DollarSign className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-xs text-gray-500">Valor Mensal</p>
                  <p className="font-semibold">€{Number(service.monthly_amount).toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500">Dia de Cobrança</p>
                  <p className="font-semibold">Dia {service.billing_day}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-xs text-gray-500">Data de Início</p>
                  <p className="text-sm">
                    {new Date(service.start_date).toLocaleDateString('pt-PT')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-xs text-gray-500">Próxima Cobrança</p>
                  <p className="text-sm">
                    {new Date(service.next_billing_date).toLocaleDateString('pt-PT')}
                  </p>
                </div>
              </div>
            </div>

            {service.status === 'active' && (
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePause(service.id)}
                  className="flex-1 bg-yellow-500/10 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/20"
                >
                  <Pause className="w-4 h-4 mr-1" />
                  Pausar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCancel(service.id)}
                  className="flex-1 bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Cancelar
                </Button>
              </div>
            )}

            {service.status === 'paused' && (
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleResume(service.id)}
                  className="flex-1 bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Reativar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCancel(service.id)}
                  className="flex-1 bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};