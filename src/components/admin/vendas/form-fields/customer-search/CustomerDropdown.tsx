
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

  const selectedCustomer = customers?.find(c => c.id === value);
  const selectedCustomerName = selectedCustomer ? 
    `${selectedCustomer.full_name} - ${selectedCustomer.email}` : 
    '';

  return (
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
      <PopoverContent className="w-[400px] p-0 bg-gray-800 border-gray-700 z-[60]">
        <Command className="bg-gray-800">
          <CommandInput 
            placeholder="Digite para buscar cliente..." 
            className="text-white bg-gray-800 border-none h-9" 
          />
          <CommandList className="bg-gray-800 max-h-[200px]">
            <CommandEmpty className="text-gray-400 py-6 text-center text-sm">
              Nenhum cliente encontrado.
            </CommandEmpty>
            <CommandGroup className="bg-gray-800">
              <CommandItem
                key="none"
                value="venda direta sem cliente"
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
  );
};

export default CustomerDropdown;
