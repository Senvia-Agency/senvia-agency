
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, Euro } from "lucide-react";
import { useRecurringReceivables, useMarkReceivableAsPaid } from "@/hooks/useRecurringServices";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RecurringReceivablesList = () => {
  const { data: receivables, isLoading } = useRecurringReceivables();
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
        notes: notes
      }
    });

    // Reset form
    setSelectedReceivable(null);
    setPaymentMethod("");
    setNotes("");
    setPaidDate(new Date().toISOString().split('T')[0]);
  };

  if (isLoading) {
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

  if (!receivables || receivables.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Contas Recorrentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            Nenhuma conta recorrente encontrada
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
          Contas Recorrentes ({receivables.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
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
                  {getStatusBadge(receivable.status)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-3">
                <div>
                  <span className="font-medium">Vencimento:</span>
                  <br />
                  {new Date(receivable.due_date).toLocaleDateString('pt-PT')}
                </div>
                <div>
                  <span className="font-medium">Período:</span>
                  <br />
                  {new Date(receivable.billing_period_start).toLocaleDateString('pt-PT')} - {new Date(receivable.billing_period_end).toLocaleDateString('pt-PT')}
                </div>
              </div>

              {receivable.status === 'pending' || receivable.status === 'overdue' ? (
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
              ) : receivable.status === 'paid' ? (
                <div className="text-sm text-gray-400">
                  <strong>Pago em:</strong> {receivable.paid_date ? new Date(receivable.paid_date).toLocaleDateString('pt-PT') : 'N/A'}
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
      </CardContent>
    </Card>
  );
};

export default RecurringReceivablesList;
