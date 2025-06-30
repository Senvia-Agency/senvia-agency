
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateSale } from "@/hooks/useSales";
import { useCustomers } from "@/hooks/useCustomers";
import { useCustomServices } from "@/hooks/useCustomServices";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CreateSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateSaleModal = ({ isOpen, onClose }: CreateSaleModalProps) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    service_type: 'manual' as 'stripe_product' | 'custom_service' | 'manual',
    service_id: '',
    service_name: '',
    service_description: '',
    total_value: '',
    paid_amount: '',
    payment_method: '',
    sale_status: 'pending' as const,
    payment_status: 'pending' as const,
    notes: '',
    expected_delivery_date: ''
  });

  const createSaleMutation = useCreateSale();
  const { data: customers } = useCustomers();
  const { data: customServices } = useCustomServices();
  
  const { data: stripeProducts } = useQuery({
    queryKey: ['stripe-products-for-sale'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true);
      
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createSaleMutation.mutateAsync({
        customer_id: formData.customer_id || undefined,
        service_type: formData.service_type,
        service_id: formData.service_id || undefined,
        service_name: formData.service_name,
        service_description: formData.service_description,
        total_value: Number(formData.total_value),
        paid_amount: Number(formData.paid_amount) || 0,
        payment_method: formData.payment_method,
        sale_status: formData.sale_status,
        payment_status: formData.payment_status,
        notes: formData.notes,
        expected_delivery_date: formData.expected_delivery_date || undefined,
        sale_date: new Date().toISOString(),
        commission_rate: 0
      });
      
      onClose();
      setFormData({
        customer_id: '',
        service_type: 'manual',
        service_id: '',
        service_name: '',
        service_description: '',
        total_value: '',
        paid_amount: '',
        payment_method: '',
        sale_status: 'pending',
        payment_status: 'pending',
        notes: '',
        expected_delivery_date: ''
      });
    } catch (error) {
      console.error('Erro ao criar venda:', error);
    }
  };

  const handleServiceTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      service_type: value as any,
      service_id: '',
      service_name: '',
      service_description: '',
      total_value: ''
    }));
  };

  const handleServiceSelect = (serviceId: string) => {
    setFormData(prev => ({ ...prev, service_id: serviceId }));
    
    if (formData.service_type === 'custom_service') {
      const service = customServices?.find(s => s.id === serviceId);
      if (service) {
        setFormData(prev => ({
          ...prev,
          service_name: service.name,
          service_description: service.description || '',
          total_value: service.base_price.toString()
        }));
      }
    } else if (formData.service_type === 'stripe_product') {
      const product = stripeProducts?.find(p => p.id === serviceId);
      if (product) {
        setFormData(prev => ({
          ...prev,
          service_name: product.name,
          service_description: product.description || ''
        }));
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Nova Venda</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cliente */}
          <div>
            <Label className="text-gray-300">Cliente (Opcional)</Label>
            <Select value={formData.customer_id} onValueChange={(value) => setFormData(prev => ({ ...prev, customer_id: value }))}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Selecionar cliente existente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Venda direta (sem cliente)</SelectItem>
                {customers?.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.full_name} - {customer.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de Serviço */}
          <div>
            <Label className="text-gray-300">Tipo de Serviço</Label>
            <Select value={formData.service_type} onValueChange={handleServiceTypeChange}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Serviço Manual</SelectItem>
                <SelectItem value="custom_service">Serviço Personalizado</SelectItem>
                <SelectItem value="stripe_product">Produto do Stripe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Seleção de Serviço */}
          {formData.service_type === 'custom_service' && (
            <div>
              <Label className="text-gray-300">Serviço Personalizado</Label>
              <Select value={formData.service_id} onValueChange={handleServiceSelect}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecionar serviço" />
                </SelectTrigger>
                <SelectContent>
                  {customServices?.filter(s => s.status === 'active').map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - €{service.base_price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.service_type === 'stripe_product' && (
            <div>
              <Label className="text-gray-300">Produto do Stripe</Label>
              <Select value={formData.service_id} onValueChange={handleServiceSelect}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecionar produto" />
                </SelectTrigger>
                <SelectContent>
                  {stripeProducts?.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Nome do Serviço */}
          <div>
            <Label className="text-gray-300">Nome do Serviço *</Label>
            <Input
              value={formData.service_name}
              onChange={(e) => setFormData(prev => ({ ...prev, service_name: e.target.value }))}
              placeholder="Digite o nome do serviço"
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <Label className="text-gray-300">Descrição</Label>
            <Textarea
              value={formData.service_description}
              onChange={(e) => setFormData(prev => ({ ...prev, service_description: e.target.value }))}
              placeholder="Descrição do serviço"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          {/* Valores */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Valor Total (€) *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.total_value}
                onChange={(e) => setFormData(prev => ({ ...prev, total_value: e.target.value }))}
                placeholder="0.00"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            
            <div>
              <Label className="text-gray-300">Valor Pago (€)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.paid_amount}
                onChange={(e) => setFormData(prev => ({ ...prev, paid_amount: e.target.value }))}
                placeholder="0.00"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Status da Venda</Label>
              <Select value={formData.sale_status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, sale_status: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="confirmed">Confirmada</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-gray-300">Status Pagamento</Label>
              <Select value={formData.payment_status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, payment_status: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="partial">Parcial</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="overdue">Em Atraso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Método de Pagamento */}
          <div>
            <Label className="text-gray-300">Método de Pagamento</Label>
            <Select value={formData.payment_method} onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Selecionar método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                <SelectItem value="mbway">MB Way</SelectItem>
                <SelectItem value="cash">Dinheiro</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data de Entrega */}
          <div>
            <Label className="text-gray-300">Data Prevista de Entrega</Label>
            <Input
              type="date"
              value={formData.expected_delivery_date}
              onChange={(e) => setFormData(prev => ({ ...prev, expected_delivery_date: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          {/* Observações */}
          <div>
            <Label className="text-gray-300">Observações</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Observações sobre a venda"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-2 pt-4">
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
              disabled={createSaleMutation.isPending}
              className="bg-senvia-500 hover:bg-senvia-400 text-black"
            >
              {createSaleMutation.isPending ? 'Criando...' : 'Criar Venda'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSaleModal;
