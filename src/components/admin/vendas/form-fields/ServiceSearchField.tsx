
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCustomServices } from "@/hooks/useCustomServices";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceSearchFieldProps {
  serviceType: string;
  serviceId: string;
  onServiceSelect: (serviceId: string) => void;
}

const ServiceSearchField = ({ serviceType, serviceId, onServiceSelect }: ServiceSearchFieldProps) => {
  const [open, setOpen] = useState(false);
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

  return (
    <div className="space-y-2">
      <Label className="text-gray-300">
        {serviceType === 'custom_service' ? 'Serviço Personalizado' : 'Produto do Stripe'}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            {selectedServiceName || "Buscar serviço..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0 bg-gray-800 border-gray-700">
          <Command className="bg-gray-800">
            <CommandInput 
              placeholder="Buscar serviço..." 
              className="text-white bg-gray-800 border-gray-600" 
            />
            <CommandList className="bg-gray-800">
              <CommandEmpty className="text-gray-400 py-6 text-center">
                Nenhum serviço encontrado.
              </CommandEmpty>
              <CommandGroup className="bg-gray-800">
                {services.map((service) => (
                  <CommandItem
                    key={service.id}
                    value={`${service.name} ${service.description || ''}`}
                    onSelect={() => {
                      onServiceSelect(service.id);
                      setOpen(false);
                    }}
                    className="text-white hover:bg-gray-700 cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        serviceId === service.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{service.name}</span>
                      {serviceType === 'custom_service' && (
                        <span className="text-sm text-senvia-400">€{service.base_price}</span>
                      )}
                      {service.description && (
                        <span className="text-xs text-gray-500">{service.description}</span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ServiceSearchField;
