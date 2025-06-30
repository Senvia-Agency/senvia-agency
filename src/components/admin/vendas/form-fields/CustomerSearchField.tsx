
import { Label } from "@/components/ui/label";
import { useCustomers } from "@/hooks/useCustomers";
import CustomerDropdown from "./customer-search/CustomerDropdown";
import NewCustomerDialog from "./customer-search/NewCustomerDialog";
import { useState, useEffect } from "react";

interface CustomerSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onNewCustomerCreated?: (customer: any) => void;
  tempCustomers?: any[];
}

const CustomerSearchField = ({ 
  value, 
  onChange, 
  onNewCustomerCreated, 
  tempCustomers = [] 
}: CustomerSearchFieldProps) => {
  const { data: customers, isLoading, error } = useCustomers();
  const [allCustomers, setAllCustomers] = useState<any[]>([]);

  console.log('CustomerSearchField - customers:', customers);
  console.log('CustomerSearchField - tempCustomers:', tempCustomers);
  console.log('CustomerSearchField - value:', value);

  // Combinar clientes reais com temporários
  useEffect(() => {
    const realCustomers = customers || [];
    const combined = [...realCustomers, ...tempCustomers];
    setAllCustomers(combined);
    console.log('CustomerSearchField - combined customers:', combined);
  }, [customers, tempCustomers]);

  const handleNewCustomer = (newCustomer: any) => {
    console.log('CustomerSearchField - new customer received:', newCustomer);
    if (onNewCustomerCreated) {
      onNewCustomerCreated(newCustomer);
      // Selecionar automaticamente o novo cliente
      onChange(newCustomer.id);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-gray-300">Cliente (Opcional)</Label>
      <div className="flex gap-2">
        <CustomerDropdown
          customers={allCustomers}
          value={value}
          onChange={onChange}
        />
        
        <NewCustomerDialog
          onCustomerCreated={handleNewCustomer}
        />
      </div>
      
      {isLoading && (
        <p className="text-sm text-gray-400">Carregando clientes...</p>
      )}
      
      {error && (
        <p className="text-sm text-red-400">Erro ao carregar clientes</p>
      )}
    </div>
  );
};

export default CustomerSearchField;
