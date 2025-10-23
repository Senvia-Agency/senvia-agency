
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, Euro, Calendar } from "lucide-react";
import { useRecurringReceivables, useMarkReceivableAsPaid } from "@/hooks/useRecurringServices";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { isAfter, isBefore, startOfDay, format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface RecurringReceivablesListProps {
  dateRange: DateRange | null;
}

const RecurringReceivablesList = ({ dateRange }: RecurringReceivablesListProps) => {
  const { data: allReceivables, isLoading } = useRecurringReceivables();
  
  // Buscar serviços recorrentes ativos para prever próximas cobranças
  const { data: activeServices, isLoading: isLoadingServices } = useQuery({
    queryKey: ['active-recurring-services'],
    queryFn: async () => {
      const today = new Date();
      const todayStr = format(today, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('recurring_services')
        .select(`
          *,
          customers(id, full_name, email)
        `)
        .eq('status', 'active')
        .eq('recurrence_type', 'receita')
        .or(`end_date.is.null,end_date.gte.${todayStr}`);
      
      if (error) throw error;
      return data;
    }
  });
  
  // Filtrar receivables gerados pelo período selecionado
  const receivables = useMemo(() => {
    if (!allReceivables || !dateRange?.from || !dateRange?.to) return allReceivables || [];
    
    const fromDate = startOfDay(dateRange.from);
    const toDate = startOfDay(dateRange.to);
    
    return allReceivables.filter(receivable => {
      const dueDate = startOfDay(new Date(receivable.due_date));
      return dueDate >= fromDate && dueDate <= toDate;
    });
  }, [allReceivables, dateRange]);
  
  // Calcular cobranças previstas (que ainda não foram geradas)
  const forecastedReceivables = useMemo(() => {
    if (!activeServices || !allReceivables) return [];
    
    const today = new Date();
    const existingKeys = new Set(
      allReceivables.map((r: any) => `${r.recurring_service_id}|${format(new Date(r.due_date), 'yyyy-MM-dd')}`)
    );
    
    console.log('🔮 Calculando cobranças previstas...');
    
    const forecasted = activeServices
      .map((service: any) => {
        // Calcular próxima data de cobrança
        let candidateDate: Date;
        
        if (service.next_billing_date) {
          const [year, month, day] = service.next_billing_date.split('-').map(Number);
          candidateDate = new Date(year, month - 1, day);
        } else if (service.billing_day) {
          const currentMonth = today.getMonth();
          const currentYear = today.getFullYear();
          candidateDate = new Date(currentYear, currentMonth, service.billing_day);
          if (candidateDate < today) {
            candidateDate = new Date(currentYear, currentMonth + 1, service.billing_day);
          }
        } else {
          return null;
        }
        
        const candidateDateStr = format(candidateDate, 'yyyy-MM-dd');
        const candidateKey = `${service.id}|${candidateDateStr}`;
        
        // Verificar se já existe uma cobrança gerada para esta data
        if (existingKeys.has(candidateKey)) {
          console.log(`⏭️ Prevista ignorada: ${service.service_name} - ${candidateDateStr} (já gerada)`);
          return null;
        }
        
        // Filtrar por período se dateRange estiver definido
        if (dateRange?.from && dateRange?.to) {
          const fromDate = startOfDay(dateRange.from);
          const toDate = startOfDay(dateRange.to);
          const candidateDateStart = startOfDay(candidateDate);
          
          if (candidateDateStart < fromDate || candidateDateStart > toDate) {
            console.log(`⏭️ Prevista fora do período: ${service.service_name} - ${candidateDateStr}`);
            return null;
          }
        }
        
        console.log(`✅ Prevista incluída: ${service.service_name} - €${service.amount} em ${candidateDateStr}`);
        
        return {
          id: `forecast-${service.id}-${candidateDateStr}`,
          due_date: candidateDateStr,
          amount: service.amount,
          payment_status: 'forecasted' as const,
          customers: service.customers,
          recurring_services: {
            id: service.id,
            service_name: service.service_name
          }
        };
      })
      .filter(Boolean);
    
    console.log(`📊 Total de previstas: ${forecasted.length}`);
    return forecasted;
  }, [activeServices, allReceivables, dateRange]);
  
  const markAsPaid = useMarkReceivableAsPaid();
  
  const [selectedReceivable, setSelectedReceivable] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [paidDate, setPaidDate] = useState(new Date().toISOString().split('T')[0]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case 'paid':
        return <Badge variant="outline" className="text-green-500 border-green-500"><CheckCircle className="h-3 w-3 mr-1" />Pago</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="text-red-500 border-red-500"><AlertTriangle className="h-3 w-3 mr-1" />Atrasado</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-gray-500 border-gray-500">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleMarkAsPaid = async () => {
    if (!selectedReceivable || !paymentMethod) return;

    await markAsPaid.mutateAsync({
      id: selectedReceivable.id,
      paymentData: {
        payment_method: paymentMethod,
        paid_date: paidDate,
        notes: notes,
        amount: selectedReceivable.amount
      }
    });

    // Reset form
    setSelectedReceivable(null);
    setPaymentMethod("");
    setNotes("");
    setPaidDate(new Date().toISOString().split('T')[0]);
  };

  if (isLoading || isLoadingServices) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Contas Recorrentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            Carregando contas recorrentes...
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalItems = receivables.length + forecastedReceivables.length;
  
  console.log(`📋 Contas a mostrar - Geradas: ${receivables.length}, Previstas: ${forecastedReceivables.length}`);

  if (totalItems === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Contas Recorrentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            Nenhuma conta recorrente encontrada para o período selecionado
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Euro className="h-5 w-5" />
          Contas Recorrentes ({totalItems})
          <Badge variant="outline" className="ml-2">
            {receivables.length} Geradas
          </Badge>
          {forecastedReceivables.length > 0 && (
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {forecastedReceivables.length} Previstas
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 max-h-96 overflow-y-auto">
          {/* Seção: Geradas */}
          {receivables.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Geradas ({receivables.length})
              </h3>
              {receivables.map((receivable) => (
            <div key={receivable.id} className="border border-gray-600 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-white">
                    {receivable.customers?.full_name || 'Cliente Direto'}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {receivable.recurring_services?.service_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {receivable.customers?.email}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">
                    €{Number(receivable.amount).toFixed(2)}
                  </div>
                  {getStatusBadge(receivable.payment_status)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-3">
                <div>
                  <span className="font-medium">Vencimento:</span>
                  <br />
                  {new Date(receivable.due_date).toLocaleDateString('pt-PT')}
                </div>
                <div>
                  <span className="font-medium">Serviço:</span>
                  <br />
                  {receivable.recurring_services?.service_name || 'N/A'}
                </div>
              </div>

              {receivable.payment_status === 'pending' || receivable.payment_status === 'overdue' ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      onClick={() => setSelectedReceivable(receivable)}
                      className="w-full"
                    >
                      Marcar como Pago
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Registrar Pagamento</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="payment-method" className="text-gray-300">Método de Pagamento</Label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Selecione o método" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="cash">Dinheiro</SelectItem>
                            <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                            <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="stripe">Stripe</SelectItem>
                            <SelectItem value="other">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="paid-date" className="text-gray-300">Data do Pagamento</Label>
                        <Input
                          id="paid-date"
                          type="date"
                          value={paidDate}
                          onChange={(e) => setPaidDate(e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="notes" className="text-gray-300">Observações (opcional)</Label>
                        <Textarea
                          id="notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Adicione observações sobre o pagamento..."
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      
                      <Button 
                        onClick={handleMarkAsPaid}
                        disabled={!paymentMethod || markAsPaid.isPending}
                        className="w-full"
                      >
                        {markAsPaid.isPending ? "Registrando..." : "Confirmar Pagamento"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : receivable.payment_status === 'paid' ? (
                <div className="text-sm text-gray-400">
                  <strong>Pago em:</strong> {receivable.paid_at ? new Date(receivable.paid_at).toLocaleDateString('pt-PT') : 'N/A'}
                  {receivable.payment_method && (
                    <>
                      <br />
                      <strong>Método:</strong> {receivable.payment_method}
                    </>
                  )}
                </div>
              ) : null}
            </div>
              ))}
            </div>
          )}
          
          {/* Seção: Previstas */}
          {forecastedReceivables.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Previstas ({forecastedReceivables.length})
              </h3>
              {forecastedReceivables.map((forecasted: any) => (
                <div key={forecasted.id} className="border border-blue-500/30 rounded-lg p-4 bg-blue-500/5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-white">
                        {forecasted.customers?.full_name || 'Cliente Direto'}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {forecasted.recurring_services?.service_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {forecasted.customers?.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">
                        €{Number(forecasted.amount).toFixed(2)}
                      </div>
                      <Badge variant="outline" className="text-blue-400 border-blue-400 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        Prevista
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                    <div>
                      <span className="font-medium">Vencimento Previsto:</span>
                      <br />
                      {new Date(forecasted.due_date).toLocaleDateString('pt-PT')}
                    </div>
                    <div>
                      <span className="font-medium">Serviço:</span>
                      <br />
                      {forecasted.recurring_services?.service_name || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-blue-400 bg-blue-500/10 p-2 rounded">
                    💡 Esta cobrança será gerada automaticamente na data prevista
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecurringReceivablesList;
