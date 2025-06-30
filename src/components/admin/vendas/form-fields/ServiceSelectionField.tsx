
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomServices } from "@/hooks/useCustomServices";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ServiceSelectionFieldProps {
  serviceType: string;
  serviceId: string;
  onServiceSelect: (serviceId: string) => void;
}

const ServiceSelectionField = ({ serviceType, serviceId, onServiceSelect }: ServiceSelectionFieldProps) => {
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

  return (
    <div>
      <Label className="text-gray-300">
        {serviceType === 'custom_service' ? 'Serviço Personalizado' : 'Produto do Stripe'}
      </Label>
      <Select value={serviceId} onValueChange={onServiceSelect}>
        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
          <SelectValue placeholder="Selecionar serviço" />
        </SelectTrigger>
        <SelectContent>
          {serviceType === 'custom_service' && 
            customServices?.filter(s => s.status === 'active').map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name} - €{service.base_price}
              </SelectItem>
            ))
          }
          {serviceType === 'stripe_product' &&
            stripeProducts?.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))
          }
        </SelectContent>
      </Select>
    </div>
  );
};

export default ServiceSelectionField;
