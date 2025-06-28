
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSyncStripePayments } from "@/hooks/useSyncStripePayments";
import { Loader2, RefreshCw } from "lucide-react";

const SyncPaymentsButton = () => {
  const { toast } = useToast();
  const [isManualSync, setIsManualSync] = useState(false);
  
  const syncMutation = useSyncStripePayments();

  const handleSync = async () => {
    setIsManualSync(true);
    
    try {
      const result = await syncMutation.mutateAsync();
      
      toast({
        title: "Sincronização concluída",
        description: `${result.synced_payments} pagamentos sincronizados, ${result.updated_leads} leads atualizados, ${result.created_customers} clientes criados.`,
      });
    } catch (error) {
      toast({
        title: "Erro na sincronização",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    } finally {
      setIsManualSync(false);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={isManualSync || syncMutation.isPending}
      variant="outline"
      className="border-senvia-500 text-senvia-500 hover:bg-senvia-500 hover:text-white"
    >
      {(isManualSync || syncMutation.isPending) ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <RefreshCw className="h-4 w-4 mr-2" />
      )}
      Sincronizar Pagamentos
    </Button>
  );
};

export default SyncPaymentsButton;
