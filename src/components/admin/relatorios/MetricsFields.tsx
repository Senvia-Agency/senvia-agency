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
import { useState, useEffect } from "react";

interface MetricsFieldsProps {
  form: UseFormReturn<FormData>;
}

export const MetricsFields = ({ form }: MetricsFieldsProps) => {
  // Estados para valores de display dos campos decimais
  const [cpcDisplay, setCpcDisplay] = useState<string>("");
  const [spendDisplay, setSpendDisplay] = useState<string>("");

  // Sincronizar estados de display com valores do form
  const formValues = form.watch();
  
  useEffect(() => {
    // Se os valores do form foram resetados (são undefined), resetar os displays também
    if (formValues.cpc === undefined) {
      setCpcDisplay("");
    } else if (cpcDisplay === "" && formValues.cpc !== undefined) {
      setCpcDisplay(formValues.cpc.toString());
    }
    
    if (formValues.spend === undefined) {
      setSpendDisplay("");
    } else if (spendDisplay === "" && formValues.spend !== undefined) {
      setSpendDisplay(formValues.spend.toString());
    }
  }, [formValues.cpc, formValues.spend, cpcDisplay, spendDisplay]);

  const handleDecimalInput = (
    value: string, 
    onChange: (value: number | undefined) => void,
    setDisplay: (value: string) => void
  ) => {
    // Permitir entrada vazia
    if (value === "") {
      setDisplay("");
      onChange(undefined);
      return;
    }

    // Permitir apenas números, vírgulas e pontos
    if (/^[0-9.,]*$/.test(value)) {
      // Sempre mostrar o que o usuário digitou
      setDisplay(value);
      
      // Se não termina com vírgula ou ponto, converter para número
      if (!value.endsWith(',') && !value.endsWith('.')) {
        const normalized = value.replace(/,/g, '.');
        const num = parseFloat(normalized);
        if (!isNaN(num)) {
          onChange(num);
        }
      } else {
        // Se termina com vírgula ou ponto, não enviar valor ainda mas guardar estado
        const normalized = value.replace(/,/g, '.');
        const num = parseFloat(normalized.slice(0, -1));
        if (!isNaN(num)) {
          onChange(num);
        }
      }
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
                value={field.value ? field.value.toFixed(4) : ""}
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
                value={cpcDisplay || field.value?.toString() || ""}
                onChange={(e) => handleDecimalInput(e.target.value, field.onChange, setCpcDisplay)}
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
                value={spendDisplay || field.value?.toString() || ""}
                onChange={(e) => handleDecimalInput(e.target.value, field.onChange, setSpendDisplay)}
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
                value={field.value ? field.value.toFixed(4) + "%" : ""}
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
                value={field.value ? "€" + field.value.toFixed(2) : ""}
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
                value={field.value ? field.value.toFixed(2) + "x" : ""}
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