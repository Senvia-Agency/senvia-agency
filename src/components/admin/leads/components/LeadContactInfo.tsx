
import { Mail, Phone, Building, Globe, Target, Package } from "lucide-react";

interface LeadContactInfoProps {
  lead: any;
}

const LeadContactInfo = ({ lead }: LeadContactInfoProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm text-gray-300">
      <div className="flex items-center gap-2">
        <Mail className="h-3 w-3 text-gray-500" />
        <span className="truncate">{lead.email}</span>
      </div>
      
      {lead.phone && (
        <div className="flex items-center gap-2">
          <Phone className="h-3 w-3 text-gray-500" />
          <span>{lead.phone}</span>
        </div>
      )}
      
      {lead.company_name && (
        <div className="flex items-center gap-2">
          <Building className="h-3 w-3 text-gray-500" />
          <span className="truncate">{lead.company_name}</span>
        </div>
      )}
      
      {lead.website && (
        <div className="flex items-center gap-2">
          <Globe className="h-3 w-3 text-gray-500" />
          <span className="truncate">{lead.website}</span>
        </div>
      )}

      {lead.objective && (
        <div className="flex items-center gap-2">
          <Target className="h-3 w-3 text-gray-500" />
          <span className="truncate">{lead.objective}</span>
        </div>
      )}
      
      {lead.main_product_service && (
        <div className="flex items-center gap-2">
          <Package className="h-3 w-3 text-gray-500" />
          <span className="truncate">{lead.main_product_service}</span>
        </div>
      )}
    </div>
  );
};

export default LeadContactInfo;
