import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Rocket, Database, Target, Quote, ArrowRight, Zap, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import HomeNavbar from "@/components/home/HomeNavbar";
import HomeFooter from "@/components/home/HomeFooter";
import ScrollToTop from "@/components/ScrollToTop";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const SobreNos = () => {
  const handleCTAClick = () => {
    window.open("https://app.senvia.pt/c/senvia-agency/formulario-lp", "_blank");
  };

  return (
    <>
      <Helmet>
        <title>Sobre Nós | SENVIA - Nascidos na Era da IA</title>
        <meta 
          name="description" 
          content="Conheça a SENVIA: agência nativa de IA que elimina o ruído das vendas. Fundada em 2025, unimos estratégia e tecnologia para entregar leads qualificados." 
        />
        <link rel="canonical" href="https://www.senvia.pt/sobre-nos" />
        <meta property="og:title" content="Sobre Nós | SENVIA - Nascidos na Era da IA" />
        <meta property="og:description" content="Agência nativa de IA que elimina o ruído das vendas. Fundada em 2025, unimos estratégia e tecnologia." />
        <meta property="og:url" content="https://www.senvia.pt/sobre-nos" />
        <meta property="og:image" content="https://www.senvia.pt/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png" />
        <meta name="twitter:image" content="https://www.senvia.pt/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <HomeNavbar />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div 
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
              >
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">A Nossa História</span>
              </motion.div>

              <motion.h1 
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
              >
                Não somos uma agência tradicional a tentar adaptar-se à IA.{" "}
                <span className="text-primary">Nós nascemos da IA.</span>
              </motion.h1>

              <motion.p 
                variants={fadeInUp}
                className="text-xl text-muted-foreground max-w-3xl mx-auto"
              >
                Fundada em 2025, a SENVIA é a resposta nativa para um mercado saturado de ruído e sedento de vendas reais.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Manifesto Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="max-w-4xl mx-auto"
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-foreground mb-8"
              >
                A Nossa Guerra Contra o <span className="text-primary">"Ruído"</span>
              </motion.h2>

              <motion.div variants={fadeInUp} className="space-y-6 text-lg text-muted-foreground">
                <p>
                  O marketing digital <strong className="text-foreground">"partiu-se"</strong>. Antigamente, o desafio era ser visto. 
                  Hoje, o desafio é ser ouvido no meio do caos.
                </p>
                
                <p>
                  Empresas de todo o mundo estão a afogar-se em leads desqualificados, métricas de vaidade e 
                  "chatbots" que mais atrapalham do que ajudam. As equipas de vendas estão exaustas de ligar 
                  para números que não atendem ou pessoas que "só estavam a ver".
                </p>

                <div className="p-6 bg-primary/5 border-l-4 border-primary rounded-r-lg">
                  <p className="text-foreground font-medium">
                    A SENVIA nasceu com um propósito único: <span className="text-primary">Eliminar o ruído.</span>
                  </p>
                </div>

                <p>
                  Nós acreditamos que a tecnologia não serve para substituir o humano, mas para garantir que 
                  o humano <strong className="text-foreground">só gasta o seu tempo com quem realmente importa</strong>.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Abordagem Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="max-w-5xl mx-auto"
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center"
              >
                Agência + Tecnologia: <span className="text-primary">O Modelo Híbrido</span>
              </motion.h2>

              <motion.p 
                variants={fadeInUp}
                className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto"
              >
                Percebemos que as agências de marketing entregavam leads, mas não entregavam inteligência. 
                E as empresas de software entregavam ferramentas, mas não entregavam estratégia.
              </motion.p>

              {/* Comparison Cards */}
              <motion.div 
                variants={fadeInUp}
                className="grid md:grid-cols-3 gap-6 mb-12"
              >
                {/* Agência Tradicional */}
                <div className="p-6 rounded-xl bg-card border border-border/50">
                  <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Agência Tradicional</h3>
                  <p className="text-muted-foreground text-sm">
                    Entrega leads, mas sem inteligência. Você recebe volume, não qualidade.
                  </p>
                </div>

                {/* Software */}
                <div className="p-6 rounded-xl bg-card border border-border/50">
                  <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center mb-4">
                    <Database className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Software/SaaS</h3>
                  <p className="text-muted-foreground text-sm">
                    Entrega ferramentas, mas sem estratégia. Você tem dados, mas não sabe o que fazer.
                  </p>
                </div>

                {/* SENVIA */}
                <div className="p-6 rounded-xl bg-primary/10 border border-primary/30">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">SENVIA</h3>
                  <p className="text-foreground text-sm">
                    Une os dois mundos. Estratégia + Tecnologia + Inteligência = Vendas Reais.
                  </p>
                </div>
              </motion.div>

              {/* SENVIA OS Highlight */}
              <motion.div 
                variants={fadeInUp}
                className="p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20"
              >
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center">
                      <TrendingUp className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      O nosso diferencial é o <span className="text-primary">SENVIA OS</span>
                    </h3>
                    <p className="text-muted-foreground">
                      O nosso sistema proprietário de inteligência que atua nos bastidores. 
                      Enquanto a sua empresa dorme, os nossos agentes analisam, classificam e medem 
                      a "temperatura" de cada oportunidade.
                    </p>
                    <p className="text-foreground font-medium mt-4">
                      O resultado? Você deixa de vender para curiosos e passa a fechar negócio com{" "}
                      <span className="text-primary">leads quentes</span>.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Liderança Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="max-w-4xl mx-auto"
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center"
              >
                Quem está <span className="text-primary">por trás</span>
              </motion.h2>

              <motion.div 
                variants={fadeInUp}
                className="flex flex-col md:flex-row items-center gap-8"
              >
                {/* Avatar/Photo Placeholder */}
                <div className="flex-shrink-0">
                  <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/20">
                    <span className="text-5xl font-bold text-primary">TS</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-foreground mb-1">Thiago Sousa</h3>
                  <p className="text-primary font-medium mb-6">Fundador & Arquiteto de Produto</p>

                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/30" />
                    <blockquote className="pl-8 text-muted-foreground italic">
                      <p className="mb-4">
                        "Durante anos, trabalhei na criação de produtos digitais e percebi um padrão fatal: 
                        as empresas falham não por falta de tráfego, mas por <strong className="text-foreground not-italic">falha na conversão</strong>.
                      </p>
                      <p>
                        Criei a SENVIA e o SENVIA OS para resolver a minha própria frustração. Eu queria um sistema 
                        que me dissesse: 'Thiago, esquece estes 50 leads, foca-te nestes 3, porque são estes que vão comprar'. 
                        <strong className="text-foreground not-italic"> Hoje, essa tecnologia é a base do sucesso dos nossos clientes.</strong>"
                      </p>
                    </blockquote>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Valores Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="max-w-5xl mx-auto"
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center"
              >
                O Código <span className="text-primary">SENVIA</span>
              </motion.h2>

              <motion.p 
                variants={fadeInUp}
                className="text-lg text-muted-foreground text-center mb-12"
              >
                Os nossos valores fundamentais
              </motion.p>

              <motion.div 
                variants={staggerContainer}
                className="grid md:grid-cols-3 gap-8"
              >
                {/* Nativos de 2025 */}
                <motion.div 
                  variants={fadeInUp}
                  className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors group"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Rocket className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Nativos de 2025</h3>
                  <p className="text-muted-foreground">
                    Não carregamos vícios do passado. A nossa estrutura foi desenhada do zero para a era da Inteligência Artificial.
                  </p>
                </motion.div>

                {/* Verdade nos Dados */}
                <motion.div 
                  variants={fadeInUp}
                  className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors group"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Database className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Verdade nos Dados</h3>
                  <p className="text-muted-foreground">
                    Não confiamos em "achismos". Se o lead é frio, o sistema diz que é frio. A transparência é total.
                  </p>
                </motion.div>

                {/* Foco na Venda */}
                <motion.div 
                  variants={fadeInUp}
                  className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors group"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Target className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Foco na Venda</h3>
                  <p className="text-muted-foreground">
                    Cliques e likes não pagam salários. O nosso compromisso é com o que realmente importa: o lucro do seu negócio.
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <HomeFooter />
        <ScrollToTop />
      </div>
    </>
  );
};

export default SobreNos;
