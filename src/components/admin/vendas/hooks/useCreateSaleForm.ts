
import { useState } from "react";
import { useCreateSale } from "@/hooks/useSales";
import { useCustomServices } from "@/hooks/useCustomServices";
import { useConvertLeadToCustomer } from "@/hooks/useCustomers";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    expected_delivery_date: ''
  });

  const [tempCustomers, setTempCustomers] = useState<any[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createSaleMutation = useCreateSale();
  const { data: customServices } = useCustomServices();
  const convertLeadToCustomerMutation = useConvertLeadToCustomer();
  
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

  // Mutation para criar novo cliente
  const createCustomerMutation = useMutation({
    mutationFn: async (customerData: any) => {
      console.log('Creating customer in database:', customerData);
      const { data, error } = await supabase
        .from('customers')
        .insert([{
          full_name: customerData.full_name,
          email: customerData.email,
          phone: customerData.phone,
          company_name: customerData.company_name
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating customer:', error);
        throw error;
      }
      console.log('Customer created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
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
      expected_delivery_date: ''
    });
    setTempCustomers([]);
  };

  const handleNewCustomerCreated = (newCustomer: any) => {
    console.log('useCreateSaleForm - Adding new temporary customer:', newCustomer);
    setTempCustomers(prev => {
      const updated = [...prev, newCustomer];
      console.log('useCreateSaleForm - Updated tempCustomers:', updated);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let finalCustomerId = formData.customer_id;

      // Se é um cliente temporário, criar no banco primeiro
      if (finalCustomerId.startsWith('temp_')) {
        console.log('Processing temporary customer:', finalCustomerId);
        const tempCustomer = tempCustomers.find(c => c.id === finalCustomerId);
        if (tempCustomer) {
          console.log('Found temporary customer, creating in database:', tempCustomer);
          const createdCustomer = await createCustomerMutation.mutateAsync(tempCustomer);
          finalCustomerId = createdCustomer.id;
          
          toast({
            title: "Cliente criado",
            description: `Cliente ${tempCustomer.full_name} foi criado com sucesso.`
          });
        }
      }
      
      console.log('Creating sale with final customer ID:', finalCustomerId);
      await createSaleMutation.mutateAsync({
        customer_id: finalCustomerId === 'none' ? undefined : finalCustomerId || undefined,
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
        commission_rate: 0
      });
      
      onClose();
      resetForm();
    } catch (error) {
      console.error('Erro ao criar venda:', error);
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
    handleNewCustomerCreated,
    tempCustomers,
    createSaleMutation
  };
};
