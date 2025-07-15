import { Check, Clock, DollarSign } from "lucide-react";

const NeoFlowValue = () => {
  const included = [
    "Microsite ultrarrápido (5 secções)",
    "Formulário anti-spam + validação", 
    "Automação NeoFlow n8n (WA & E-mail)",
    "CRM (tabela leads Supabase)",
    "Dashboard Looker Studio"
  ];

  const clientCosts = [
    "BD Supabase – $25/mês (contratado directamente)",
    "SendGrid/Brevo – plano à escolha", 
    "WhatsApp API – custo por sessão"
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
          Valor <span className="text-primary">&gt;</span> Features
        </h2>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* O que recebe */}
          <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-xl font-bold mb-6 text-center">O que Recebe</h3>
            <div className="space-y-4">
              {included.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Poupança */}
          <div className="bg-accent/5 rounded-2xl p-8 border border-accent/20">
            <h3 className="text-xl font-bold mb-6 text-center">Poupança</h3>
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <p className="text-lg">Equivalente a <span className="font-bold">0,5 FTE*</span></p>
                <p className="text-2xl font-bold text-accent">(≈ €550/mês)</p>
              </div>
              
              <div className="bg-accent/10 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-accent" />
                  <span className="font-semibold">Pay-back típico</span>
                </div>
                <p className="text-xl font-bold text-accent">&lt; 30 dias</p>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">*FTE = Full-Time Employee</p>
            </div>
          </div>

          {/* Custos do cliente */}
          <div className="bg-gray-50 rounded-2xl p-8 border">
            <h3 className="text-xl font-bold mb-6 text-center">Custos do Cliente</h3>
            <div className="space-y-4">
              {clientCosts.map((cost, index) => (
                <div key={index} className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{cost}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeoFlowValue;