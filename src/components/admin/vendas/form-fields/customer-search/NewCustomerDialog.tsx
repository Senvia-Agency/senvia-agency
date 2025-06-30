
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Plus } from "lucide-react";

interface NewCustomerData {
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
}

interface NewCustomerDialogProps {
  onCustomerCreated: (customer: any) => void;
}

const NewCustomerDialog = ({ onCustomerCreated }: NewCustomerDialogProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [customerData, setCustomerData] = useState<NewCustomerData>({
    full_name: '',
    email: '',
    phone: '',
    company_name: ''
  });

  const handleCreateCustomer = () => {
    const newCustomer = {
      id: `temp_${Date.now()}`,
      ...customerData
    };
    
    onCustomerCreated(newCustomer);
    setCustomerData({ full_name: '', email: '', phone: '', company_name: '' });
    setShowDialog(false);
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
              disabled={!isFormValid}
              className="bg-senvia-500 hover:bg-senvia-400 text-black"
            >
              Criar Cliente
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewCustomerDialog;
