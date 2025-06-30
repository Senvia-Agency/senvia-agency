
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useActivityHistory, useCreateActivity, ActivityHistory } from "@/hooks/useActivityHistory";
import { History, Plus, Phone, Mail, MessageSquare, Calendar, Edit, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ActivityHistorySectionProps {
  entityType: 'lead' | 'customer';
  entityId: string;
}

const ActivityHistorySection = ({ entityType, entityId }: ActivityHistorySectionProps) => {
  const { data: activities, isLoading } = useActivityHistory(entityType, entityId);
  const createActivity = useCreateActivity();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({
    activity_type: 'contact' as const,
    title: '',
    description: '',
    contact_person: '',
    contact_method: ''
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contact': return <Phone className="h-4 w-4" />;
      case 'email_sent': return <Mail className="h-4 w-4" />;
      case 'call_made': return <Phone className="h-4 w-4" />;
      case 'meeting_scheduled': return <Calendar className="h-4 w-4" />;
      case 'note_added': return <MessageSquare className="h-4 w-4" />;
      case 'status_change': return <Edit className="h-4 w-4" />;
      case 'conversion': return <TrendingUp className="h-4 w-4" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'contact': return 'bg-blue-500';
      case 'email_sent': return 'bg-green-500';
      case 'call_made': return 'bg-purple-500';
      case 'meeting_scheduled': return 'bg-orange-500';
      case 'note_added': return 'bg-gray-500';
      case 'status_change': return 'bg-yellow-500';
      case 'conversion': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createActivity.mutateAsync({
      entity_type: entityType,
      entity_id: entityId,
      ...newActivity
    });

    setNewActivity({
      activity_type: 'contact',
      title: '',
      description: '',
      contact_person: '',
      contact_method: ''
    });
    setIsAddModalOpen(false);
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="text-center text-gray-400">Carregando histórico...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Atividades
          </CardTitle>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-senvia-500 hover:bg-senvia-600">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-600 text-white">
              <DialogHeader>
                <DialogTitle>Nova Atividade</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Tipo de Atividade</label>
                  <Select 
                    value={newActivity.activity_type} 
                    onValueChange={(value: any) => setNewActivity(prev => ({ ...prev, activity_type: value }))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="contact">Contato</SelectItem>
                      <SelectItem value="email_sent">Email Enviado</SelectItem>
                      <SelectItem value="call_made">Ligação Feita</SelectItem>
                      <SelectItem value="meeting_scheduled">Reunião Agendada</SelectItem>
                      <SelectItem value="note_added">Nota Adicionada</SelectItem>
                      <SelectItem value="status_change">Mudança de Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300">Título</label>
                  <Input
                    value={newActivity.title}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-gray-700 border-gray-600"
                    placeholder="Ex: Ligação de follow-up"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300">Pessoa de Contato</label>
                  <Input
                    value={newActivity.contact_person}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, contact_person: e.target.value }))}
                    className="bg-gray-700 border-gray-600"
                    placeholder="Seu nome ou responsável"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300">Método de Contato</label>
                  <Input
                    value={newActivity.contact_method}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, contact_method: e.target.value }))}
                    className="bg-gray-700 border-gray-600"
                    placeholder="Ex: telefone, email, whatsapp"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300">Descrição</label>
                  <Textarea
                    value={newActivity.description}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-gray-700 border-gray-600"
                    placeholder="Detalhes da atividade..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                    className="border-gray-600"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createActivity.isPending}
                    className="bg-senvia-500 hover:bg-senvia-600"
                  >
                    {createActivity.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities && activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex gap-3 p-3 bg-gray-700 rounded-lg">
                <div className={`p-2 rounded-full ${getActivityColor(activity.activity_type)} text-white flex-shrink-0`}>
                  {getActivityIcon(activity.activity_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-white text-sm">{activity.title}</h4>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {format(new Date(activity.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                    </span>
                  </div>
                  {activity.description && (
                    <p className="text-sm text-gray-300 mt-1">{activity.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {activity.contact_person && (
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                        Por: {activity.contact_person}
                      </Badge>
                    )}
                    {activity.contact_method && (
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                        Via: {activity.contact_method}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-6">
              <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhuma atividade registrada</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityHistorySection;
