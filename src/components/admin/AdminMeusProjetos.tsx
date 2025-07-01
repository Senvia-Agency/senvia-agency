
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Meus Projetos</h1>
        <p className="text-gray-400">
          Acompanhe o progresso de todos os projetos sob sua responsabilidade
        </p>
        {user && (
          <p className="text-xs text-gray-500 mt-1">
            Debug: Usuário logado - ID: {user.id}
          </p>
        )}
      </div>

      <div className="grid gap-6">
        {/* Filters */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FolderOpen className="h-5 w-5" />
              Filtros
            </CardTitle>
            <CardDescription className="text-gray-400">
              Use os filtros abaixo para encontrar projetos específicos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectFilters filters={filters} onFiltersChange={setFilters} />
          </CardContent>
        </Card>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-yellow-400">Debug Info</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-300">
              <div>User ID: {user?.id || 'N/A'}</div>
              <div>Projects Found: {projects?.length || 0}</div>
              <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
              <div>Error: {error?.message || 'None'}</div>
              <div>Filters: {JSON.stringify(filters)}</div>
            </CardContent>
          </Card>
        )}

        {/* Projects List */}
        <ProjectsList 
          projects={projects} 
          isLoading={isLoading} 
          error={error}
          isDarkTheme={true}
        />
      </div>
    </div>
  );
};

export default AdminMeusProjetos;
