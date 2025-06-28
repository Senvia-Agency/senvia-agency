
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { getStatusIcon, getStatusColor, getSourceLabel, getStatusLabel } from "../../../utils/leadUtils";

interface LeadDetailModalProps {
  selectedLead: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: any) => void;
}

const LeadDetailModal = ({ selectedLead, isOpen, onClose, onUpdate }: LeadDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  const handleLeadSelection = (lead: any) => {
    setEditForm({
      full_name: lead.full_name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      company_name: lead.company_name || '',
      website: lead.website || '',
      objective: lead.objective || '',
      main_product_service: lead.main_product_service || '',
      target_audience: lead.target_audience || '',
      notes: lead.notes || '',
      lead_status: lead.lead_status
    });
    setIsEditing(false);
  };

  // Update form when selectedLead changes
  if (selectedLead && (!editForm.email || editForm.email !== selectedLead.email)) {
    handleLeadSelection(selectedLead);
  }

  const handleSave = () => {
    onUpdate(editForm);
    setIsEditing(false);
  };

  if (!selectedLead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-800 border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isEditing ? 'Editar Lead' : 'Detalhes do Lead'}
              {selectedLead && (
                <Badge 
                  variant="outline" 
                  className={cn("ml-2", selectedLead.source_page === 'landing_page_basic' ? 'border-senvia-500 text-senvia-400' : 'border-purple-500 text-purple-400')}
                >
                  {getSourceLabel(selectedLead.source_page)}
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="text-senvia-400 border-senvia-500 hover:bg-senvia-500 hover:text-black"
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancelar' : 'Editar'}
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {isEditing ? (
            /* Modo de Edição */
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-300">Nome Completo</Label>
                    <Input
                      value={editForm.full_name}
                      onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-300">Email</Label>
                    <Input
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-300">Telefone</Label>
                    <Input
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-300">Empresa</Label>
                    <Input
                      value={editForm.company_name}
                      onChange={(e) => setEditForm({...editForm, company_name: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-300">Website</Label>
                    <Input
                      value={editForm.website}
                      onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-300">Status</Label>
                    <Select value={editForm.lead_status} onValueChange={(value) => setEditForm({...editForm, lead_status: value})}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="new">Novo</SelectItem>
                        <SelectItem value="contacted">Contatado</SelectItem>
                        <SelectItem value="qualified">Qualificado</SelectItem>
                        <SelectItem value="converted">Convertido</SelectItem>
                        <SelectItem value="lost">Perdido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Informações Específicas */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-300">Objetivo</Label>
                  <Textarea
                    value={editForm.objective}
                    onChange={(e) => setEditForm({...editForm, objective: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-300">Produto/Serviço Principal</Label>
                  <Input
                    value={editForm.main_product_service}
                    onChange={(e) => setEditForm({...editForm, main_product_service: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-300">Público-Alvo</Label>
                  <Input
                    value={editForm.target_audience}
                    onChange={(e) => setEditForm({...editForm, target_audience: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-300">Notas</Label>
                  <Textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-700">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-senvia-500 hover:bg-senvia-400 text-black"
                >
                  Salvar Alterações
                </Button>
              </div>
            </div>
          ) : (
            /* Modo de Visualização */
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Nome Completo</label>
                    <p className="text-white mt-1">{selectedLead.full_name || 'Não informado'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300">Email</label>
                    <p className="text-white mt-1">{selectedLead.email || 'Não informado'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300">Telefone</label>
                    <p className="text-white mt-1">{selectedLead.phone || 'Não informado'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Empresa</label>
                    <p className="text-white mt-1">{selectedLead.company_name || 'Não informado'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300">Website</label>
                    <p className="text-white mt-1">{selectedLead.website || 'Não informado'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300">Data de Cadastro</label>
                    <p className="text-white mt-1">
                      {format(new Date(selectedLead.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status e Conversão */}
              <div className="border-t border-gray-700 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Status</label>
                    <div className="mt-2">
                      <Badge className={cn("flex items-center gap-2 w-fit", getStatusColor(selectedLead.lead_status))}>
                        {getStatusIcon(selectedLead.lead_status)}
                        {getStatusLabel(selectedLead.lead_status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300">Convertido</label>
                    <div className="mt-2">
                      <Badge variant={selectedLead.converted ? 'default' : 'secondary'}>
                        {selectedLead.converted ? 'Sim' : 'Não'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300">Status de Pagamento</label>
                    <div className="mt-2">
                      <Badge variant={selectedLead.payment_status === 'paid' ? 'default' : 'secondary'}>
                        {selectedLead.payment_status || 'pending'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações Específicas */}
              {(selectedLead.objective || selectedLead.main_product_service || selectedLead.notes) && (
                <div className="border-t border-gray-700 pt-6 space-y-4">
                  {selectedLead.objective && (
                    <div>
                      <label className="text-sm font-medium text-gray-300">Objetivo</label>
                      <p className="text-white mt-1">{selectedLead.objective}</p>
                    </div>
                  )}

                  {selectedLead.main_product_service && (
                    <div>
                      <label className="text-sm font-medium text-gray-300">Produto/Serviço Principal</label>
                      <p className="text-white mt-1">{selectedLead.main_product_service}</p>
                    </div>
                  )}

                  {selectedLead.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-300">Notas</label>
                      <p className="text-white mt-1">{selectedLead.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailModal;
