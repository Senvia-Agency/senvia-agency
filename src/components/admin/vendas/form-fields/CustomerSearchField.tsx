
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
  const { data: customers } = useCustomers();

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
    </div>
  );
};

export default CustomerSearchField;
