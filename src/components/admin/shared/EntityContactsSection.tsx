
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEntityContacts, useCreateEntityContact, EntityContact } from "@/hooks/useEntityContacts";
import { Users, Plus, User, Star, Mail, Phone } from "lucide-react";

interface EntityContactsSectionProps {
  entityType: 'lead' | 'customer';
  entityId: string;
}

const EntityContactsSection = ({ entityType, entityId }: EntityContactsSectionProps) => {
  const { data: contacts, isLoading } = useEntityContacts(entityType, entityId);
  const createContact = useCreateEntityContact();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    contact_person: '',
    contact_role: '',
    contact_email: '',
    contact_phone: '',
    is_primary: false,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createContact.mutateAsync({
      entity_type: entityType,
      entity_id: entityId,
      ...newContact
    });

    setNewContact({
      contact_person: '',
      contact_role: '',
      contact_email: '',
      contact_phone: '',
      is_primary: false,
      notes: ''
    });
    setIsAddModalOpen(false);
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="text-center text-gray-400">Carregando contatos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Responsáveis/Contatos
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
                <DialogTitle>Novo Responsável</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Nome da Pessoa</label>
                  <Input
                    value={newContact.contact_person}
                    onChange={(e) => setNewContact(prev => ({ ...prev, contact_person: e.target.value }))}
                    className="bg-gray-700 border-gray-600"
                    placeholder="Nome completo"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300">Função/Papel</label>
                  <Input
                    value={newContact.contact_role}
                    onChange={(e) => setNewContact(prev => ({ ...prev, contact_role: e.target.value }))}
                    className="bg-gray-700 border-gray-600"
                    placeholder="Ex: Vendedor, Suporte, Gerente"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300">Email</label>
                  <Input
                    type="email"
                    value={newContact.contact_email}
                    onChange={(e) => setNewContact(prev => ({ ...prev, contact_email: e.target.value }))}
                    className="bg-gray-700 border-gray-600"
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300">Telefone</label>
                  <Input
                    value={newContact.contact_phone}
                    onChange={(e) => setNewContact(prev => ({ ...prev, contact_phone: e.target.value }))}
                    className="bg-gray-700 border-gray-600"
                    placeholder="+351 123 456 789"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_primary"
                    checked={newContact.is_primary}
                    onChange={(e) => setNewContact(prev => ({ ...prev, is_primary: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <label htmlFor="is_primary" className="text-sm text-gray-300">
                    Responsável principal
                  </label>
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
                    disabled={createContact.isPending}
                    className="bg-senvia-500 hover:bg-senvia-600"
                  >
                    {createContact.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {contacts && contacts.length > 0 ? (
            contacts.map((contact) => (
              <div key={contact.id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                <div className="p-2 bg-senvia-500 rounded-full text-white flex-shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-white text-sm">{contact.contact_person}</h4>
                    {contact.is_primary && (
                      <Badge className="bg-yellow-500 text-black text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Principal
                      </Badge>
                    )}
                  </div>
                  {contact.contact_role && (
                    <p className="text-xs text-gray-400 mb-1">{contact.contact_role}</p>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {contact.contact_email && (
                      <div className="flex items-center gap-1 text-gray-300">
                        <Mail className="h-3 w-3" />
                        {contact.contact_email}
                      </div>
                    )}
                    {contact.contact_phone && (
                      <div className="flex items-center gap-1 text-gray-300">
                        <Phone className="h-3 w-3" />
                        {contact.contact_phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-6">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhum responsável atribuído</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EntityContactsSection;
