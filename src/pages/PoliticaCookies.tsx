import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PoliticaCookies = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Política de Cookies | SENVIA</title>
        <meta name="description" content="Política de Cookies da SENVIA - Saiba como utilizamos cookies no nosso website." />
        <link rel="canonical" href="https://www.senvia.pt/politica-cookies" />
        <meta property="og:title" content="Política de Cookies | SENVIA" />
        <meta property="og:url" content="https://www.senvia.pt/politica-cookies" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="Política de Cookies da SENVIA - Saiba como utilizamos cookies no nosso website." />
        <meta property="og:image" content="https://www.senvia.pt/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.senvia.pt/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png" />
      </Helmet>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao início
          </Button>
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-8">Política de Cookies</h1>
        
        <div className="prose prose-invert max-w-none space-y-8">
          <p className="text-muted-foreground">
            Última atualização: Janeiro de 2025
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. O que são Cookies?</h2>
            <p className="text-muted-foreground">
              Cookies são pequenos ficheiros de texto que são colocados no seu computador ou dispositivo móvel 
              quando visita um website. Os cookies são amplamente utilizados para fazer os websites funcionarem, 
              ou funcionarem de forma mais eficiente, bem como para fornecer informações aos proprietários do site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Como Utilizamos os Cookies</h2>
            <p className="text-muted-foreground mb-4">
              A SENVIA utiliza cookies para:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Garantir o funcionamento adequado do website</li>
              <li>Melhorar a experiência do utilizador</li>
              <li>Analisar o tráfego e o comportamento dos utilizadores</li>
              <li>Personalizar conteúdos e anúncios</li>
              <li>Lembrar as suas preferências</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Tipos de Cookies que Utilizamos</h2>
            
            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">Cookies Essenciais</h3>
            <p className="text-muted-foreground">
              Estes cookies são necessários para o funcionamento do website e não podem ser desativados. 
              Normalmente, são definidos apenas em resposta a ações suas, como definir preferências de 
              privacidade, iniciar sessão ou preencher formulários.
            </p>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">Cookies de Desempenho</h3>
            <p className="text-muted-foreground">
              Estes cookies permitem-nos contar visitas e fontes de tráfego para medir e melhorar o 
              desempenho do nosso site. Ajudam-nos a saber quais páginas são as mais e menos populares 
              e a ver como os visitantes navegam pelo site.
            </p>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">Cookies de Funcionalidade</h3>
            <p className="text-muted-foreground">
              Estes cookies permitem que o website forneça funcionalidades e personalização melhoradas. 
              Podem ser definidos por nós ou por fornecedores terceiros cujos serviços adicionámos às nossas páginas.
            </p>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">Cookies de Marketing</h3>
            <p className="text-muted-foreground">
              Estes cookies podem ser definidos através do nosso site pelos nossos parceiros de publicidade. 
              Podem ser utilizados por essas empresas para criar um perfil dos seus interesses e mostrar-lhe 
              anúncios relevantes noutros sites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Cookies de Terceiros</h2>
            <p className="text-muted-foreground mb-4">
              Utilizamos serviços de terceiros que podem definir cookies no seu dispositivo:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Google Analytics:</strong> Para análise de tráfego e comportamento do utilizador</li>
              <li><strong>Google Tag Manager:</strong> Para gestão de tags e pixels de rastreamento</li>
              <li><strong>Facebook Pixel:</strong> Para remarketing e análise de conversões</li>
              <li><strong>Stripe:</strong> Para processamento seguro de pagamentos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Como Gerir os Cookies</h2>
            <p className="text-muted-foreground mb-4">
              Pode gerir as suas preferências de cookies de várias formas:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Através do banner de consentimento de cookies apresentado no nosso website</li>
              <li>Através das configurações do seu navegador</li>
              <li>Através das ferramentas de opt-out dos serviços de terceiros</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Note que a desativação de alguns cookies pode afetar a funcionalidade do website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Configurações do Navegador</h2>
            <p className="text-muted-foreground mb-4">
              A maioria dos navegadores permite gerir cookies através das suas configurações. 
              Consulte a documentação do seu navegador para mais informações:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Google Chrome</li>
              <li>Mozilla Firefox</li>
              <li>Safari</li>
              <li>Microsoft Edge</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Atualizações a Esta Política</h2>
            <p className="text-muted-foreground">
              Podemos atualizar esta Política de Cookies periodicamente para refletir alterações nas 
              nossas práticas ou por outras razões operacionais, legais ou regulamentares. 
              Recomendamos que reveja esta página regularmente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Contacto</h2>
            <p className="text-muted-foreground">
              Se tiver dúvidas sobre a nossa utilização de cookies, entre em contacto connosco através de:
            </p>
            <p className="text-muted-foreground mt-4">
              <strong>Email:</strong> geral@senvia.pt<br />
              <strong>Morada:</strong> Leiria, Portugal
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PoliticaCookies;
