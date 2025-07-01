
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "./types";

interface ProjectCancellationProps {
  project: Project;
  onUpdate: () => void;
  onClose: () => void;
}

export const ProjectCancellation = ({ project, onUpdate, onClose }: ProjectCancellationProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [shouldRefund, setShouldRefund] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast({
        title: "Motivo obrigatório",
        description: "É obrigatório informar o motivo do cancelamento.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Atualizar o projeto para cancelado
      const { error: updateError } = await supabase
        .from('sales')
        .update({
          sale_status: 'cancelled',
          internal_notes: `CANCELADO: ${cancelReason}${project.internal_notes ? '\n\n' + project.internal_notes : ''}`
        })
        .eq('id', project.id);

      if (updateError) throw updateError;

      // Se houver estorno
      if (shouldRefund && refundAmount > 0) {
        // Criar movimento financeiro de estorno
        const { error: refundError } = await supabase
          .from('financial_movements')
          .insert({
            movement_type: 'despesa',
            amount: refundAmount,
            description: `Estorno - Projeto #${project.sale_number}`,
            category: 'estorno',
            movement_date: new Date().toISOString().split('T')[0],
            customer_id: project.customers ? undefined : null,
            notes: `Motivo do estorno: ${cancelReason}`
          });

        if (refundError) throw refundError;

        // Atualizar o valor pago no projeto
        const newPaidAmount = Math.max(0, project.paid_amount - refundAmount);
        const { error: paymentUpdateError } = await supabase
          .from('sales')
          .update({
            paid_amount: newPaidAmount
          })
          .eq('id', project.id);

        if (paymentUpdateError) throw paymentUpdateError;
      }

      toast({
        title: "Projeto cancelado",
        description: shouldRefund ? 
          `Projeto cancelado com estorno de €${refundAmount.toFixed(2)}` : 
          "Projeto cancelado com sucesso.",
      });

      onUpdate();
      onClose();
    } catch (error: any) {
      toast({
        title: "Erro ao cancelar projeto",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          className="flex items-center gap-2"
          disabled={project.sale_status === 'cancelled'}
        >
          <AlertTriangle className="h-4 w-4" />
          Cancelar Projeto
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-800 border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Cancelar Projeto</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            Esta ação não pode ser desfeita. O projeto será marcado como cancelado.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="cancel_reason" className="text-white">
              Motivo do cancelamento *
            </Label>
            <Textarea
              id="cancel_reason"
              placeholder="Descreva o motivo do cancelamento..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white mt-2"
              rows={3}
            />
          </div>

          {project.paid_amount > 0 && (
            <div className="space-y-3 p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="refund"
                  checked={shouldRefund}
                  onCheckedChange={(checked) => {
                    setShouldRefund(!!checked);
                    if (!checked) setRefundAmount(0);
                  }}
                />
                <Label htmlFor="refund" className="text-white">
                  Realizar estorno do valor pago
                </Label>
              </div>
              
              {shouldRefund && (
                <div>
                  <Label htmlFor="refund_amount" className="text-white">
                    Valor do estorno (máx. €{project.paid_amount.toFixed(2)})
                  </Label>
                  <Input
                    id="refund_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    max={project.paid_amount}
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(Math.min(parseFloat(e.target.value) || 0, project.paid_amount))}
                    className="bg-gray-600 border-gray-500 text-white mt-2"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-600 text-white border-gray-500">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={!cancelReason.trim() || isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Cancelando...' : 'Confirmar Cancelamento'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
