import { getSignupUrl } from '@/utils/getSignupUrl';

const OSFinalCTASection = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-foreground">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-background mb-6 leading-tight">
          A sua concorrência já está a automatizar as vendas. Vai continuar a perder dinheiro no Excel?
        </h2>

        <a
          href="https://app.senvia.pt/?tab=signup"
          onClick={(e) => { e.preventDefault(); window.open(getSignupUrl(), '_blank', 'noopener,noreferrer'); }}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-lg px-10 py-5 hover:bg-primary/90 transition-colors"
        >
          Criar a Minha Conta Gratuita Agora
        </a>
      </div>
    </section>
  );
};

export default OSFinalCTASection;
