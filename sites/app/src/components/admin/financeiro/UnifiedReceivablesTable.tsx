import { useState } from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UnifiedReceivable } from "@/hooks/useUnifiedReceivables";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PaymentModal from "./PaymentModal";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UnifiedReceivablesTableProps {
  receivables: UnifiedReceivable[];
  onRefresh?: () => void;
}

export default function UnifiedReceivablesTable({ receivables, onRefresh }: UnifiedReceivablesTableProps) {
  const [selectedReceivable, setSelectedReceivable] = useState<UnifiedReceivable | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSendReminder = async (receivable: UnifiedReceivable) => {
    setSendingReminder(receivable.id);
    
    try {
      const { error } = await supabase.functions.invoke('send-notification-email', {
        body: {
          to: receivable.customer_email,
          subject: `Lembrete: Pagamento Pendente - ${receivable.service_name}`,
          type: 'payment_reminder',
          entityType: receivable.type === 'sale' ? 'sale' : 'recurring_receivable',
          entityId: receivable.id,
          data: {
            customer_name: receivable.customer_name,
            service_name: receivable.service_name,
            amount: receivable.remaining_amount,
            due_date: receivable.due_date,
            days_overdue: receivable.days_overdue
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Lembrete enviado!",
        description: `Email de lembrete enviado para ${receivable.customer_email}`,
      });
    } catch (error) {
      console.error('Erro ao enviar lembrete:', error);
      toast({
        title: "Erro ao enviar lembrete",
        description: "Não foi possível enviar o email de lembrete",
        variant: "destructive",
      });
    } finally {
      setSendingReminder(null);
    }
  };

  const handleOpenPaymentModal = (receivable: UnifiedReceivable) => {
    setSelectedReceivable(receivable);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setSelectedReceivable(null);
    setIsPaymentModalOpen(false);
    onRefresh?.();
  };

  // Detectar se é uma receita prevista (gerada pelo sistema, ainda não criada no DB)
  // MAS: se estiver em atraso, permitir pagamento (criará automaticamente o receivable)
  const isPredictedReceivable = (receivable: UnifiedReceivable): boolean => {
    const isPredict = receivable.type === 'recurring' && receivable.id.startsWith('svc-');
    
    // Se for prevista MAS estiver em atraso, permitir pagamento
    if (isPredict && receivable.days_overdue > 0) {
      return false; // Não bloquear - permite pagar contas em atraso mesmo que previstas
    }
    
    return isPredict;
  };

  if (receivables.length === 0) {
    return (
      <div className="border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground text-lg">
          Nenhuma conta a receber no momento
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="text-foreground font-semibold">Nome</TableHead>
              <TableHead className="text-foreground font-semibold">Data Vencimento</TableHead>
              <TableHead className="text-foreground font-semibold">Serviço/Produto</TableHead>
              <TableHead className="text-foreground font-semibold">Valor</TableHead>
              <TableHead className="text-right text-foreground font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receivables.map((item) => (
              <TableRow 
                key={item.id}
                className="hover:bg-muted/50"
              >
                <TableCell className="font-medium">
                  {item.customer_name}
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">
                      {format(new Date(item.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                    {item.days_overdue > 0 && (
                      <Badge variant="destructive" className="text-xs w-fit">
                        {item.days_overdue} dias em atraso
                      </Badge>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{item.service_name}</span>
                    <Badge 
                      variant="outline" 
                      className={
                        item.type === 'sale' 
                          ? 'text-blue-500 border-blue-500' 
                          : 'text-purple-500 border-purple-500'
                      }
                    >
                      {item.type === 'sale' ? 'Venda' : 'Recorrente'}
                    </Badge>
                    {isPredictedReceivable(item) && (
                      <Badge variant="secondary" className="text-xs">
                        Previsto
                      </Badge>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <span className={`font-semibold text-lg ${
                    item.days_overdue > 0 
                      ? 'text-destructive' 
                      : item.type === 'recurring' && item.payment_status === 'pending'
                      ? 'text-blue-500'
                      : 'text-primary'
                  }`}>
                    €{item.remaining_amount.toFixed(2)}
                  </span>
                </TableCell>
                
                <TableCell className="text-right">
                  <TooltipProvider>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendReminder(item)}
                        disabled={sendingReminder === item.id}
                        className="hover:bg-accent"
                      >
                        {sendingReminder === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Mail className="h-4 w-4" />
                        )}
                      </Button>
                      
                      {isPredictedReceivable(item) ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled
                                className="border-muted text-muted-foreground cursor-not-allowed"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-sm">Esta é uma receita prevista.</p>
                            <p className="text-sm">O pagamento só pode ser registrado quando a cobrança for gerada automaticamente.</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenPaymentModal(item)}
                          className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PaymentModal
        account={selectedReceivable}
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
      />
    </>
  );
}
