import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ActivityHistorySection from "../shared/ActivityHistorySection";
import EntityContactsSection from "../shared/EntityContactsSection";

interface LeadDetailModalProps {
  selectedLead: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: any) => void;
}

const LeadDetailModal = ({ selectedLead, isOpen, onClose, onUpdate }: LeadDetailModalProps) => {
  const [editedLead, setEditedLead] = useState(selectedLead || {});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(editedLead);
    onClose();
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'new': 'bg-blue-500',
      'contacted': 'bg-yellow-500',
      'qualified': 'bg-green-500',
      'proposal': 'bg-purple-500',
      'negotiation': 'bg-orange-500',
      'converted': 'bg-emerald-500',
      'lost': 'bg-red-500'
    };
    return colorMap[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'new': 'Novo',
      'contacted': 'Contactado',
      'qualified': 'Qualificado',
      'proposal': 'Proposta Enviada',
      'negotiation': 'Negociação',
      'converted': 'Convertido',
      'lost': 'Perdido'
    };
    return statusMap[status] || status;
  };

  if (!selectedLead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-600 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes do Lead - {selectedLead.full_name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="activity">Histórico</TabsTrigger>
            <TabsTrigger value="contacts">Responsáveis</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Informações básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Nome Completo</label>
                  <Input
                    value={editedLead.full_name || ''}
                    onChange={(e) => setEditedLead(prev => ({ ...prev, full_name: e.target.value }))}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Email</label>
                  <Input
                    type="email"
                    value={editedLead.email || ''}
                    onChange={(e) => setEditedLead(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Telefone</label>
                  <Input
                    value={editedLead.phone || ''}
                    onChange={(e) => setEditedLead(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Empresa</label>
                  <Input
                    value={editedLead.company_name || ''}
                    onChange={(e) => setEditedLead(prev => ({ ...prev, company_name: e.target.value }))}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Status</label>
                  <Select 
                    value={editedLead.lead_status || 'new'} 
                    onValueChange={(value) => setEditedLead(prev => ({ ...prev, lead_status: value }))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="new">Novo</SelectItem>
                      <SelectItem value="contacted">Contactado</SelectItem>
                      <SelectItem value="qualified">Qualificado</SelectItem>
                      <SelectItem value="proposal">Proposta Enviada</SelectItem>
                      <SelectItem value="negotiation">Negociação</SelectItem>
                      <SelectItem value="converted">Convertido</SelectItem>
                      <SelectItem value="lost">Perdido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Status Atual</label>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedLead.lead_status)}`}></div>
                    <span className="text-sm text-gray-300">{getStatusLabel(selectedLead.lead_status)}</span>
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="text-sm font-medium text-gray-300">Notas</label>
                <Textarea
                  value={editedLead.notes || ''}
                  onChange={(e) => setEditedLead(prev => ({ ...prev, notes: e.target.value }))}
                  className="bg-gray-700 border-gray-600"
                  rows={4}
                  placeholder="Adicione observações sobre este lead..."
                />
              </div>

              {/* Datas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Data de Criação</label>
                  <p className="text-sm text-gray-400 mt-1">
                    {format(new Date(selectedLead.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Última Atualização</label>
                  <p className="text-sm text-gray-400 mt-1">
                    {format(new Date(selectedLead.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-gray-600"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-senvia-500 hover:bg-senvia-600"
                >
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="activity">
            <ActivityHistorySection 
              entityType="lead" 
              entityId={selectedLead.id} 
            />
          </TabsContent>

          <TabsContent value="contacts">
            <EntityContactsSection 
              entityType="lead" 
              entityId={selectedLead.id} 
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailModal;
