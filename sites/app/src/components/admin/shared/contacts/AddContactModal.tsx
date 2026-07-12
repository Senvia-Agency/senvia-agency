
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useCreateEntityContact } from "@/hooks/useEntityContacts";

interface AddContactModalProps {
  entityType: 'lead' | 'customer';
  entityId: string;
}

export const AddContactModal = ({ entityType, entityId }: AddContactModalProps) => {
  const createContact = useCreateEntityContact();
  const [isOpen, setIsOpen] = useState(false);
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
      contact_name: newContact.contact_person,
      ...newContact
    } as any);

    setNewContact({
      contact_person: '',
      contact_role: '',
      contact_email: '',
      contact_phone: '',
      is_primary: false,
      notes: ''
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              onClick={() => setIsOpen(false)}
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
  );
};
