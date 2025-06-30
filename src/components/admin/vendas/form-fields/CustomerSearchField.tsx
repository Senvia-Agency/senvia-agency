
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCustomers } from "@/hooks/useCustomers";
import { useState } from "react";
import { Plus, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomerSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onNewCustomerCreated?: (customer: any) => void;
}

const CustomerSearchField = ({ value, onChange, onNewCustomerCreated }: CustomerSearchFieldProps) => {
  const { data: customers } = useCustomers();
  const [open, setOpen] = useState(false);
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: ''
  });

  const handleCreateNewCustomer = () => {
    const newCustomer = {
      id: `temp_${Date.now()}`,
      ...newCustomerData
    };
    
    if (onNewCustomerCreated) {
      onNewCustomerCreated(newCustomer);
    }
    
    onChange(newCustomer.id);
    setNewCustomerData({ full_name: '', email: '', phone: '', company_name: '' });
    setShowNewCustomerDialog(false);
  };

  const selectedCustomer = customers?.find(c => c.id === value);
  const selectedCustomerName = selectedCustomer ? 
    `${selectedCustomer.full_name} - ${selectedCustomer.email}` : 
    '';

  const isFormValid = newCustomerData.full_name.trim() && newCustomerData.email.trim();

  return (
    <div className="space-y-2">
      <Label className="text-gray-300">Cliente (Opcional)</Label>
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="flex-1 justify-between bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              {value === "none" ? "Venda direta (sem cliente)" : 
               selectedCustomerName || "Buscar cliente..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0 bg-gray-800 border-gray-700">
            <Command className="bg-gray-800">
              <CommandInput 
                placeholder="Buscar cliente..." 
                className="text-white bg-gray-800 border-gray-600" 
              />
              <CommandList className="bg-gray-800">
                <CommandEmpty className="text-gray-400 py-6 text-center">
                  Nenhum cliente encontrado.
                </CommandEmpty>
                <CommandGroup className="bg-gray-800">
                  <CommandItem
                    value="none"
                    onSelect={() => {
                      onChange("none");
                      setOpen(false);
                    }}
                    className="text-white hover:bg-gray-700 cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === "none" ? "opacity-100" : "opacity-0"
                      )}
                    />
                    Venda direta (sem cliente)
                  </CommandItem>
                  {customers?.map((customer) => (
                    <CommandItem
                      key={customer.id}
                      value={`${customer.full_name} ${customer.email} ${customer.company_name || ''}`}
                      onSelect={() => {
                        onChange(customer.id);
                        setOpen(false);
                      }}
                      className="text-white hover:bg-gray-700 cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === customer.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{customer.full_name}</span>
                        <span className="text-sm text-gray-400">{customer.email}</span>
                        {customer.company_name && (
                          <span className="text-xs text-gray-500">{customer.company_name}</span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
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

export default CustomerSearchField;
