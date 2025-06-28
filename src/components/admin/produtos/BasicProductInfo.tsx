
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicProductInfoProps {
  formData: {
    name: string;
    description: string;
    category: string;
    pricing_model: string;
  };
  onFormDataChange: (data: any) => void;
}

const BasicProductInfo = ({ formData, onFormDataChange }: BasicProductInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-slate-200">Informações Básicas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Nome do Produto</label>
          <Input
            value={formData.name}
            onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
            placeholder="Nome do produto"
            required
            className="bg-slate-700 border-slate-600 text-slate-100"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Categoria</label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => onFormDataChange({ ...formData, category: value })}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="assistant">Assistant</SelectItem>
              <SelectItem value="landing_pages">Landing Pages</SelectItem>
              <SelectItem value="websites">Websites</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Tipo de Pagamento</label>
        <Select 
          value={formData.pricing_model} 
          onValueChange={(value) => onFormDataChange({ ...formData, pricing_model: value })}
        >
          <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            <SelectItem value="subscription">Assinatura (Recorrente)</SelectItem>
            <SelectItem value="payment">Pagamento Único</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-slate-400 mt-1">
          {formData.pricing_model === 'subscription' 
            ? 'Cliente será cobrado mensalmente/anualmente'
            : 'Cliente paga uma única vez pelo produto'
          }
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
        <Textarea
          value={formData.description}
          onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
          placeholder="Descrição detalhada do produto"
          className="bg-slate-700 border-slate-600 text-slate-100"
          rows={3}
        />
      </div>
    </div>
  );
};

export default BasicProductInfo;
