
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getSaleStatusLabel } from "@/utils/saleStatusUtils";
import { Project } from "./types";

interface ProjectInfoProps {
  project: Project;
}

export const ProjectInfo = ({ project }: ProjectInfoProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl text-white">{project.service_name}</h2>
          <p className="text-gray-400 mt-1">Projeto #{project.sale_number}</p>
        </div>
        <Badge className={getStatusColor(project.sale_status)}>
          {getSaleStatusLabel(project.sale_status)}
        </Badge>
      </div>

      {/* Customer Info */}
      {project.customers && (
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Cliente
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Nome:</span>
              <p>{project.customers.company_name || project.customers.full_name}</p>
            </div>
            <div>
              <span className="text-gray-400">Email:</span>
              <p>{project.customers.email}</p>
            </div>
            {project.customers.phone && (
              <div>
                <span className="text-gray-400">Telefone:</span>
                <p>{project.customers.phone}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timeline Info */}
      <div className="space-y-2 text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Criado em: {format(new Date(project.sale_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
        </div>
        {project.delivered_at && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-400" />
            <span>Entregue em: {format(new Date(project.delivered_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
          </div>
        )}
      </div>
    </div>
  );
};
