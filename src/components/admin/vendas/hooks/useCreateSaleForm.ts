
import { useState } from "react";
import { useCreateSale } from "@/hooks/useSales";
import { useCustomServices } from "@/hooks/useCustomServices";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useCreateSaleForm = (onClose: () => void) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    service_type: 'manual' as 'stripe_product' | 'custom_service' | 'manual',
    service_id: '',
    service_name: '',
    service_description: '',
    total_value: '',
    paid_amount: '',
    payment_method: '',
    sale_status: 'pending' as const,
    payment_status: 'pending' as const,
    notes: '',
    expected_delivery_date: '',
    assigned_to: ''
  });

  const { toast } = useToast();
  const createSaleMutation = useCreateSale();
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

  const resetForm = () => {
    setFormData({
      customer_id: '',
      service_type: 'manual',
      service_id: '',
      service_name: '',
      service_description: '',
      total_value: '',
      paid_amount: '',
      payment_method: '',
      sale_status: 'pending',
      payment_status: 'pending',
      notes: '',
      expected_delivery_date: '',
      assigned_to: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Creating sale with data:', formData);
      
      await createSaleMutation.mutateAsync({
        customer_id: formData.customer_id === 'none' ? undefined : formData.customer_id || undefined,
        service_type: formData.service_type,
        service_id: formData.service_id || undefined,
        service_name: formData.service_name,
        service_description: formData.service_description,
        total_value: Number(formData.total_value),
        paid_amount: Number(formData.paid_amount) || 0,
        payment_method: formData.payment_method,
        sale_status: formData.sale_status,
        payment_status: formData.payment_status,
        notes: formData.notes,
        expected_delivery_date: formData.expected_delivery_date || undefined,
        sale_date: new Date().toISOString(),
        commission_rate: 0,
        assigned_to: formData.assigned_to === 'unassigned' ? undefined : formData.assigned_to || undefined
      });
      
      toast({
        title: "Venda criada",
        description: "A venda foi criada com sucesso."
      });
      
      onClose();
      resetForm();
    } catch (error) {
      console.error('Erro ao criar venda:', error);
      toast({
        title: "Erro ao criar venda",
        description: "Não foi possível criar a venda. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleServiceTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      service_type: value as any,
      service_id: '',
      service_name: '',
      service_description: '',
      total_value: ''
    }));
  };

  const handleServiceSelect = (serviceId: string) => {
    console.log('Service selected:', serviceId);
    setFormData(prev => ({ ...prev, service_id: serviceId }));
    
    if (formData.service_type === 'custom_service') {
      const service = customServices?.find(s => s.id === serviceId);
      if (service) {
        console.log('Found custom service:', service);
        setFormData(prev => ({
          ...prev,
          service_name: service.name,
          service_description: service.description || '',
          total_value: service.base_price.toString()
        }));
      }
    } else if (formData.service_type === 'stripe_product') {
      const product = stripeProducts?.find(p => p.id === serviceId);
      if (product) {
        console.log('Found stripe product:', product);
        setFormData(prev => ({
          ...prev,
          service_name: product.name,
          service_description: product.description || ''
        }));
      }
    }
  };

  return {
    formData,
    setFormData,
    handleSubmit,
    handleServiceTypeChange,
    handleServiceSelect,
    createSaleMutation
  };
};
