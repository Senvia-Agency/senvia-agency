
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { CompactProjectsList } from "@/components/projects/CompactProjectsList";
import { useCustomerProjects } from "@/hooks/useCustomerProjects";
import { Package } from "lucide-react";

const MeusProjetos = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateRange: 'all'
  });

  const { data: projects, isLoading, error } = useCustomerProjects(user?.id, filters);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Você precisa estar logado para ver seus projetos.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Projetos</h1>
          <p className="text-gray-600">
            Acompanhe o progresso de todos os seus projetos
          </p>
        </div>

        <div className="grid gap-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Filtros
              </CardTitle>
              <CardDescription>
                Use os filtros abaixo para encontrar projetos específicos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectFilters filters={filters} onFiltersChange={setFilters} />
            </CardContent>
          </Card>

          {/* Projects List */}
          <CompactProjectsList 
            projects={projects} 
            isLoading={isLoading} 
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default MeusProjetos;
