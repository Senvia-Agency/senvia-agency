import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Euro, User, Package, AlertCircle, Eye, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getSaleStatusLabel } from "@/utils/saleStatusUtils";
import { ProjectDetailModal } from "./ProjectDetailModal";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { Project } from "./types";

interface ProjectsListProps {
  projects?: Project[];
  isLoading: boolean;
  error?: any;
  isDarkTheme?: boolean;
}

export const ProjectsList = ({ projects, isLoading, error, isDarkTheme = false }: ProjectsListProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: adminUsers } = useAdminUsers();
  const queryClient = useQueryClient();
  
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
    // Invalidate queries to refetch data without page reload
    queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
    queryClient.invalidateQueries({ queryKey: ['admin-sales'] });
    queryClient.invalidateQueries({ queryKey: ['sales'] });
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
      case 'pending': return isDarkTheme ? 'bg-yellow-900/20 text-yellow-300 border-yellow-700' : 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return isDarkTheme ? 'bg-blue-900/20 text-blue-300 border-blue-700' : 'bg-blue-100 text-blue-800';
      case 'in_progress': return isDarkTheme ? 'bg-purple-900/20 text-purple-300 border-purple-700' : 'bg-purple-100 text-purple-800';
      case 'completed': return isDarkTheme ? 'bg-green-900/20 text-green-300 border-green-700' : 'bg-green-100 text-green-800';
      case 'cancelled': return isDarkTheme ? 'bg-red-900/20 text-red-300 border-red-700' : 'bg-red-100 text-red-800';
      default: return isDarkTheme ? 'bg-gray-800 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentProgress = (paid: number, total: number) => {
    return total > 0 ? (paid / total) * 100 : 0;
  };

  return (
    <>
      <Card className={cardClass}>
        <CardHeader className="pb-4">
          <CardTitle className={`text-xl ${textClass} flex items-center gap-2`}>
            <Package className="h-5 w-5" />
            Projetos ({projects?.length || 0})
          </CardTitle>
          <CardDescription className={mutedTextClass}>
            Lista compacta dos seus projetos
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {projects.map((project, index) => (
              <div 
                key={project.id}
                className={`
                  group flex items-center justify-between p-4 
                  hover:bg-gray-700/50 
                  transition-all duration-200 cursor-pointer
                  border-b last:border-b-0
                  ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}
                  animate-fade-in
                `}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleProjectClick(project)}
              >
                {/* Main Project Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    {/* Project Number Badge */}
                    <div className={`
                      flex-shrink-0 w-16 h-8 rounded-md flex items-center justify-center text-xs font-mono
                      ${isDarkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}
                    `}>
                      #{project.sale_number.split('-')[1]}
                    </div>
                    
                    {/* Project Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium truncate ${textClass}`}>
                          {project.service_name}
                        </h3>
                        <Badge variant="outline" className={getStatusColor(project.sale_status)}>
                          {getSaleStatusLabel(project.sale_status)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        {/* Client */}
                        {project.customers && (
                          <div className={`flex items-center gap-1 ${mutedTextClass}`}>
                            <User className="h-3 w-3" />
                            <span className="truncate max-w-32">
                              {project.customers.company_name || project.customers.full_name}
                            </span>
                          </div>
                        )}
                        
                        {/* Payment Progress */}
                        <div className={`flex items-center gap-2 ${mutedTextClass}`}>
                          <Euro className="h-3 w-3" />
                          <span className="font-mono">
                            €{project.paid_amount.toFixed(0)}/€{project.total_value.toFixed(0)}
                          </span>
                          <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 transition-all duration-300"
                              style={{ width: `${getPaymentProgress(project.paid_amount, project.total_value)}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">
                            {getPaymentProgress(project.paid_amount, project.total_value).toFixed(0)}%
                          </span>
                        </div>
                        
                        {/* Due Date */}
                        {project.expected_delivery_date && (
                          <div className={`flex items-center gap-1 ${mutedTextClass}`}>
                            <Calendar className="h-3 w-3" />
                            <span className="text-xs">
                              {format(new Date(project.expected_delivery_date), 'dd/MM', { locale: ptBR })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="flex-shrink-0 ml-4">
                  <div className={`
                    group-hover:opacity-100 opacity-0 transition-opacity duration-200
                    flex items-center gap-2 ${mutedTextClass}
                  `}>
                    <span className="text-xs font-medium">Ver detalhes</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
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
