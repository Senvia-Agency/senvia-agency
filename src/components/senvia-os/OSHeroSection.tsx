import { CheckCircle } from 'lucide-react';

const OSHeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20 md:pt-0">
      {/* Background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <div className="max-w-xl">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-4 px-3 py-1 rounded-full border border-primary/30 bg-primary/5">
              Software para Agências
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-foreground mb-6">
              Abandone o Excel.{' '}
              <span className="text-primary">O Sistema Definitivo</span> para Agências de Telecomunicações e Energia.
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Calcule comissões, múltiplos e estornos de forma 100% automática. Tranque a sua margem de lucro sem erros humanos.
            </p>

            <a
              href="https://app.senvia.pt/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-base px-8 py-4 hover:bg-primary/90 transition-colors"
            >
              Começar os meus 14 Dias Grátis
            </a>

            <p className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
              <CheckCircle className="w-4 h-4 text-primary shrink-0" />
              Sem fidelização. Zero risco. Não exigimos cartão de crédito.
            </p>
          </div>

          {/* Right — Image */}
          <div className="relative hidden lg:block">
            <div className="rounded-2xl overflow-hidden border border-border shadow-2xl">
              <img
                src="/lovable-uploads/foto-senvia-os.png"
                alt="Fundador SENVIA OS a apresentar o sistema de comissões"
                className="w-full h-[540px] object-cover object-[center_15%]"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OSHeroSection;
