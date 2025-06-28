
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface ConvertLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
}

const ConvertLeadModal = ({ isOpen, onClose, lead }: ConvertLeadModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    website: '',
    customer_tier: 'basic',
    notes: '',
    amount_paid: 0,
    // Campos de endereço
    tax_id: '',
    date_of_birth: '',
    address: {
      street: '',
      city: '',
      postal_code: '',
      country: 'Portugal'
    },
    additional_info: {
      profession: '',
      industry: '',
      company_size: '',
      annual_revenue: ''
    }
  });

  useEffect(() => {
    if (lead) {
      // Definir valor padrão baseado na origem do lead
      let defaultAmount = 0;
      if (lead.source_page === 'landing_page_basic') {
        defaultAmount = 4.99;
      } else if (lead.source_page === 'landing_page_premium') {
        defaultAmount = 49.99;
      }

      setFormData({
        full_name: lead.full_name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company_name: lead.company_name || '',
        website: lead.website || '',
        customer_tier: 'basic',
        notes: lead.notes || `Convertido de lead ${lead.source_page}. Objetivo: ${lead.objective || 'N/A'}`,
        amount_paid: lead.conversion_value || defaultAmount,
        tax_id: '',
        date_of_birth: '',
        address: {
          street: '',
          city: '',
          postal_code: '',
          country: 'Portugal'
        },
        additional_info: {
          profession: '',
          industry: lead.main_product_service || '',
          company_size: '',
          annual_revenue: ''
        }
      });
    }
  }, [lead]);

  const handleSubmit = async () => {
    if (!lead) return;

    setIsLoading(true);
    try {
      // 1. Verificar se já existe cliente com este email
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingCustomer) {
        toast({
          title: "Cliente já existe",
          description: "Já existe um cliente com este email.",
          variant: "destructive"
        });
        return;
      }

      // 2. Criar novo cliente
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          company_name: formData.company_name,
          website: formData.website,
          original_lead_id: lead.id,
          acquisition_source: lead.source_page,
          stripe_customer_id: lead.stripe_customer_id,
          customer_tier: formData.customer_tier,
          total_spent: formData.amount_paid,
          last_payment_date: new Date().toISOString(),
          notes: formData.notes,
          address: {
            ...formData.address,
            tax_id: formData.tax_id,
            date_of_birth: formData.date_of_birth,
            profession: formData.additional_info.profession,
            industry: formData.additional_info.industry,
            company_size: formData.additional_info.company_size,
            annual_revenue: formData.additional_info.annual_revenue
          }
        })
        .select()
        .single();

      if (customerError) throw customerError;

      // 3. Criar transação do cliente se houve pagamento
      if (formData.amount_paid > 0) {
        await supabase
          .from('customer_transactions')
          .insert({
            customer_id: customer.id,
            lead_id: lead.id,
            transaction_type: 'payment',
            amount: formData.amount_paid,
            currency: 'EUR',
            product_type: lead.source_page,
            product_description: lead.source_page === 'landing_page_basic' ? 'Landing Page Básica' : 'Landing Page Premium',
            status: 'completed',
            stripe_payment_intent_id: lead.stripe_payment_id,
            stripe_session_id: lead.stripe_session_id
          });
      }

      // 4. Atualizar lead como convertido
      await supabase
        .from('unified_leads')
        .update({
          converted: true,
          conversion_date: new Date().toISOString(),
          conversion_value: formData.amount_paid,
          lead_status: 'converted'
        })
        .eq('id', lead.id);

      toast({
        title: "Cliente convertido com sucesso",
        description: "O lead foi convertido em cliente e todas as informações foram salvas."
      });

      // Atualizar queries
      queryClient.invalidateQueries({ queryKey: ['unified-leads'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      
      onClose();
    } catch (error: any) {
      console.error('Erro ao converter lead:', error);
      toast({
        title: "Erro ao converter lead",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Salvar Cliente - Conversão Manual</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Nome Completo *</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                  required
                />
              </div>
              <div>
                <Label className="text-gray-300">Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                  required
                />
              </div>
              <div>
                <Label className="text-gray-300">Telefone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label className="text-gray-300">NIF</Label>
                <Input
                  value={formData.tax_id}
                  onChange={(e) => setFormData({...formData, tax_id: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                  placeholder="123456789"
                />
              </div>
              <div>
                <Label className="text-gray-300">Data de Nascimento</Label>
                <Input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Informações da Empresa */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Informações da Empresa</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Nome da Empresa</Label>
                <Input
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label className="text-gray-300">Website</Label>
                <Input
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label className="text-gray-300">Setor</Label>
                <Input
                  value={formData.additional_info.industry}
                  onChange={(e) => setFormData({
                    ...formData, 
                    additional_info: {...formData.additional_info, industry: e.target.value}
                  })}
                  className="bg-gray-700 border-gray-600"
                  placeholder="Tecnologia, Saúde, etc."
                />
              </div>
              <div>
                <Label className="text-gray-300">Tamanho da Empresa</Label>
                <Select 
                  value={formData.additional_info.company_size} 
                  onValueChange={(value) => setFormData({
                    ...formData, 
                    additional_info: {...formData.additional_info, company_size: value}
                  })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Selecionar tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 funcionários</SelectItem>
                    <SelectItem value="11-50">11-50 funcionários</SelectItem>
                    <SelectItem value="51-200">51-200 funcionários</SelectItem>
                    <SelectItem value="201-1000">201-1000 funcionários</SelectItem>
                    <SelectItem value="1000+">1000+ funcionários</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Endereço</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label className="text-gray-300">Rua</Label>
                <Input
                  value={formData.address.street}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: {...formData.address, street: e.target.value}
                  })}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label className="text-gray-300">Cidade</Label>
                <Input
                  value={formData.address.city}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: {...formData.address, city: e.target.value}
                  })}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label className="text-gray-300">Código Postal</Label>
                <Input
                  value={formData.address.postal_code}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: {...formData.address, postal_code: e.target.value}
                  })}
                  className="bg-gray-700 border-gray-600"
                  placeholder="1000-000"
                />
              </div>
            </div>
          </div>

          {/* Informações de Cliente */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Informações de Cliente</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Nível do Cliente</Label>
                <Select value={formData.customer_tier} onValueChange={(value) => setFormData({...formData, customer_tier: value})}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Básico</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Valor Pago (€) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount_paid}
                  onChange={(e) => setFormData({...formData, amount_paid: parseFloat(e.target.value) || 0})}
                  className="bg-gray-700 border-gray-600"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Notas */}
          <div>
            <Label className="text-gray-300">Notas</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="bg-gray-700 border-gray-600"
              rows={3}
              placeholder="Informações adicionais sobre o cliente..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} className="border-gray-600">
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="bg-senvia-500 hover:bg-senvia-400 text-black"
              disabled={isLoading || !formData.full_name || !formData.email}
            >
              {isLoading ? 'Salvando Cliente...' : 'Salvar Cliente'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConvertLeadModal;
