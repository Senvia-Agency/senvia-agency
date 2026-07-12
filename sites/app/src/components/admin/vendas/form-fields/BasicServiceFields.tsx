
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BasicServiceFieldsProps {
  serviceName: string;
  serviceDescription: string;
  onServiceNameChange: (value: string) => void;
  onServiceDescriptionChange: (value: string) => void;
}

const BasicServiceFields = ({ 
  serviceName, 
  serviceDescription, 
  onServiceNameChange, 
  onServiceDescriptionChange 
}: BasicServiceFieldsProps) => {
  return (
    <>
      <div>
        <Label className="text-gray-300">Nome do Serviço *</Label>
        <Input
          value={serviceName}
          onChange={(e) => onServiceNameChange(e.target.value)}
          placeholder="Digite o nome do serviço"
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>

      <div>
        <Label className="text-gray-300">Descrição</Label>
        <Textarea
          value={serviceDescription}
          onChange={(e) => onServiceDescriptionChange(e.target.value)}
          placeholder="Descrição do serviço"
          className="bg-gray-700 border-gray-600 text-white"
        />
      </div>
    </>
  );
};

export default BasicServiceFields;
