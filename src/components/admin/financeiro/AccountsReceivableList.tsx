
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";
import { AccountReceivable } from "@/hooks/useAccountsReceivable";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PaymentModal from "./PaymentModal";

interface AccountsReceivableListProps {
  accounts: AccountReceivable[];
  onMarkAsPaid?: (accountId: string) => void;
}

const AccountsReceivableList = ({ accounts, onMarkAsPaid }: AccountsReceivableListProps) => {
  const { toast } = useToast();
  const [selectedAccount, setSelectedAccount] = useState<AccountReceivable | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleSendReminder = async (account: AccountReceivable) => {
    try {
      // Registrar atividade no histórico
      const { error } = await supabase
        .from('activity_history')
        .insert({
          action: 'communication',
          entity_id: account.id,
          entity_type: 'sale',
          description: `Lembrete de pagamento enviado para ${account.customer_name}`,
          metadata: {
            sale_number: account.sale_number,
            remaining_amount: account.remaining_amount,
            customer_email: account.customer_email
          }
        });

      if (error) throw error;

      toast({
        title: "✅ Lembrete enviado",
        description: `Lembrete de pagamento enviado para ${account.customer_name}`,
      });
    } catch (error: any) {
      console.error('Erro ao enviar lembrete:', error);
      toast({
        title: "❌ Erro ao enviar lembrete",
        description: "Não foi possível registrar o lembrete.",
        variant: "destructive"
      });
    }
  };

  const handleOpenPaymentModal = (account: AccountReceivable) => {
    setSelectedAccount(account);
    setIsPaymentModalOpen(true);
  };

  return (
    <>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Contas a Receber ({accounts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {accounts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>Nenhuma conta a receber no momento!</p>
                <p className="text-sm">Todos os pagamentos estão em dia.</p>
              </div>
            ) : (
              accounts.map((account) => (
                <div 
                  key={account.id} 
                  className="flex justify-between items-center py-3 px-4 rounded hover:bg-gray-700/50 transition-colors border border-gray-700"
                >
                  <div className="flex items-center gap-6 flex-1">
                    <span className="text-white font-medium min-w-[200px]">
                      {account.customer_name}
                    </span>
                    <span className="text-yellow-400 font-semibold text-lg">
                      €{account.remaining_amount.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
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
                      onClick={() => handleOpenPaymentModal(account)}
                      className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Pago
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <PaymentModal
        account={selectedAccount}
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedAccount(null);
        }}
      />
    </>
  );
};

export default AccountsReceivableList;
