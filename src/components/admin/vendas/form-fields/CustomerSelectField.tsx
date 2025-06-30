
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCustomers } from "@/hooks/useCustomers";
import { useState } from "react";
import { Plus } from "lucide-react";

interface CustomerSelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  onNewCustomerCreated?: (customer: any) => void;
}

const CustomerSelectField = ({ value, onChange, onNewCustomerCreated }: CustomerSelectFieldProps) => {
  const { data: customers } = useCustomers();
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: ''
  });

  const handleCreateNewCustomer = () => {
    // Simular criação de cliente (seria melhor fazer uma mutation real)
    const newCustomer = {
      id: `temp_${Date.now()}`,
      ...newCustomerData
    };
    
    // Chamar callback se fornecido
    if (onNewCustomerCreated) {
      onNewCustomerCreated(newCustomer);
    }
    
    // Selecionar o novo cliente
    onChange(newCustomer.id);
    
    // Resetar formulário e fechar dialog
    setNewCustomerData({ full_name: '', email: '', phone: '', company_name: '' });
    setShowNewCustomerDialog(false);
  };

  const isFormValid = newCustomerData.full_name.trim() && newCustomerData.email.trim();

  return (
    <div>
      <Label className="text-gray-300">Cliente (Opcional)</Label>
      <div className="flex gap-2">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white flex-1">
            <SelectValue placeholder="Selecionar cliente existente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Venda direta (sem cliente)</SelectItem>
            {customers?.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.full_name} - {customer.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Dialog open={showNewCustomerDialog} onOpenChange={setShowNewCustomerDialog}>
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
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Novo Cliente</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Nome Completo *</Label>
                <Input
                  value={newCustomerData.full_name}
                  onChange={(e) => setNewCustomerData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Nome do cliente"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label className="text-gray-300">Email *</Label>
                <Input
                  type="email"
                  value={newCustomerData.email}
                  onChange={(e) => setNewCustomerData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label className="text-gray-300">Telefone</Label>
                <Input
                  value={newCustomerData.phone}
                  onChange={(e) => setNewCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Telefone (opcional)"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label className="text-gray-300">Empresa</Label>
                <Input
                  value={newCustomerData.company_name}
                  onChange={(e) => setNewCustomerData(prev => ({ ...prev, company_name: e.target.value }))}
                  placeholder="Nome da empresa (opcional)"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewCustomerDialog(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleCreateNewCustomer}
                  disabled={!isFormValid}
                  className="bg-senvia-500 hover:bg-senvia-400 text-black"
                >
                  Criar Cliente
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CustomerSelectField;
