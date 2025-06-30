
import { Label } from "@/components/ui/label";
import { useCustomers } from "@/hooks/useCustomers";
import CustomerDropdown from "./customer-search/CustomerDropdown";
import NewCustomerDialog from "./customer-search/NewCustomerDialog";

interface CustomerSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onNewCustomerCreated?: (customer: any) => void;
}

const CustomerSearchField = ({ value, onChange, onNewCustomerCreated }: CustomerSearchFieldProps) => {
  const { data: customers, isLoading, error } = useCustomers();

  console.log('CustomerSearchField - customers:', customers);
  console.log('CustomerSearchField - value:', value);

  return (
    <div className="space-y-2">
      <Label className="text-gray-300">Cliente (Opcional)</Label>
      <div className="flex gap-2">
        <CustomerDropdown
          customers={customers || []}
          value={value}
          onChange={onChange}
        />
        
        <NewCustomerDialog
          onCustomerCreated={onNewCustomerCreated || (() => {})}
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
