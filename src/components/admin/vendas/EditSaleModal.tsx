import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useUpdateSale } from "@/hooks/sales/useUpdateSale";
import { useToast } from "@/hooks/use-toast";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { User, Package, DollarSign, Calendar } from "lucide-react";

interface EditSaleModalProps {
  sale: any;
  isOpen: boolean;
  onClose: () => void;
  onSaleUpdated: () => void;
}

const EditSaleModal = ({ sale, isOpen, onClose, onSaleUpdated }: EditSaleModalProps) => {
  const { toast } = useToast();
  const updateSaleMutation = useUpdateSale();
  const { data: adminUsers } = useAdminUsers();

  const [formData, setFormData] = useState({
    service_name: '',
    service_description: '',
    total_value: '',
    paid_amount: '',
    sale_status: '',
    payment_status: '',
    payment_method: '',
    expected_delivery_date: '',
    notes: '',
    internal_notes: '',
    assigned_to: ''
  });

  useEffect(() => {
    if (sale) {
      setFormData({
        service_name: sale.service_name || '',
        service_description: sale.service_description || '',
        total_value: sale.total_value?.toString() || '',
        paid_amount: sale.paid_amount?.toString() || '',
        sale_status: sale.sale_status || '',
        payment_status: sale.payment_status || '',
        payment_method: sale.payment_method || '',
        expected_delivery_date: sale.expected_delivery_date ? sale.expected_delivery_date.split('T')[0] : '',
        notes: sale.notes || '',
        internal_notes: sale.internal_notes || '',
        assigned_to: sale.assigned_to || ''
      });
    }
  }, [sale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateSaleMutation.mutateAsync({
        id: sale.id,
        updates: {
          service_name: formData.service_name,
          service_description: formData.service_description,
          total_value: Number(formData.total_value),
          paid_amount: Number(formData.paid_amount),
          sale_status: formData.sale_status as any,
          payment_status: formData.payment_status as any,
          payment_method: formData.payment_method,
          expected_delivery_date: formData.expected_delivery_date || undefined,
          notes: formData.notes,
          internal_notes: formData.internal_notes,
          assigned_to: formData.assigned_to === 'unassigned' ? null : formData.assigned_to || null
        }
      });
      
      toast({
        title: "Venda atualizada",
        description: "A venda foi atualizada com sucesso."
      });
      
      onSaleUpdated();
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao atualizar venda",
        description: "Não foi possível atualizar a venda. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (!sale) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gray-800 border-gray-700 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            Editar Venda - {sale.sale_number}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações do Serviço */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Package className="h-5 w-5 text-senvia-500" />
              <h3 className="text-lg font-semibold">Informações do Serviço</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="service_name" className="text-white">Nome do Serviço</Label>
                <Input
                  id="service_name"
                  value={formData.service_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, service_name: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="service_description" className="text-white">Descrição</Label>
                <Textarea
                  id="service_description"
                  value={formData.service_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, service_description: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Valores */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <DollarSign className="h-5 w-5 text-senvia-500" />
              <h3 className="text-lg font-semibold">Valores</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="total_value" className="text-white">Valor Total (€)</Label>
                <Input
                  id="total_value"
                  type="number"
                  step="0.01"
                  value={formData.total_value}
                  onChange={(e) => setFormData(prev => ({ ...prev, total_value: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="paid_amount" className="text-white">Valor Pago (€)</Label>
                <Input
                  id="paid_amount"
                  type="number"
                  step="0.01"
                  value={formData.paid_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, paid_amount: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="payment_method" className="text-white">Método de Pagamento</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Selecionar método" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="card">Cartão</SelectItem>
                    <SelectItem value="transfer">Transferência</SelectItem>
                    <SelectItem value="cash">Dinheiro</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="check">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Status e Responsável */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <User className="h-5 w-5 text-senvia-500" />
              <h3 className="text-lg font-semibold">Status e Responsável</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="sale_status" className="text-white">Status da Venda</Label>
                <Select
                  value={formData.sale_status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, sale_status: value }))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="confirmed">Confirmada</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="payment_status" className="text-white">Status do Pagamento</Label>
                <Select
                  value={formData.payment_status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, payment_status: value }))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="partial">Parcial</SelectItem>
                    <SelectItem value="paid">Pago</SelectItem>
                    <SelectItem value="overdue">Em Atraso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="assigned_to" className="text-white">Responsável</Label>
                <Select
                  value={formData.assigned_to || 'unassigned'}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, assigned_to: value }))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Selecionar responsável" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="unassigned">Não atribuído</SelectItem>
                    {adminUsers?.map((user) => (
                      <SelectItem key={user.user_id} value={user.user_id}>
                        {user.full_name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Data de Entrega */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Calendar className="h-5 w-5 text-senvia-500" />
              <h3 className="text-lg font-semibold">Cronograma</h3>
            </div>
            
            <div>
              <Label htmlFor="expected_delivery_date" className="text-white">Data de Entrega Prevista</Label>
              <Input
                id="expected_delivery_date"
                type="date"
                value={formData.expected_delivery_date}
                onChange={(e) => setFormData(prev => ({ ...prev, expected_delivery_date: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Observações</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="notes" className="text-white">Observações Gerais</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={4}
                  placeholder="Observações visíveis ao cliente..."
                />
              </div>
              
              <div>
                <Label htmlFor="internal_notes" className="text-white">Notas Internas</Label>
                <Textarea
                  id="internal_notes"
                  value={formData.internal_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, internal_notes: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={4}
                  placeholder="Notas internas da equipe..."
                />
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-600">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateSaleMutation.isPending}
              className="bg-senvia-500 hover:bg-senvia-400 text-black"
            >
              {updateSaleMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSaleModal;