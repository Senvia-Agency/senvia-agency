import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "./types";

interface MetricsFieldsProps {
  form: UseFormReturn<FormData>;
}

export const MetricsFields = ({ form }: MetricsFieldsProps) => {
  const handleDecimalInput = (value: string, onChange: (value: number | undefined) => void) => {
    if (value === "") {
      onChange(undefined);
      return;
    }
    
    // Permitir apenas números, vírgulas e pontos
    const cleanValue = value.replace(/[^0-9.,]/g, '');
    
    // Se o valor limpo é diferente do original, rejeitar a entrada
    if (cleanValue !== value) {
      return;
    }
    
    // Converter vírgula para ponto para parsing
    const normalizedValue = cleanValue.replace(/,/g, '.');
    
    // Validar se é um número válido
    if (normalizedValue !== '' && !isNaN(parseFloat(normalizedValue))) {
      onChange(parseFloat(normalizedValue));
    } else if (normalizedValue === '' || normalizedValue === '.') {
      // Permitir valores parciais enquanto digita
      onChange(undefined);
    }
  };

  const handleIntegerInput = (value: string, onChange: (value: number | undefined) => void) => {
    if (value === "") {
      onChange(undefined);
      return;
    }
    
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name="ad_sets_count"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Conjuntos de Anúncios</FormLabel>
            <FormControl>
              <Input 
                type="number"
                min="0"
                value={field.value?.toString() || ""}
                onChange={(e) => handleIntegerInput(e.target.value, field.onChange)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Ex: 5"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="impressions"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Impressões</FormLabel>
            <FormControl>
              <Input 
                type="number"
                min="0"
                value={field.value?.toString() || ""}
                onChange={(e) => handleIntegerInput(e.target.value, field.onChange)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Ex: 14226"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="clicks"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Cliques</FormLabel>
            <FormControl>
              <Input 
                type="number"
                min="0"
                value={field.value?.toString() || ""}
                onChange={(e) => handleIntegerInput(e.target.value, field.onChange)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Ex: 249"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ctr"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">CTR (%) - Automático</FormLabel>
            <FormControl>
              <Input 
                type="text"
                value={field.value?.toFixed(2) || ""}
                readOnly
                className="bg-gray-700 border-gray-600 text-gray-300 cursor-not-allowed"
                placeholder="Calculado automaticamente"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cpc"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">CPC (€)</FormLabel>
            <FormControl>
              <Input 
                type="text"
                value={field.value?.toString() || ""}
                onChange={(e) => handleDecimalInput(e.target.value, field.onChange)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Ex: 0,07 ou 0.07"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="spend"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Investimento (€)</FormLabel>
            <FormControl>
              <Input 
                type="text"
                value={field.value?.toString() || ""}
                onChange={(e) => handleDecimalInput(e.target.value, field.onChange)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Ex: 100,50 ou 100.50"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="conversions"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Conversões</FormLabel>
            <FormControl>
              <Input 
                type="number"
                min="0"
                value={field.value?.toString() || ""}
                onChange={(e) => handleIntegerInput(e.target.value, field.onChange)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Ex: 12"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="conversion_rate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Taxa de Conversão (%) - Automático</FormLabel>
            <FormControl>
              <Input 
                type="text"
                value={field.value?.toFixed(2) || ""}
                readOnly
                className="bg-gray-700 border-gray-600 text-gray-300 cursor-not-allowed"
                placeholder="Calculado automaticamente"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cost_per_conversion"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Custo por Conversão (€) - Automático</FormLabel>
            <FormControl>
              <Input 
                type="text"
                value={field.value?.toFixed(2) || ""}
                readOnly
                className="bg-gray-700 border-gray-600 text-gray-300 cursor-not-allowed"
                placeholder="Calculado automaticamente"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="roas"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">ROAS - Automático</FormLabel>
            <FormControl>
              <Input 
                type="text"
                value={field.value?.toFixed(2) || ""}
                readOnly
                className="bg-gray-700 border-gray-600 text-gray-300 cursor-not-allowed"
                placeholder="Calculado automaticamente"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};