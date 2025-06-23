
import { CheckCircle } from "lucide-react";

const BeforeAfterSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            A <span className="text-gradient">transformação</span> que você vai ter
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-red-600">Antes</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Página simples e genérica</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Leads soltos no WhatsApp</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Atendimento manual</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Nenhum e-mail enviado</span>
                </div>
              </div>
            </div>

            <div className="bg-senvia-500/10 border border-senvia-500/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-senvia-400">Depois</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-senvia-400" />
                  <span>Landing com copy estratégica</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-senvia-400" />
                  <span>Leads centralizados no CRM</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-senvia-400" />
                  <span>Botão flutuante com IA</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-senvia-400" />
                  <span>Fluxo de e-mails automáticos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
