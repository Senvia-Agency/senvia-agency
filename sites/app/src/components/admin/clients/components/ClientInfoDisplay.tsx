
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ClientInfoDisplayProps {
  client: any;
}

export const ClientInfoDisplay = ({ client }: ClientInfoDisplayProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <label className="text-sm font-medium text-gray-300">Cliente desde</label>
        <p className="text-sm text-gray-400 mt-1">
          {format(new Date(client.acquisition_date), 'dd/MM/yyyy', { locale: ptBR })}
        </p>
      </div>
    </div>
  );
};