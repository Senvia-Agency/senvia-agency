import { Code2, Database, Shield, Zap, Globe, Cpu } from "lucide-react";

const TechnologySection = () => {
  const technologies = [
    {
      icon: Code2,
      title: "React + TypeScript",
      description: "Interface moderna, rápida e confiável",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Database,
      title: "Supabase Database",
      description: "Base de dados em tempo real e segura",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "RGPD Compliant",
      description: "100% conforme com leis europeias",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: Zap,
      title: "Edge Computing",
      description: "Performance de nível enterprise",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Globe,
      title: "CDN Global",
      description: "Velocidade máxima em qualquer país",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: Cpu,
      title: "IA Integrada",
      description: "Automação inteligente e adaptativa",
      color: "from-pink-500 to-red-500"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.1),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(168,85,247,0.1),transparent)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full px-6 py-3 mb-6">
              <Cpu className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-medium">Tecnologia de Ponta</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Construído com
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
                Tecnologia do Futuro
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Não usamos tecnologias antigas. Cada linha de código é <strong>estado da arte</strong>, 
              garantindo que sua empresa tenha sempre a melhor performance e segurança do mercado.
            </p>
          </div>

          {/* Technology Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-500 hover:transform hover:scale-105"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${tech.color} rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-2xl transition-all duration-500`}>
                  <tech.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-3">{tech.title}</h3>
                <p className="text-gray-400 leading-relaxed">{tech.description}</p>
              </div>
            ))}
          </div>

          {/* Performance Stats */}
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-3xl p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">Performance Garantida</h3>
              <p className="text-gray-300 text-lg">Métricas que comprovam a excelência técnica</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                  98%
                </div>
                <div className="text-gray-300">Uptime Garantido</div>
                <div className="text-sm text-gray-500 mt-1">SLA Enterprise</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  &lt;2s
                </div>
                <div className="text-gray-300">Tempo de Carregamento</div>
                <div className="text-sm text-gray-500 mt-1">Core Web Vitals</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  256-bit
                </div>
                <div className="text-gray-300">Encriptação SSL</div>
                <div className="text-sm text-gray-500 mt-1">Segurança Bancária</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                  100%
                </div>
                <div className="text-gray-300">RGPD Compliant</div>
                <div className="text-sm text-gray-500 mt-1">Auditoria Certificada</div>
              </div>
            </div>
          </div>

          {/* Trust Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/50 rounded-2xl p-8 max-w-4xl mx-auto">
              <h4 className="text-2xl font-bold mb-4">Porque Investir em Tecnologia de Qualidade?</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <div>
                      <strong className="text-green-400">Zero Downtime:</strong> Sua empresa nunca para de vender
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <div>
                      <strong className="text-blue-400">Escalabilidade:</strong> Suporta milhares de leads simultâneos
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <div>
                      <strong className="text-purple-400">Segurança:</strong> Proteção contra ataques e vazamentos
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                    <div>
                      <strong className="text-orange-400">Performance:</strong> Carregamento instantâneo em qualquer dispositivo
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                    <div>
                      <strong className="text-pink-400">Futuro-proof:</strong> Sempre atualizado com as últimas inovações
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                    <div>
                      <strong className="text-cyan-400">ROI Comprovado:</strong> Tecnologia que se paga sozinha
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;