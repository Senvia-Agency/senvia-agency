
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProjectInfo } from "./ProjectInfo";
import { ProjectEditForm } from "./ProjectEditForm";
import { ProjectCancellation } from "./ProjectCancellation";
import { Project, ProjectDetailModalProps } from "./types";

export const ProjectDetailModal = ({ project, isOpen, onClose, onUpdate }: ProjectDetailModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [editedProject, setEditedProject] = useState<Partial<Project>>({});

  if (!project) return null;

  const handleUpdate = async () => {
    if (!editedProject || Object.keys(editedProject).length === 0) {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('sales')
        .update(editedProject)
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: "Projeto atualizado",
        description: "As alterações foram salvas com sucesso.",
      });

      onUpdate();
      onClose();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar projeto",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="sr-only">Detalhes do Projeto</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <ProjectInfo project={project} />
          
          <ProjectEditForm 
            project={project} 
            onEditedProjectChange={setEditedProject}
          />

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t border-gray-600">
            <ProjectCancellation 
              project={project} 
              onUpdate={onUpdate} 
              onClose={onClose} 
            />

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="border-gray-600 text-gray-300">
                Fechar
              </Button>
              <Button onClick={handleUpdate} disabled={isLoading} className="bg-senvia-500 hover:bg-senvia-600">
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
