
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Eye, Edit, Settings } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useCustomServices } from "@/hooks/useCustomServices";
import CreateCustomServiceModal from "./CreateCustomServiceModal";
import CustomServiceDetailModal from "./CustomServiceDetailModal";
import EditCustomServiceModal from "./EditCustomServiceModal";

const CustomServicesSection = () => {
  const { data: customServices, isLoading } = useCustomServices();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleViewDetails = (service: any) => {
    setSelectedService(service);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (service: any) => {
    setSelectedService(service);
    setIsEditModalOpen(true);
  };

  const getServiceIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      'custom': '⚙️',
      'landing_pages': '📄',
      'websites': '🌐',
      'ecommerce': '🛒',
      'design': '🎨',
      'marketing': '📈'
    };
    return iconMap[category] || '⚙️';
  };

  return (
    <>
      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <CardTitle className="flex items-center gap-2 text-slate-100 text-base sm:text-lg">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-senvia-500 flex-shrink-0" />
              <span>Serviços Personalizados</span>
            </CardTitle>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto bg-senvia-500 hover:bg-senvia-400 text-slate-900 text-sm sm:text-base"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Novo Serviço
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {isLoading ? (
            <div className="text-center py-8 text-slate-400 text-sm sm:text-base">
              Carregando serviços...
            </div>
          ) : customServices && customServices.length > 0 ? (
            <div className="border border-slate-600/50 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-600/50 bg-slate-700/50">
                    <TableHead className="text-slate-300">Serviço</TableHead>
                    <TableHead className="text-slate-300">Categoria</TableHead>
                    <TableHead className="text-slate-300">Preço Base</TableHead>
                    <TableHead className="text-slate-300">Tipo</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customServices.map((service) => (
                    <TableRow key={service.id} className="border-slate-600/50 hover:bg-slate-700/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getServiceIcon(service.category)}</span>
                          <div>
                            <div className="font-medium text-slate-100">{service.name}</div>
                            <div className="text-sm text-slate-400 truncate max-w-xs">
                              {service.description || 'Sem descrição'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-300 capitalize">
                          {service.category.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-senvia-400 font-medium">
                          €{service.base_price}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-300 capitalize">
                          {service.service_type.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={service.status === 'active' ? "default" : "secondary"} 
                          className={service.status === 'active' ? "bg-green-500/20 text-green-400 border-green-500/50" : ""}
                        >
                          {service.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-slate-600 text-slate-300 hover:bg-slate-600/50"
                            onClick={() => handleViewDetails(service)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-slate-600 text-slate-300 hover:bg-slate-600/50"
                            onClick={() => handleEdit(service)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Settings className="h-8 w-8 sm:h-12 sm:w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-slate-200 mb-2">Nenhum serviço personalizado</h3>
              <p className="text-slate-400 mb-4 text-sm sm:text-base">Crie seu primeiro serviço personalizado.</p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full sm:w-auto bg-senvia-500 hover:bg-senvia-400 text-slate-900 text-sm sm:text-base"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Novo Serviço
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateCustomServiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <CustomServiceDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        service={selectedService}
        onEdit={() => {
          setIsDetailModalOpen(false);
          setIsEditModalOpen(true);
        }}
      />

      <EditCustomServiceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        service={selectedService}
      />
    </>
  );
};

export default CustomServicesSection;
