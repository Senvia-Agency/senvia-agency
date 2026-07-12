
interface OriginalLeadInfoProps {
  client: any;
}

const OriginalLeadInfo = ({ client }: OriginalLeadInfoProps) => {
  return (
    <div className="border-t border-gray-700 pt-4">
      <h4 className="text-sm font-medium text-gray-300 mb-2">Informações do Lead Original</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
        {client.objective && (
          <div>
            <span className="font-medium">Objetivo Principal:</span>
            <p className="mt-1">{client.objective}</p>
          </div>
        )}
        {client.main_product_service && (
          <div>
            <span className="font-medium">Produto/Serviço Principal:</span>
            <p className="mt-1">{client.main_product_service}</p>
          </div>
        )}
        {client.acquisition_source && (
          <div>
            <span className="font-medium">Origem:</span>
            <p className="mt-1">
              {client.acquisition_source === 'landing_page_basic' ? 'Landing Page Básica (€4.99)' : 
               client.acquisition_source === 'landing_page_premium' ? 'Landing Page Premium (€49.99)' : 
               client.acquisition_source}
            </p>
          </div>
        )}
        {client.acquisition_date && (
          <div>
            <span className="font-medium">Data de Aquisição:</span>
            <p className="mt-1">{new Date(client.acquisition_date).toLocaleDateString('pt-BR')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OriginalLeadInfo;
