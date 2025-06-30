
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomServices } from "@/hooks/useCustomServices";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceSearchFieldProps {
  serviceType: string;
  serviceId: string;
  onServiceSelect: (serviceId: string) => void;
}

const ServiceSearchField = ({ serviceType, serviceId, onServiceSelect }: ServiceSearchFieldProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { data: customServices } = useCustomServices();
  
  const { data: stripeProducts } = useQuery({
    queryKey: ['stripe-products-for-sale'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true);
      
      if (error) throw error;
      return data;
    },
  });

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

  // Return null after all hooks are declared
  if (serviceType === 'manual') return null;

  const services = serviceType === 'custom_service' 
    ? customServices?.filter(s => s.status === 'active') || []
    : stripeProducts || [];

  const selectedService = services.find(s => s.id === serviceId);
  const selectedServiceName = selectedService ? 
    (serviceType === 'custom_service' 
      ? `${selectedService.name} - €${selectedService.base_price}`
      : selectedService.name
    ) : '';

  // Filter services based on search term
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelect = (selectedServiceId: string) => {
    console.log('Selecting service:', selectedServiceId);
    onServiceSelect(selectedServiceId);
    setOpen(false);
    setSearchTerm("");
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label className="text-gray-300">
        {serviceType === 'custom_service' ? 'Serviço Personalizado' : 'Produto do Stripe'}
      </Label>
      
      <div className="relative w-full" ref={dropdownRef}>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          onClick={handleToggle}
        >
          {selectedServiceName || "Buscar serviço..."}
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
                  placeholder="Digite para buscar serviço..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-senvia-500 focus:border-senvia-500"
                  autoFocus
                />
              </div>
            </div>
            
            {/* Services List */}
            <div className="max-h-[200px] overflow-y-auto">
              {filteredServices.length === 0 && searchTerm ? (
                <div className="px-3 py-4 text-gray-400 text-center text-sm">
                  Nenhum serviço encontrado para "{searchTerm}".
                </div>
              ) : (
                filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className={cn(
                      "flex items-start px-3 py-3 cursor-pointer hover:bg-gray-700 text-white transition-colors border-b border-gray-700 last:border-b-0",
                      serviceId === service.id && "bg-gray-700"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(service.id);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-3 h-4 w-4 text-senvia-500 mt-0.5 flex-shrink-0",
                        serviceId === service.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-medium text-white">{service.name}</span>
                      {serviceType === 'custom_service' && (
                        <span className="text-sm text-senvia-400">€{service.base_price}</span>
                      )}
                      {service.description && (
                        <span className="text-xs text-gray-500">{service.description}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
              
              {services.length === 0 && (
                <div className="px-3 py-4 text-gray-400 text-center text-sm">
                  Nenhum {serviceType === 'custom_service' ? 'serviço personalizado' : 'produto'} disponível.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceSearchField;
