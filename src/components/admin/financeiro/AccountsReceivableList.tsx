
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Mail, Phone, CheckCircle, Calendar, Edit } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AccountReceivable } from "@/hooks/useAccountsReceivable";
import { useToast } from "@/hooks/use-toast";
import EditDueDateModal from "./EditDueDateModal";

interface AccountsReceivableListProps {
  accounts: AccountReceivable[];
  onMarkAsPaid?: (accountId: string) => void;
}

const AccountsReceivableList = ({ accounts, onMarkAsPaid }: AccountsReceivableListProps) => {
  const { toast } = useToast();
  const [selectedAccount, setSelectedAccount] = useState<AccountReceivable | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'partial': return 'bg-orange-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'partial': return 'Parcial';
      case 'overdue': return 'Em Atraso';
      default: return status;
    }
  };

  const handleSendReminder = (account: AccountReceivable) => {
    toast({
      title: "Lembrete enviado",
      description: `Lembrete de pagamento enviado para ${account.customer_name}`,
    });
  };

  const handleCallCustomer = (account: AccountReceivable) => {
    toast({
      title: "Ligação iniciada",
      description: `Preparando ligação para ${account.customer_name}`,
    });
  };

  const handleMarkAsPaid = (account: AccountReceivable) => {
    if (onMarkAsPaid) {
      onMarkAsPaid(account.id);
    }
    toast({
      title: "Pagamento registrado",
      description: `Pagamento de ${account.customer_name} marcado como pago`,
    });
  };

  const handleEditDueDate = (account: AccountReceivable) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-senvia-500" />
            Contas a Receber ({accounts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accounts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>Nenhuma conta a receber no momento!</p>
                <p className="text-sm">Todos os pagamentos estão em dia.</p>
              </div>
            ) : (
              accounts.map((account) => (
                <div key={account.id} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-white truncate">
                          {account.customer_name}
                        </h4>
                        <Badge className={`${getStatusColor(account.payment_status)} text-white text-xs`}>
                          {getStatusLabel(account.payment_status)}
                        </Badge>
                        {account.days_overdue > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">
                            {account.days_overdue} dias atrasado
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300">
                        <div>
                          <span className="text-gray-400">Venda: </span>
                          <span>{account.sale_number}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Serviço: </span>
                          <span className="truncate">{account.service_name}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Data da Venda: </span>
                          <span>{format(new Date(account.sale_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Vencimento: </span>
                          <div className="flex items-center gap-1">
                            <span className={account.days_overdue > 0 ? 'text-red-400' : 'text-gray-300'}>
                              {account.due_date ? format(new Date(account.due_date), 'dd/MM/yyyy', { locale: ptBR }) : 'Não definido'}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditDueDate(account)}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-senvia-500"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-gray-400">Valor Pendente: </span>
                          <span className="font-medium text-yellow-400">€{account.remaining_amount.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Progresso de Pagamento */}
                      <div className="mt-3 p-2 bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-gray-400">Progresso do Pagamento:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-green-500">€{account.paid_amount.toFixed(2)}</span>
                            <span className="text-gray-400">/</span>
                            <span className="text-white">€{account.total_value.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-senvia-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min((account.paid_amount / account.total_value) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendReminder(account)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-600"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Lembrete
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCallCustomer(account)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-600"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Ligar
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsPaid(account)}
                        className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Pago
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <EditDueDateModal
        account={selectedAccount}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAccount(null);
        }}
      />
    </>
  );
};

export default AccountsReceivableList;
