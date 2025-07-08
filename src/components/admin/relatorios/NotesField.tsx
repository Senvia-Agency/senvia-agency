
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "./types";

interface NotesFieldProps {
  form: UseFormReturn<FormData>;
}

export const NotesField = ({ form }: NotesFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Observações</FormLabel>
          <FormControl>
            <Textarea 
              {...field} 
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Adicione observações sobre a campanha..."
              rows={3}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
