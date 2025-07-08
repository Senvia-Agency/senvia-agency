
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "./types";

interface BasicFieldsProps {
  form: UseFormReturn<FormData>;
}

export const BasicFields = ({ form }: BasicFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="client_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Nome do Cliente</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Ex: Empresa ABC"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="campaign_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Nome da Campanha</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Ex: Campanha Verão 2024"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="report_period_start"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Data de Início</FormLabel>
            <FormControl>
              <Input 
                type="date"
                {...field} 
                className="bg-gray-800 border-gray-700 text-white"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="report_period_end"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Data de Fim</FormLabel>
            <FormControl>
              <Input 
                type="date"
                {...field} 
                className="bg-gray-800 border-gray-700 text-white"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="report_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Tipo de Relatório</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="final">Final</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
