
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Customer {
  id: string;
  full_name: string;
  email: string;
  company_name?: string;
}

interface CustomerDropdownProps {
  customers: Customer[];
  value: string;
  onChange: (value: string) => void;
}

const CustomerDropdown = ({ customers, value, onChange }: CustomerDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  console.log('CustomerDropdown - customers count:', customers?.length);
  console.log('CustomerDropdown - current value:', value);

  const selectedCustomer = customers?.find(c => c.id === value);
  const selectedCustomerName = selectedCustomer ? 
    `${selectedCustomer.full_name} - ${selectedCustomer.email}` : 
    '';

  // Filter customers based on search term
  const filteredCustomers = customers?.filter(customer => 
    customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.company_name && customer.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleSelect = (customerId: string) => {
    console.log('Selecting customer:', customerId);
    onChange(customerId);
    setOpen(false);
    setSearchTerm("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex-1 justify-between bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          onClick={() => {
            console.log('Button clicked, opening dropdown');
            setOpen(!open);
          }}
        >
          {value === "none" ? "Venda direta (sem cliente)" : 
           selectedCustomerName || "Buscar cliente..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 bg-gray-800 border-gray-700" style={{ zIndex: 9999 }}>
        <div className="p-2 border-b border-gray-700">
          <Input
            placeholder="Digite para buscar cliente..."
            value={searchTerm}
            onChange={(e) => {
              console.log('Search term changed:', e.target.value);
              setSearchTerm(e.target.value);
            }}
            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            autoFocus
          />
        </div>
        
        <div className="max-h-[200px] overflow-y-auto">
          {/* Opção de venda direta */}
          <div
            className={cn(
              "flex items-center px-3 py-2 cursor-pointer hover:bg-gray-700 text-white",
              value === "none" && "bg-gray-700"
            )}
            onClick={() => handleSelect("none")}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                value === "none" ? "opacity-100" : "opacity-0"
              )}
            />
            Venda direta (sem cliente)
          </div>
          
          {/* Lista de clientes filtrados */}
          {filteredCustomers.length === 0 && searchTerm ? (
            <div className="px-3 py-2 text-gray-400 text-center">
              Nenhum cliente encontrado.
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className={cn(
                  "flex items-center px-3 py-2 cursor-pointer hover:bg-gray-700 text-white",
                  value === customer.id && "bg-gray-700"
                )}
                onClick={() => handleSelect(customer.id)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === customer.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col flex-1">
                  <span className="font-medium">{customer.full_name}</span>
                  <span className="text-sm text-gray-400">{customer.email}</span>
                  {customer.company_name && (
                    <span className="text-xs text-gray-500">{customer.company_name}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CustomerDropdown;
