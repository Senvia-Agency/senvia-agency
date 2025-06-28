
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useConvertLeadToCustomer } from "@/hooks/useCustomers";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

interface ConvertLeadModalProps {
  lead: any;
  isOpen: boolean;
  onClose: () => void;
  onConvert: () => void;
}

const ConvertLeadModal = ({ lead, isOpen, onClose, onConvert }: ConvertLeadModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [customerData, setCustomerData] = useState({
    full_name: lead?.full_name || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    company_name: lead?.company_name || '',
    website: lead?.website || '',
    customer_tier: 'basic',
    project_status: 'pending',
    notes: lead?.notes || '',
    address: {
      street: '',
      city: '',
      postal_code: '',
      country: 'Portugal'
    }
  });

  const handleConvert = async () => {
    if (!lead) return;

    setIsLoading(true);
    try {
      // Primeiro, verificar se já existe cliente com este email
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', lead.email)
        .single();

      if (existingCustomer) {
        toast({
          title: "Cliente já existe",
          description: "Já existe um cliente com este email.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Criar novo cliente
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          full_name: customerData.full_name,
          email: customerData.email,
          phone: customerData.phone,
          company_name: customerData.company_name,
          website: customerData.website,
          customer_tier: customerData.customer_tier,
          project_status: customerData.project_status,
          notes: customerData.notes,
          address: customerData.address,
          original_lead_id: lead.id,
          acquisition_source: lead.source_page,
          acquisition_date: lead.created_at,
          total_spent: lead.payment_status === 'paid' ? 
            (lead.source_page === 'landing_page_basic' ? 4.99 : 49.99) : 0,
          last_payment_date: lead.payment_status === 'paid' ? new Date().toISOString() : null,
          stripe_customer_id: lead.stripe_customer_id
        })
        .select()
        .single();

      if (customerError) throw customerError;

      // Se o lead foi pago, criar transação
      if (lead.payment_status === 'paid') {
        await supabase
          .from('customer_transactions')
          .insert({
            customer_id: newCustomer.id,
            lead_id: lead.id,
            transaction_type: 'payment',
            amount: lead.source_page === 'landing_page_basic' ? 4.99 : 49.99,
            currency: 'EUR',
            product_type: lead.source_page,
            product_description: lead.source_page === 'landing_page_basic' ? 'Landing Page Básica' : 'Landing Page Premium',
            status: 'completed',
            stripe_payment_intent_id: lead.stripe_payment_id,
            stripe_session_id: lead.stripe_session_id
          });
      }

      // Atualizar lead como convertido
      await supabase
        .from('unified_leads')
        .update({
          converted: true,
          conversion_date: new Date().toISOString(),
          lead_status: 'converted'
        })
        .eq('id', lead.id);

      toast({
        title: "Lead convertido com sucesso!",
        description: `${customerData.full_name} foi adicionado como cliente.`
      });

      onConvert();
      onClose();
    } catch (error: any) {
      console.error('Erro ao converter lead:', error);
      toast({
        title: "Erro ao converter lead",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProjectStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Progresso';
      case 'completed': return 'Concluído';
      case 'on_hold': return 'Em Pausa';
      case 'cancelled': return 'Cancelado';
      default: return 'Pendente';
    }
  };

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Converter Lead para Cliente</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações do Lead */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-white mb-3">Informações do Lead</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Email:</span>
                <p className="text-white">{lead.email}</p>
              </div>
              <div>
                <span className="text-gray-400">Data:</span>
                <p className="text-white">{format(new Date(lead.created_at), 'dd/MM/yyyy', { locale: ptBR })}</p>
              </div>
              <div>
                <span className="text-gray-400">Origem:</span>
                <Badge variant="outline" className="text-senvia-400 border-senvia-500">
                  {lead.source_page === 'landing_page_basic' ? 'Landing Page Básica' : 'Landing Page Premium'}
                </Badge>
              </div>
              <div>
                <span className="text-gray-400">Status Pagamento:</span>
                <Badge variant={lead.payment_status === 'paid' ? 'default' : 'secondary'}>
                  {lead.payment_status === 'paid' ? 'Pago' : 'Pendente'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Dados do Cliente */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Dados do Cliente</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Nome Completo *</Label>
                <Input
                  value={customerData.full_name}
                  onChange={(e) => setCustomerData({...customerData, full_name: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label className="text-gray-300">Email *</Label>
                <Input
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                  disabled
                />
              </div>
              <div>
                <Label className="text-gray-300">Telefone</Label>
                <Input
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label className="text-gray-300">Empresa</Label>
                <Input
                  value={customerData.company_name}
                  onChange={(e) => setCustomerData({...customerData, company_name: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label className="text-gray-300">Website</Label>
                <Input
                  value={customerData.website}
                  onChange={(e) => setCustomerData({...customerData, website: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Status e Configurações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Nível do Cliente</Label>
              <Select value={customerData.customer_tier} onValueChange={(value) => setCustomerData({...customerData, customer_tier: value})}>
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
              <Label className="text-gray-300">Status do Projeto</Label>
              <Select value={customerData.project_status} onValueChange={(value) => setCustomerData({...customerData, project_status: value})}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      Pendente
                    </span>
                  </SelectItem>
                  <SelectItem value="in_progress">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Em Progresso
                    </span>
                  </SelectItem>
                  <SelectItem value="completed">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Concluído
                    </span>
                  </SelectItem>
                  <SelectItem value="on_hold">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      Em Pausa
                    </span>
                  </SelectItem>
                  <SelectItem value="cancelled">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Cancelado
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Endereço Básico */}
          <div className="space-y-3">
            <Label className="text-gray-300">Endereço (Opcional)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Cidade"
                value={customerData.address.city}
                onChange={(e) => setCustomerData({
                  ...customerData, 
                  address: {...customerData.address, city: e.target.value}
                })}
                className="bg-gray-700 border-gray-600"
              />
              <Input
                placeholder="Código Postal"
                value={customerData.address.postal_code}
                onChange={(e) => setCustomerData({
                  ...customerData, 
                  address: {...customerData.address, postal_code: e.target.value}
                })}
                className="bg-gray-700 border-gray-600"
              />
            </div>
          </div>

          {/* Notas */}
          <div>
            <Label className="text-gray-300">Notas</Label>
            <Textarea
              value={customerData.notes}
              onChange={(e) => setCustomerData({...customerData, notes: e.target.value})}
              className="bg-gray-700 border-gray-600"
              rows={3}
              placeholder="Informações adicionais sobre o cliente..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConvert}
              className="bg-senvia-500 hover:bg-senvia-400 text-black"
              disabled={isLoading || !customerData.full_name || !customerData.email}
            >
              {isLoading ? 'Convertendo...' : 'Converter para Cliente'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConvertLeadModal;
