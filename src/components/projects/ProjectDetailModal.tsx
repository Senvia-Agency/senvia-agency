
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Euro, User, AlertTriangle, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  sale_number: string;
  service_name: string;
  service_description?: string;
  total_value: number;
  paid_amount: number;
  sale_status: string;
  payment_status: string;
  sale_date: string;
  expected_delivery_date?: string;
  delivered_at?: string;
  assigned_to?: string;
  customers?: {
    full_name: string;
    email: string;
    phone?: string;
    company_name?: string;
  };
}

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const ProjectDetailModal = ({ project, isOpen, onClose, onUpdate }: ProjectDetailModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [editedProject, setEditedProject] = useState<Partial<Project>>({});
  const [cancelReason, setCancelReason] = useState("");
  const [shouldRefund, setShouldRefund] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);

  if (!project) return null;

  const handleUpdate = async () => {
    if (!editedProject || Object.keys(editedProject).length === 0) {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('sales')
        .update(editedProject)
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: "Projeto atualizado",
        description: "As alterações foram salvas com sucesso.",
      });

      onUpdate();
      onClose();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar projeto",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'in_progress': return 'Em Progresso';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl text-white">
                {project.service_name}
              </DialogTitle>
              <p className="text-gray-400 mt-1">Projeto #{project.sale_number}</p>
            </div>
            <Badge className={getStatusColor(project.sale_status)}>
              {getStatusLabel(project.sale_status)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Cliente */}
          {project.customers && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Cliente
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Nome:</span>
                  <p>{project.customers.company_name || project.customers.full_name}</p>
                </div>
                <div>
                  <span className="text-gray-400">Email:</span>
                  <p>{project.customers.email}</p>
                </div>
                {project.customers.phone && (
                  <div>
                    <span className="text-gray-400">Telefone:</span>
                    <p>{project.customers.phone}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Informações do Projeto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="service_name">Nome do Serviço</Label>
                <Input
                  id="service_name"
                  defaultValue={project.service_name}
                  onChange={(e) => setEditedProject({...editedProject, service_name: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div>
                <Label htmlFor="service_description">Descrição</Label>
                <Textarea
                  id="service_description"
                  defaultValue={project.service_description || ''}
                  rows={3}
                  onChange={(e) => setEditedProject({...editedProject, service_description: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div>
                <Label htmlFor="sale_status">Status do Projeto</Label>
                <Select
                  defaultValue={project.sale_status}
                  onValueChange={(value) => setEditedProject({...editedProject, sale_status: value})}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="in_progress">Em Progresso</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="total_value">Valor Total</Label>
                  <Input
                    id="total_value"
                    type="number"
                    step="0.01"
                    defaultValue={project.total_value}
                    onChange={(e) => setEditedProject({...editedProject, total_value: parseFloat(e.target.value)})}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor="paid_amount">Valor Pago</Label>
                  <Input
                    id="paid_amount"
                    type="number"
                    step="0.01"
                    defaultValue={project.paid_amount}
                    onChange={(e) => setEditedProject({...editedProject, paid_amount: parseFloat(e.target.value)})}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="expected_delivery_date">Data de Entrega Prevista</Label>
                <Input
                  id="expected_delivery_date"
                  type="date"
                  defaultValue={project.expected_delivery_date ? project.expected_delivery_date.split('T')[0] : ''}
                  onChange={(e) => setEditedProject({...editedProject, expected_delivery_date: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              {/* Informações de Data */}
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Criado em: {format(new Date(project.sale_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                </div>
                {project.delivered_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-400" />
                    <span>Entregue em: {format(new Date(project.delivered_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-between pt-4 border-t border-gray-600">
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

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="border-gray-600 text-gray-300">
                Fechar
              </Button>
              <Button onClick={handleUpdate} disabled={isLoading} className="bg-senvia-500 hover:bg-senvia-600">
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
