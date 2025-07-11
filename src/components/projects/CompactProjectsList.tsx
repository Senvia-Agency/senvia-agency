import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Euro, User, Package, AlertCircle, Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getSaleStatusLabel } from "@/utils/saleStatusUtils";
import { ProjectDetailModal } from "./ProjectDetailModal";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { Project } from "./types";

interface CompactProjectsListProps {
  projects?: Project[];
  isLoading: boolean;
  error?: any;
  isDarkTheme?: boolean;
}

export const CompactProjectsList = ({ projects, isLoading, error, isDarkTheme = false }: CompactProjectsListProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: adminUsers } = useAdminUsers();
  
  const cardClass = isDarkTheme ? "bg-gray-800 border-gray-700" : "";
  const textClass = isDarkTheme ? "text-white" : "text-gray-900";
  const mutedTextClass = isDarkTheme ? "text-gray-400" : "text-gray-500";

  const getAssignedUserName = (assignedTo?: string) => {
    if (!assignedTo) return 'Não atribuído';
    
    const user = adminUsers?.find(u => u.user_id === assignedTo || u.email === assignedTo);
    return user?.full_name || assignedTo;
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleProjectUpdate = () => {
    // Trigger a refetch of the projects data
    window.location.reload();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentProgress = (paid: number, total: number) => {
    return total > 0 ? (paid / total) * 100 : 0;
  };

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
        <CardContent className="py-12">
          <div className="text-center">
            <Package className={`h-16 w-16 ${mutedTextClass} mx-auto mb-4`} />
            <h3 className={`text-xl font-medium ${textClass} mb-2`}>
              Nenhum projeto encontrado
            </h3>
            <p className={mutedTextClass}>
              Você ainda não possui projetos ou nenhum projeto corresponde aos filtros aplicados.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${textClass}`}>
            <Package className="h-5 w-5" />
            Seus Projetos
          </CardTitle>
          <CardDescription className={mutedTextClass}>
            {projects.length} projeto{projects.length !== 1 ? 's' : ''} encontrado{projects.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                className={`
                  flex items-center justify-between p-4 cursor-pointer transition-all duration-200
                  hover:bg-gray-50 border-l-4 border-transparent hover:border-primary
                  ${index !== projects.length - 1 ? 'border-b border-gray-100' : ''}
                  ${isDarkTheme ? 'hover:bg-gray-700 border-gray-600' : ''}
                `}
                onClick={() => handleProjectClick(project)}
              >
                {/* Informações principais do projeto */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  {/* Nome do projeto e número */}
                  <div className="md:col-span-2">
                    <div className={`font-medium ${textClass} truncate`}>
                      {project.service_name}
                    </div>
                    <div className={`text-sm ${mutedTextClass}`}>
                      #{project.sale_number}
                    </div>
                    {project.customers && (
                      <div className={`text-xs ${mutedTextClass} truncate`}>
                        {project.customers.company_name || project.customers.full_name}
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex justify-center">
                    <Badge className={`${getStatusColor(project.sale_status)} text-xs px-2 py-1`}>
                      {getSaleStatusLabel(project.sale_status)}
                    </Badge>
                  </div>

                  {/* Progresso do pagamento */}
                  <div className="space-y-1">
                    <div className={`flex justify-between text-xs ${textClass}`}>
                      <span>€{project.paid_amount.toFixed(0)}</span>
                      <span>€{project.total_value.toFixed(0)}</span>
                    </div>
                    <Progress 
                      value={getPaymentProgress(project.paid_amount, project.total_value)} 
                      className="h-1.5"
                    />
                    <div className={`text-xs ${mutedTextClass} text-center`}>
                      {getPaymentProgress(project.paid_amount, project.total_value).toFixed(0)}% pago
                    </div>
                  </div>

                  {/* Data de início */}
                  <div className="text-center">
                    <div className={`text-sm ${textClass}`}>
                      {format(new Date(project.sale_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                    <div className={`text-xs ${mutedTextClass}`}>
                      Início
                    </div>
                  </div>

                  {/* Data de entrega */}
                  <div className="text-center">
                    {project.delivered_at ? (
                      <>
                        <div className={`text-sm text-green-600 font-medium`}>
                          {format(new Date(project.delivered_at), 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                        <div className={`text-xs text-green-600`}>
                          Entregue
                        </div>
                      </>
                    ) : project.expected_delivery_date ? (
                      <>
                        <div className={`text-sm ${textClass}`}>
                          {format(new Date(project.expected_delivery_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                        <div className={`text-xs ${mutedTextClass}`}>
                          Previsão
                        </div>
                      </>
                    ) : (
                      <div className={`text-xs ${mutedTextClass}`}>
                        Não definida
                      </div>
                    )}
                  </div>
                </div>

                {/* Ação de ver detalhes */}
                <div className="flex items-center gap-2 ml-4">
                  <Eye className={`h-4 w-4 ${mutedTextClass} hover:text-primary transition-colors`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUpdate={handleProjectUpdate}
      />
    </>
  );
};