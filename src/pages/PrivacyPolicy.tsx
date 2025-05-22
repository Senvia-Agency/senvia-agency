
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import MetaPixel from "../components/MetaPixel";

const PrivacyPolicy = () => {
  useEffect(() => {
    // Update document title
    document.title = "Política de Privacidade | SENVIA Agency";
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <MetaPixel />
      <Navbar />
      
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Política de Privacidade</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground mb-6">Última atualização: {new Date().toLocaleDateString('pt-PT')}</p>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
              <p className="mb-4">
                A SENVIA Agency ("nós", "nosso" ou "empresa") está comprometida em proteger a sua privacidade. 
                Esta Política de Privacidade explica como recolhemos, utilizamos, divulgamos e protegemos as suas 
                informações pessoais quando visita o nosso website ou utiliza os nossos serviços.
              </p>
              <p>
                Ao utilizar o nosso website ou serviços, concorda com a recolha e utilização de informações 
                de acordo com esta política.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">2. Informações que Recolhemos</h2>
              <p className="mb-4">Podemos recolher vários tipos de informações, incluindo:</p>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">
                  <strong>Informações Pessoais:</strong> Nome, endereço de email, número de telefone, 
                  e outras informações que nos fornece através dos formulários de contacto.
                </li>
                <li className="mb-2">
                  <strong>Informações de Utilização:</strong> Dados sobre como interage com o nosso website, 
                  incluindo páginas visitadas, tempo gasto no site, e outras estatísticas.
                </li>
                <li className="mb-2">
                  <strong>Informações de Dispositivo:</strong> Dados sobre o dispositivo que utiliza para 
                  aceder ao nosso website, incluindo tipo de dispositivo, sistema operativo, e endereço IP.
                </li>
                <li>
                  <strong>Cookies:</strong> Utilizamos cookies e tecnologias similares para melhorar a sua 
                  experiência no nosso website, analisar tendências e administrar o site.
                </li>
              </ul>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">3. Como Utilizamos as Suas Informações</h2>
              <p className="mb-4">Utilizamos as informações recolhidas para:</p>
              <ul className="list-disc pl-6">
                <li className="mb-2">Fornecer, operar e manter os nossos serviços;</li>
                <li className="mb-2">Melhorar, personalizar e expandir os nossos serviços;</li>
                <li className="mb-2">Compreender e analisar como utiliza os nossos serviços;</li>
                <li className="mb-2">Desenvolver novos produtos, serviços e funcionalidades;</li>
                <li className="mb-2">Comunicar consigo, diretamente ou através dos nossos parceiros;</li>
                <li className="mb-2">Fornecer atualizações e outras informações relacionadas com os nossos serviços;</li>
                <li>Prevenir e resolver problemas técnicos e de segurança.</li>
              </ul>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">4. Partilha de Informações</h2>
              <p className="mb-4">
                Não vendemos nem alugamos os seus dados pessoais a terceiros. Podemos partilhar as suas 
                informações pessoais nas seguintes situações:
              </p>
              <ul className="list-disc pl-6">
                <li className="mb-2">Com fornecedores de serviços que nos ajudam a operar o nosso website e serviços;</li>
                <li className="mb-2">Para cumprir obrigações legais;</li>
                <li className="mb-2">Para proteger e defender os nossos direitos e propriedade;</li>
                <li>Com o seu consentimento ou sob a sua direção.</li>
              </ul>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">5. Segurança dos Dados</h2>
              <p>
                Implementamos medidas de segurança apropriadas para proteger as suas informações pessoais 
                contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método 
                de transmissão pela Internet ou método de armazenamento eletrónico é 100% seguro, pelo que 
                não podemos garantir a segurança absoluta.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">6. Os Seus Direitos</h2>
              <p className="mb-4">
                De acordo com o RGPD e outras leis de proteção de dados aplicáveis, tem certos direitos 
                relacionados com os seus dados pessoais, incluindo:
              </p>
              <ul className="list-disc pl-6">
                <li className="mb-2">O direito de aceder aos seus dados pessoais;</li>
                <li className="mb-2">O direito de retificar dados imprecisos;</li>
                <li className="mb-2">O direito de solicitar a eliminação dos seus dados;</li>
                <li className="mb-2">O direito de restringir o processamento dos seus dados;</li>
                <li className="mb-2">O direito à portabilidade dos dados;</li>
                <li>O direito de se opor ao processamento dos seus dados.</li>
              </ul>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">7. Alterações a Esta Política</h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. Quaisquer alterações serão 
                publicadas nesta página e, se as alterações forem significativas, forneceremos um aviso 
                mais proeminente.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Contacte-nos</h2>
              <p>
                Se tiver alguma questão sobre esta Política de Privacidade, por favor contacte-nos em:
              </p>
              <address className="mt-4 not-italic">
                <p>Email: <a href="mailto:geral@senvia.pt" className="text-senvia-500 hover:underline">geral@senvia.pt</a></p>
                <p>Telefone: <a href="tel:+351939135114" className="text-senvia-500 hover:underline">+351 939 135 114</a></p>
              </address>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default PrivacyPolicy;
