
import { CheckCircle } from "lucide-react";

const BeforeAfterSection = () => {
  return (
    <section className="py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            A <span className="text-gradient">transformação</span> que você vai ter
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-red-600">Antes</h3>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm md:text-base">Página simples e genérica</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm md:text-base">Leads soltos no WhatsApp</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm md:text-base">Atendimento manual</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm md:text-base">Nenhum e-mail enviado</span>
                </div>
              </div>
            </div>

            <div className="bg-senvia-500/10 border border-senvia-500/20 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-senvia-400">Depois</h3>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-senvia-400 flex-shrink-0" />
                  <span className="text-sm md:text-base">Landing com copy estratégica</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-senvia-400 flex-shrink-0" />
                  <span className="text-sm md:text-base">Leads centralizados no CRM</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-senvia-400 flex-shrink-0" />
                  <span className="text-sm md:text-base">Botão flutuante com IA</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-senvia-400 flex-shrink-0" />
                  <span className="text-sm md:text-base">Fluxo de e-mails automáticos</span>
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
