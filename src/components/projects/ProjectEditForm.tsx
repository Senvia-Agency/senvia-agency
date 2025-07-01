
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Project } from "./types";

interface ProjectEditFormProps {
  project: Project;
  onEditedProjectChange: (editedProject: Partial<Project>) => void;
}

export const ProjectEditForm = ({ project, onEditedProjectChange }: ProjectEditFormProps) => {
  const [editedProject, setEditedProject] = useState<Partial<Project>>({});

  const handleChange = (field: keyof Project, value: any) => {
    const updated = { ...editedProject, [field]: value };
    setEditedProject(updated);
    onEditedProjectChange(updated);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="service_name">Nome do Serviço</Label>
          <Input
            id="service_name"
            defaultValue={project.service_name}
            onChange={(e) => handleChange('service_name', e.target.value)}
            className="bg-gray-700 border-gray-600"
          />
        </div>

        <div>
          <Label htmlFor="service_description">Descrição</Label>
          <Textarea
            id="service_description"
            defaultValue={project.service_description || ''}
            rows={3}
            onChange={(e) => handleChange('service_description', e.target.value)}
            className="bg-gray-700 border-gray-600"
          />
        </div>

        <div>
          <Label htmlFor="sale_status">Status do Projeto</Label>
          <Select
            defaultValue={project.sale_status}
            onValueChange={(value) => handleChange('sale_status', value)}
          >
            <SelectTrigger className="bg-gray-700 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="confirmed">Confirmado</SelectItem>
              <SelectItem value="in_progress">Em Progresso</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="total_value">Valor Total</Label>
            <Input
              id="total_value"
              type="number"
              step="0.01"
              defaultValue={project.total_value}
              onChange={(e) => handleChange('total_value', parseFloat(e.target.value))}
              className="bg-gray-700 border-gray-600"
            />
          </div>
          <div>
            <Label htmlFor="paid_amount">Valor Pago</Label>
            <Input
              id="paid_amount"
              type="number"
              step="0.01"
              defaultValue={project.paid_amount}
              onChange={(e) => handleChange('paid_amount', parseFloat(e.target.value))}
              className="bg-gray-700 border-gray-600"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="expected_delivery_date">Data de Entrega Prevista</Label>
          <Input
            id="expected_delivery_date"
            type="date"
            defaultValue={project.expected_delivery_date ? project.expected_delivery_date.split('T')[0] : ''}
            onChange={(e) => handleChange('expected_delivery_date', e.target.value)}
            className="bg-gray-700 border-gray-600"
          />
        </div>
      </div>
    </div>
  );
};
