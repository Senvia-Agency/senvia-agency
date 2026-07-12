
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicInfoFieldsProps {
  formData: {
    full_name: string;
    email: string;
    phone: string;
    company_name: string;
    website: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const BasicInfoFields = ({ formData, onInputChange }: BasicInfoFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label className="text-sm font-medium text-gray-300">Nome Completo</Label>
        <Input
          value={formData.full_name}
          onChange={(e) => onInputChange('full_name', e.target.value)}
          className="bg-gray-700 border-gray-600 text-white mt-1"
          required
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-300">Email</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          className="bg-gray-700 border-gray-600 text-white mt-1"
          required
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-300">Telefone</Label>
        <Input
          value={formData.phone}
          onChange={(e) => onInputChange('phone', e.target.value)}
          className="bg-gray-700 border-gray-600 text-white mt-1"
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-300">Empresa</Label>
        <Input
          value={formData.company_name}
          onChange={(e) => onInputChange('company_name', e.target.value)}
          className="bg-gray-700 border-gray-600 text-white mt-1"
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-300">Website</Label>
        <Input
          value={formData.website}
          onChange={(e) => onInputChange('website', e.target.value)}
          className="bg-gray-700 border-gray-600 text-white mt-1"
        />
      </div>
    </div>
  );
};

export default BasicInfoFields;
