
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { ProjectsList } from "@/components/projects/ProjectsList";
import { useAdminProjects } from "@/hooks/useAdminProjects";
import { FolderOpen } from "lucide-react";

const AdminMeusProjetos = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateRange: 'all'
  });

  console.log('👤 AdminMeusProjetos - User ID:', user?.id);
  console.log('🔍 AdminMeusProjetos - Filtros atuais:', filters);

  const { data: projects, isLoading, error } = useAdminProjects(user?.id, filters);

  console.log('📊 AdminMeusProjetos - Estado da query:', {
    projectsCount: projects?.length || 0,
    isLoading,
    hasError: !!error,
    error: error?.message
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">Meus Projetos</h1>
        <p className="text-gray-400">
          Acompanhe o progresso dos seus projetos de forma simplificada
        </p>
      </div>

      {/* Filters - Compact Version */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <ProjectFilters filters={filters} onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      {/* Projects List */}
      <ProjectsList 
        projects={projects} 
        isLoading={isLoading} 
        error={error}
        isDarkTheme={true}
      />
    </div>
  );
};

export default AdminMeusProjetos;
