import { getSignupUrl } from '@/utils/getSignupUrl';

const OSHeroSection = () => {
  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden pt-20 md:pt-0"
      style={{
        background: 'radial-gradient(ellipse at 20% 40%, hsl(190 100% 50% / 0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 60%, hsl(190 100% 50% / 0.04) 0%, transparent 60%)',
      }}
    >
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
              href={getSignupUrl()}
              onClick={(e) => { e.preventDefault(); window.open(getSignupUrl(), '_blank', 'noopener,noreferrer'); }}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-base px-8 py-4 hover:bg-primary/90 transition-colors"
            >
              Começar os meus 14 Dias Grátis
            </a>

            <p className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
              <svg className="w-4 h-4 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Sem fidelização. Zero risco. Não exigimos cartão de crédito.
            </p>
          </div>

          {/* Right — Mockup */}
          <div className="relative hidden lg:flex items-center justify-center">
            <img
              src="/images/mockup-senvia-os.svg"
              alt="Dashboard do SENVIA OS — sistema de gestão de comissões para agências"
              className="w-full max-w-[640px] h-auto drop-shadow-2xl"
              width={640}
              height={480}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OSHeroSection;
