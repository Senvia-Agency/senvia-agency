import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Euro, User, Package, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Project {
  id: string;
  sale_number: string;
  service_name: string;
  service_description?: string;
  total_value: number;
  paid_amount: number;
  sale_status: string;
  payment_status: string;
  sale_date: string;
  expected_delivery_date?: string;
  delivered_at?: string;
  assigned_to?: string;
  customers?: {
    full_name: string;
    email: string;
    phone?: string;
    company_name?: string;
  };
}

interface ProjectsListProps {
  projects?: Project[];
  isLoading: boolean;
  error?: any;
  isDarkTheme?: boolean;
}

export const ProjectsList = ({ projects, isLoading, error, isDarkTheme = false }: ProjectsListProps) => {
  const cardClass = isDarkTheme ? "bg-gray-800 border-gray-700" : "";
  const textClass = isDarkTheme ? "text-white" : "text-gray-900";
  const mutedTextClass = isDarkTheme ? "text-gray-400" : "text-gray-500";

  if (isLoading) {
    return (
      <Card className={cardClass}>
        <CardContent className="py-8">
          <div className="text-center">
            <p className={mutedTextClass}>Carregando projetos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cardClass}>
        <CardContent className="py-8">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">Erro ao carregar projetos</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <Card className={cardClass}>
        <CardContent className="py-8">
          <div className="text-center">
            <Package className={`h-8 w-8 ${mutedTextClass} mx-auto mb-2`} />
            <h3 className={`text-lg font-medium ${textClass} mb-1`}>
              Nenhum projeto encontrado
            </h3>
            <p className={mutedTextClass}>
              {isDarkTheme ? 
                "Não há projetos atribuídos a você ou nenhum projeto corresponde aos filtros aplicados." :
                "Você ainda não possui projetos ou nenhum projeto corresponde aos filtros aplicados."
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'in_progress': return 'Em Progresso';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getPaymentProgress = (paid: number, total: number) => {
    return total > 0 ? (paid / total) * 100 : 0;
  };

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id} className={`${cardClass} hover:shadow-md transition-shadow`}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className={`text-lg ${textClass}`}>
                  {project.service_name}
                </CardTitle>
                <CardDescription className={`mt-1 ${mutedTextClass}`}>
                  Projeto #{project.sale_number}
                </CardDescription>
                {project.customers && (
                  <CardDescription className={`mt-1 ${mutedTextClass}`}>
                    Cliente: {project.customers.company_name || project.customers.full_name}
                  </CardDescription>
                )}
              </div>
              <Badge className={getStatusColor(project.sale_status)}>
                {getStatusLabel(project.sale_status)}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {project.service_description && (
              <p className={`text-sm ${mutedTextClass}`}>
                {project.service_description}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Payment Info */}
              <div className="space-y-2">
                <div className={`flex items-center gap-2 text-sm ${mutedTextClass}`}>
                  <Euro className="h-4 w-4" />
                  <span>Pagamento</span>
                </div>
                <div className="space-y-1">
                  <div className={`flex justify-between text-sm ${textClass}`}>
                    <span>€{project.paid_amount.toFixed(2)} / €{project.total_value.toFixed(2)}</span>
                    <span>{getPaymentProgress(project.paid_amount, project.total_value).toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={getPaymentProgress(project.paid_amount, project.total_value)} 
                    className="h-2"
                  />
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-2">
                <div className={`flex items-center gap-2 text-sm ${mutedTextClass}`}>
                  <Calendar className="h-4 w-4" />
                  <span>Cronograma</span>
                </div>
                <div className={`text-sm space-y-1 ${textClass}`}>
                  <div>
                    <span className={mutedTextClass}>Início:</span>
                    <span className="ml-2">
                      {format(new Date(project.sale_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                  {project.expected_delivery_date && (
                    <div>
                      <span className={mutedTextClass}>Entrega prevista:</span>
                      <span className="ml-2">
                        {format(new Date(project.expected_delivery_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                  )}
                  {project.delivered_at && (
                    <div>
                      <span className={mutedTextClass}>Entregue em:</span>
                      <span className="ml-2 text-green-600">
                        {format(new Date(project.delivered_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {project.assigned_to && (
              <div className={`flex items-center gap-2 text-sm ${mutedTextClass} pt-2 border-t ${isDarkTheme ? 'border-gray-700' : ''}`}>
                <User className="h-4 w-4" />
                <span>Responsável: {project.assigned_to}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
