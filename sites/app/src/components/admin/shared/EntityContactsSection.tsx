
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEntityContacts } from "@/hooks/useEntityContacts";
import { Users } from "lucide-react";
import { ContactCard } from "./contacts/ContactCard";
import { EmptyState } from "./contacts/EmptyState";
import { AddContactModal } from "./contacts/AddContactModal";

interface EntityContactsSectionProps {
  entityType: 'lead' | 'customer';
  entityId: string;
}

const EntityContactsSection = ({ entityType, entityId }: EntityContactsSectionProps) => {
  const { data: contacts, isLoading } = useEntityContacts(entityType, entityId);

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
          <AddContactModal entityType={entityType} entityId={entityId} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {contacts && contacts.length > 0 ? (
            contacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EntityContactsSection;
