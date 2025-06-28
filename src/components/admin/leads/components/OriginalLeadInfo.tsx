
interface OriginalLeadInfoProps {
  lead: any;
}

const OriginalLeadInfo = ({ lead }: OriginalLeadInfoProps) => {
  return (
    <div className="border-t border-gray-700 pt-4">
      <h4 className="text-sm font-medium text-gray-300 mb-2">Informações do Lead Original</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
        {lead.objective && (
          <div>
            <span className="font-medium">Objetivo:</span>
            <p className="mt-1">{lead.objective}</p>
          </div>
        )}
        {lead.main_product_service && (
          <div>
            <span className="font-medium">Produto/Serviço:</span>
            <p className="mt-1">{lead.main_product_service}</p>
          </div>
        )}
        {lead.target_audience && (
          <div>
            <span className="font-medium">Público-Alvo:</span>
            <p className="mt-1">{lead.target_audience}</p>
          </div>
        )}
        <div>
          <span className="font-medium">Origem:</span>
          <p className="mt-1">
            {lead.source_page === 'landing_page_basic' ? 'Landing Page Básica (€4.99)' : 'Landing Page Premium (€49.99)'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OriginalLeadInfo;
