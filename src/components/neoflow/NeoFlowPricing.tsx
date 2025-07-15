const NeoFlowPricing = () => {
  const pricingData = [
    {
      item: "NeoFlow™ (setup)",
      senvia: "€897",
      client: "–",
      highlight: true
    },
    {
      item: "Manutenção (obrigatória)", 
      senvia: "€100/mês",
      client: "–",
      highlight: true
    },
    {
      item: "Supabase (Pro)",
      senvia: "–", 
      client: "$25/mês",
      highlight: false
    },
    {
      item: "Plataforma E-mail",
      senvia: "–",
      client: "a partir de $19/mês", 
      highlight: false
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Transparência de Custos
          </h2>
          <p className="text-xl text-gray-600">
            Sem surpresas, sem margens escondidas
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden">
          <div className="bg-primary text-white p-6">
            <div className="grid grid-cols-3 gap-4">
              <h3 className="font-bold text-lg">Item</h3>
              <h3 className="font-bold text-lg text-center">Faturado pela SENVIA</h3>
              <h3 className="font-bold text-lg text-center">Faturado directo ao cliente</h3>
            </div>
          </div>
          
          <div className="divide-y">
            {pricingData.map((row, index) => (
              <div 
                key={index} 
                className={`grid grid-cols-3 gap-4 p-6 ${
                  row.highlight ? 'bg-primary/5' : 'bg-white'
                }`}
              >
                <div className="font-medium text-gray-900">
                  {row.item}
                  {row.highlight && (
                    <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded-full">
                      SENVIA
                    </span>
                  )}
                </div>
                <div className={`text-center font-bold ${
                  row.senvia !== '–' ? 'text-primary text-lg' : 'text-gray-400'
                }`}>
                  {row.senvia}
                </div>
                <div className={`text-center font-bold ${
                  row.client !== '–' ? 'text-gray-900 text-lg' : 'text-gray-400'
                }`}>
                  {row.client}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border">
          <p className="text-sm text-gray-600 text-center">
            <span className="font-semibold">Nota:</span> Pagamentos feitos directamente ao fornecedor, sem margem SENVIA.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
            <h3 className="font-bold text-lg mb-4 text-primary">Vantagens do Modelo</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Total transparência nos custos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Controlo directo das suas ferramentas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Sem lock-in ou dependências</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-accent/5 rounded-2xl p-6 border border-accent/20">
            <h3 className="font-bold text-lg mb-4 text-accent">O que está incluído na manutenção</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>Monitorização 24/7 do sistema</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>Updates de segurança automáticos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>Suporte técnico prioritário</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeoFlowPricing;