import { Shield, Lock, FileText, Eye, MapPin } from "lucide-react";

const NeoFlowSecurity = () => {
  const features = [
    {
      icon: MapPin,
      text: "Dados em datacenters UE"
    },
    {
      icon: Lock, 
      text: "Encriptação TLS & RLS"
    },
    {
      icon: FileText,
      text: "Logs de consentimento"
    },
    {
      icon: Eye,
      text: "Right-to-Erasure 1-click"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg border mb-6">
            <Shield className="w-6 h-6 text-green-600" />
            <span className="font-bold text-green-600">100% RGPD Compliant</span>
          </div>
          
          <h2 className="text-2xl lg:text-3xl font-bold mb-8">
            Garantia de Segurança & RGPD
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center justify-center mb-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-white rounded-2xl p-8 border shadow-sm">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-900">
                Conformidade Total RGPD
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  Armazenamento exclusivo em datacenters da União Europeia
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  Encriptação end-to-end de todos os dados pessoais
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  Sistema de consentimento granular e auditável
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-900">
                Direitos dos Utilizadores
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  Acesso aos dados pessoais em tempo real
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  Eliminação completa em 1 clique
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  Exportação de dados em formato standard
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeoFlowSecurity;