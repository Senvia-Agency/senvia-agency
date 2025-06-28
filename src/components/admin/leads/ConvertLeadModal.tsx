
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ConvertLeadModalProps {
  lead: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ConvertLeadModal = ({ lead, isOpen, onClose, onSuccess }: ConvertLeadModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    website: '',
    customer_status: 'active',
    customer_tier: 'basic',
    acquisition_source: '',
    total_spent: '0',
    notes: ''
  });

  // Pré-preencher dados quando o lead mudar
  useEffect(() => {
    if (lead) {
      setFormData({
        full_name: lead.full_name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company_name: lead.company_name || '',
        website: lead.website || '',
        customer_status: 'active',
        customer_tier: lead.source_page === 'landing_page_premium' ? 'premium' : 'basic',
        acquisition_source: lead.source_page || '',
        total_spent: lead.source_page === 'landing_page_basic' ? '4.99' : 
                     lead.source_page === 'landing_page_premium' ? '49.99' : '0',
        notes: lead.notes || ''
      });
    }
  }, [lead]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConvert = async () => {
    if (!lead) return;

    setLoading(true);
    try {
      console.log('Convertendo lead para cliente:', lead.id);
      
      // Verificar se já existe cliente com este email
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', formData.email)
        .single();

      if (existingCustomer) {
        toast({
          title: "Cliente já existe",
          description: "Já existe um cliente com este email.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Criar cliente
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          company_name: formData.company_name,
          website: formData.website,
          original_lead_id: lead.id,
          acquisition_source: formData.acquisition_source,
          customer_status: formData.customer_status,
          customer_tier: formData.customer_tier,
          stripe_customer_id: lead.stripe_customer_id,
          total_spent: parseFloat(formData.total_spent) || 0,
          last_payment_date: parseFloat(formData.total_spent) > 0 ? new Date().toISOString() : null,
          acquisition_date: lead.created_at,
          notes: formData.notes
        })
        .select()
        .single();

      if (customerError) {
        console.error('Erro ao criar cliente:', customerError);
        throw customerError;
      }

      // Criar transação se houver valor pago
      if (parseFloat(formData.total_spent) > 0) {
        const { error: transactionError } = await supabase
          .from('customer_transactions')
          .insert({
            customer_id: customer.id,
            lead_id: lead.id,
            transaction_type: 'payment',
            amount: parseFloat(formData.total_spent),
            currency: 'EUR',
            product_type: lead.source_page,
            product_description: lead.source_page === 'landing_page_basic' ? 'Landing Page Básica' : 
                                lead.source_page === 'landing_page_premium' ? 'Landing Page Premium' : 
                                'Conversão Manual',
            status: 'completed',
            stripe_payment_intent_id: lead.stripe_payment_id,
            stripe_session_id: lead.stripe_session_id
          });

        if (transactionError) {
          console.error('Erro ao criar transação:', transactionError);
        }
      }

      // Atualizar lead como convertido
      const { error: leadError } = await supabase
        .from('unified_leads')
        .update({
          converted: true,
          conversion_date: new Date().toISOString(),
          lead_status: 'converted',
          conversion_value: parseFloat(formData.total_spent) || 0
        })
        .eq('id', lead.id);

      if (leadError) {
        console.error('Erro ao atualizar lead:', leadError);
        throw leadError;
      }

      toast({
        title: "Cliente criado com sucesso",
        description: "O lead foi convertido para cliente e salvo no sistema."
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro na conversão:', error);
      toast({
        title: "Erro na conversão",
        description: "Não foi possível converter o lead para cliente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Converter Lead para Cliente</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Nome Completo *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="company_name">Nome da Empresa</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="customer_status">Status do Cliente</Label>
              <Select value={formData.customer_status} onValueChange={(value) => handleInputChange('customer_status', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="churned">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="customer_tier">Nível do Cliente</Label>
              <Select value={formData.customer_tier} onValueChange={(value) => handleInputChange('customer_tier', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="basic">Básico</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="total_spent">Valor Pago (€)</Label>
              <Input
                id="total_spent"
                type="number"
                step="0.01"
                value={formData.total_spent}
                onChange={(e) => handleInputChange('total_spent', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="border-gray-600 text-gray-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConvert}
              disabled={loading || !formData.full_name || !formData.email}
              className="bg-senvia-500 hover:bg-senvia-600"
            >
              {loading ? 'Salvando...' : 'Salvar Cliente'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConvertLeadModal;
