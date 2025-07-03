import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  console.log('CustomerDropdown - customers count:', customers?.length);
  console.log('CustomerDropdown - current value:', value);
  console.log('CustomerDropdown - open state:', open);
  console.log('CustomerDropdown - search term:', searchTerm);

  const selectedCustomer = customers?.find(c => c.id === value);
  const selectedCustomerName = selectedCustomer ? selectedCustomer.full_name : '';

  // Filter customers based on search term
  const filteredCustomers = customers?.filter(customer => {
    if (!searchTerm.trim()) return true; // Show all if no search term
    
    const searchLower = searchTerm.toLowerCase().trim();
    const nameMatch = customer.full_name.toLowerCase().includes(searchLower);
    const emailMatch = customer.email.toLowerCase().includes(searchLower);
    const companyMatch = customer.company_name && customer.company_name.toLowerCase().includes(searchLower);
    
    return nameMatch || emailMatch || companyMatch;
  }) || [];

  console.log('CustomerDropdown - filtered customers count:', filteredCustomers.length);

  // Focus input when dropdown opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearchTerm("");
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleSelect = (customerId: string) => {
    console.log('Attempting to select customer:', customerId);
    onChange(customerId);
    setOpen(false);
    setSearchTerm("");
    console.log('Customer selected successfully');
  };

  const handleToggle = () => {
    console.log('Toggle button clicked, current open state:', open);
    setOpen(!open);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('Search term changed to:', newValue);
    setSearchTerm(newValue);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
        onClick={handleToggle}
      >
        {value === "none" ? "Venda direta (sem cliente)" : 
         selectedCustomerName || "Buscar cliente..."}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-[9999] mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Digite para buscar cliente..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-senvia-500 focus:border-senvia-500"
                autoFocus
              />
            </div>
          </div>
          
          {/* Options List */}
          <div className="max-h-[200px] overflow-y-auto">
            {/* Direct Sale Option - sempre visível */}
            <div
              className={cn(
                "flex items-center px-3 py-2 cursor-pointer hover:bg-gray-700 text-white transition-colors",
                value === "none" && "bg-gray-700"
              )}
              onClick={(e) => {
                e.stopPropagation();
                console.log('Direct sale option clicked');
                handleSelect("none");
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4 text-senvia-500",
                  value === "none" ? "opacity-100" : "opacity-0"
                )}
              />
              <span>Venda direta (sem cliente)</span>
            </div>
            
            {/* Customer List */}
            {filteredCustomers.length === 0 && searchTerm.trim() ? (
              <div className="px-3 py-4 text-gray-400 text-center text-sm">
                Nenhum cliente encontrado para "{searchTerm}".
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className={cn(
                    "flex items-start px-3 py-3 cursor-pointer hover:bg-gray-700 text-white transition-colors border-b border-gray-700 last:border-b-0",
                    value === customer.id && "bg-gray-700"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Customer clicked:', customer.id, customer.full_name);
                    handleSelect(customer.id);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-3 h-4 w-4 text-senvia-500 mt-0.5 flex-shrink-0",
                      value === customer.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-medium text-white truncate">{customer.full_name}</span>
                    {customer.company_name && (
                      <span className="text-xs text-gray-500 truncate">{customer.company_name}</span>
                    )}
                  </div>
                </div>
              ))
            )}
            
            {/* Empty state when no customers exist */}
            {customers?.length === 0 && (
              <div className="px-3 py-4 text-gray-400 text-center text-sm">
                Nenhum cliente cadastrado.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDropdown;
