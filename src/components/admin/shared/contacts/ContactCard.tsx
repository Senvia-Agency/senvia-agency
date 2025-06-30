
import { Badge } from "@/components/ui/badge";
import { User, Star, Mail, Phone } from "lucide-react";
import { EntityContact } from "@/hooks/useEntityContacts";

interface ContactCardProps {
  contact: EntityContact;
}

export const ContactCard = ({ contact }: ContactCardProps) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
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
  );
};
