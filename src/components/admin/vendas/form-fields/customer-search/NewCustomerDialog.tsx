
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface NewCustomerData {
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
}

interface NewCustomerDialogProps {
  onCustomerCreated: (customer: any) => void;
  leadData?: any; // Dados do lead para preencher automaticamente
}

const NewCustomerDialog = ({ onCustomerCreated, leadData }: NewCustomerDialogProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [customerData, setCustomerData] = useState<NewCustomerData>({
    full_name: leadData?.full_name || '',
    email: leadData?.email || '',
    phone: leadData?.phone || '',
    company_name: leadData?.company_name || ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation para criar cliente diretamente no banco
  const createCustomerMutation = useMutation({
    mutationFn: async (customerData: NewCustomerData) => {
      console.log('Creating customer directly in database:', customerData);
      const { data, error } = await supabase
        .from('customers')
        .insert([{
          full_name: customerData.full_name,
          email: customerData.email,
          phone: customerData.phone,
          company_name: customerData.company_name
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating customer:', error);
        throw error;
      }
      console.log('Customer created successfully:', data);
      return data;
    },
    onSuccess: (newCustomer) => {
      // Invalidar cache dos clientes
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      
      // Chamar callback com o cliente criado
      onCustomerCreated(newCustomer);
      
      // Mostrar toast de sucesso
      toast({
        title: "Cliente criado com sucesso",
        description: `Cliente ${newCustomer.full_name} foi criado e está disponível para seleção.`,
      });

      // Limpar formulário e fechar modal
      setCustomerData({ full_name: '', email: '', phone: '', company_name: '' });
      setShowDialog(false);
    },
    onError: (error) => {
      console.error('Error creating customer:', error);
      toast({
        title: "Erro ao criar cliente",
        description: "Não foi possível criar o cliente. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  const handleCreateCustomer = () => {
    console.log('Creating new customer with data:', customerData);
    createCustomerMutation.mutate(customerData);
  };

  const isFormValid = customerData.full_name.trim() && customerData.email.trim();

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700 z-[70]">
        <DialogHeader>
          <DialogTitle className="text-white">Novo Cliente</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-gray-300">Nome Completo *</Label>
            <Input
              value={customerData.full_name}
              onChange={(e) => setCustomerData(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="Nome do cliente"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div>
            <Label className="text-gray-300">Email *</Label>
            <Input
              type="email"
              value={customerData.email}
              onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@exemplo.com"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div>
            <Label className="text-gray-300">Telefone</Label>
            <Input
              value={customerData.phone}
              onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Telefone (opcional)"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div>
            <Label className="text-gray-300">Empresa</Label>
            <Input
              value={customerData.company_name}
              onChange={(e) => setCustomerData(prev => ({ ...prev, company_name: e.target.value }))}
              placeholder="Nome da empresa (opcional)"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleCreateCustomer}
              disabled={!isFormValid || createCustomerMutation.isPending}
              className="bg-senvia-500 hover:bg-senvia-400 text-black"
            >
              {createCustomerMutation.isPending ? 'Criando...' : 'Criar Cliente'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewCustomerDialog;
