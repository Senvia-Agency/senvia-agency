import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TermosServico = () => {
  return (
    <>
      <Helmet>
        <title>Termos de Serviço | SENVIA Agency</title>
        <meta name="description" content="Termos e condições que regem a utilização dos serviços da SENVIA Agency. Leia os nossos termos de serviço antes de contratar." />
        <link rel="canonical" href="https://www.senvia.pt/termos-servico" />
        <meta property="og:title" content="Termos de Serviço | SENVIA Agency" />
        <meta property="og:url" content="https://www.senvia.pt/termos-servico" />
      </Helmet>
      <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-background via-background to-senvia-500/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Termos de Serviço</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Termos e condições que regem a utilização dos nossos serviços.
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
              
              <h2 className="text-2xl font-bold mb-6 text-foreground">1. Aceitação dos Termos</h2>
              <p className="text-muted-foreground mb-6">
                Ao contratar os serviços da SENVIA Agency, o cliente aceita automaticamente estes termos de serviço. 
                É importante ler e compreender todas as cláusulas antes de iniciar qualquer projeto.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-foreground">2. Serviços Oferecidos</h2>
              <div className="text-muted-foreground mb-6">
                <p className="mb-3">A SENVIA Agency oferece os seguintes serviços:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Desenvolvimento de websites e páginas web</li>
                  <li>Criação de lojas online (e-commerce)</li>
                  <li>Gestão de redes sociais</li>
                  <li>Campanhas de tráfego pago</li>
                  <li>Implementação de agentes de IA</li>
                  <li>Consultoria em marketing digital</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold mb-6 text-foreground">3. Responsabilidades do Cliente</h2>
              <div className="text-muted-foreground mb-6">
                <p className="mb-3">O cliente compromete-se a:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Fornecer informações precisas e completas sobre o projeto</li>
                  <li>Disponibilizar conteúdos necessários (textos, imagens, etc.) dentro dos prazos acordados</li>
                  <li>Efetuar pagamentos conforme cronograma estabelecido</li>
                  <li>Comunicar alterações ou feedback de forma clara e objetiva</li>
                  <li>Respeitar os direitos de propriedade intelectual</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold mb-6 text-foreground">4. Responsabilidades da SENVIA</h2>
              <div className="text-muted-foreground mb-6">
                <p className="mb-3">A SENVIA Agency compromete-se a:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Entregar serviços com qualidade profissional</li>
                  <li>Cumprir prazos acordados, exceto em caso de força maior</li>
                  <li>Manter confidencialidade das informações do cliente</li>
                  <li>Oferecer suporte durante o período estabelecido</li>
                  <li>Utilizar as melhores práticas da indústria</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold mb-6 text-foreground">5. Prazos e Entregas</h2>
              <p className="text-muted-foreground mb-6">
                Os prazos são estabelecidos no início de cada projeto e podem ser alterados mediante acordo entre as partes. 
                Atrasos causados por falta de conteúdo ou feedback do cliente não são da responsabilidade da SENVIA.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-foreground">6. Pagamentos</h2>
              <div className="text-muted-foreground mb-6">
                <p className="mb-3">Condições de pagamento:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Sinal de 50% para iniciar o projeto</li>
                  <li>Restante valor na entrega final</li>
                  <li>Pagamentos em atraso podem resultar em suspensão dos serviços</li>
                  <li>Taxas de hosting e domínio são cobradas separadamente</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold mb-6 text-foreground">7. Propriedade Intelectual</h2>
              <p className="text-muted-foreground mb-6">
                Após pagamento integral, os direitos do projeto passam para o cliente, exceto códigos e metodologias 
                proprietárias da SENVIA que permanecem protegidos por direitos autorais.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-foreground">8. Garantias e Limitações</h2>
              <div className="text-muted-foreground mb-6">
                <p className="mb-3">Oferecemos:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>30 dias de suporte gratuito após entrega</li>
                  <li>Correção de bugs sem custo adicional no período de garantia</li>
                  <li>Não nos responsabilizamos por problemas de terceiros (hosting, domínios)</li>
                  <li>Limitação de responsabilidade ao valor pago pelo projeto</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold mb-6 text-foreground">9. Cancelamento</h2>
              <p className="text-muted-foreground mb-6">
                Qualquer das partes pode cancelar o projeto mediante aviso de 15 dias. 
                Trabalho já realizado será cobrado proporcionalmente.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-foreground">10. Alterações aos Termos</h2>
              <p className="text-muted-foreground mb-6">
                Estes termos podem ser atualizados periodicamente. Clientes ativos serão notificados sobre alterações significativas.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-foreground">11. Lei Aplicável</h2>
              <p className="text-muted-foreground mb-6">
                Estes termos são regidos pela lei portuguesa. Qualquer disputa será resolvida nos tribunais competentes de Portugal.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-foreground">12. Contacto</h2>
              <div className="text-muted-foreground">
                <p className="mb-2">Para questões sobre estes termos:</p>
                <p className="mb-1">Email: geral@senvia.pt</p>
                <p className="mb-1">Telefone: +351 939 135 114</p>
                <p>Última atualização: Janeiro de 2024</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
    </>
  );
};

export default TermosServico;