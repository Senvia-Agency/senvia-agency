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
    <section className="py-12 md:py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-12 md:mb-16 text-foreground">
          Valor <span className="text-primary">&gt;</span> Features
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* O que recebe */}
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-center text-foreground">O que Recebe</h3>
            <div className="space-y-4">
              {included.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground text-sm md:text-base">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Poupança */}
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-center text-foreground">Poupança</h3>
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <p className="text-lg text-foreground">Equivalente a <span className="font-bold">0,5 FTE*</span></p>
                <p className="text-2xl font-bold text-accent">(≈ €550/mês)</p>
              </div>
              
              <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-accent" />
                  <span className="font-semibold text-foreground">Pay-back típico</span>
                </div>
                <p className="text-xl font-bold text-accent">&lt; 30 dias</p>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4">*FTE = Full-Time Employee</p>
            </div>
          </div>

          {/* Custos do cliente */}
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-lg md:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-bold mb-6 text-center text-foreground">Custos do Cliente</h3>
            <div className="space-y-4">
              {clientCosts.map((cost, index) => (
                <div key={index} className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-foreground text-sm md:text-base">{cost}</span>
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