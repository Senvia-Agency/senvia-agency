
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryFieldProps {
  value: string;
  movementType: 'receita' | 'despesa';
  onChange: (value: string) => void;
}

const CategoryField = ({ value, movementType, onChange }: CategoryFieldProps) => {
  const receitaCategories = ['vendas_landing_pages', 'assinaturas', 'consultoria', 'outros_servicos'];
  const despesaCategories = ['infraestrutura', 'marketing', 'saas', 'taxas', 'operacional', 'outros'];

  const categories = movementType === 'receita' ? receitaCategories : despesaCategories;

  return (
    <div>
      <label className="text-sm font-medium text-gray-300">Categoria</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-gray-700 border-gray-600">
          <SelectValue placeholder="Selecionar categoria" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(cat => (
            <SelectItem key={cat} value={cat}>
              {cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategoryField;
