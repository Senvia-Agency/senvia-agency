import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatInterface from '../../chat/ChatInterface';

const AgenciaViagensExample = () => {
  const navigate = useNavigate();

  const data = {
    title: 'IA para Agência de Viagens e Excursões',
    description: 'Assistente virtual especializado em turismo que atende clientes 24/7, fornece informações sobre destinos, faz reservas e oferece suporte completo.',
    benefits: [
      'Atendimento 24/7 em múltiplos idiomas',
      'Recomendações personalizadas de destinos',
      'Gestão automática de reservas e cancelamentos',
      'Suporte durante a viagem',
      'Qualificação automática de leads',
      'Integração com sistemas de reservas'
    ],
    conversationExamples: [
      {
        customer: "Olá! Estou interessado numa viagem para as Maldivas para lua de mel.",
        ai: "Que maravilhoso! Parabéns pelo casamento! 🎉 As Maldivas são perfeitas para lua de mel. Para personalizar a experiência, pode me dizer:\n\n• Quando pretendem viajar?\n• Quantos dias de estadia?\n• Preferem resort com overwater bungalows?\n• Orçamento aproximado?\n\nTemos pacotes especiais para lua de mel com várias vantagens!"
      },
      {
        customer: "Queremos ir em Setembro, cerca de 7 dias. Sim, adorávamos um overwater bungalow!",
        ai: "Excelente escolha! Setembro é uma época ideal. Para casais em lua de mel com overwater bungalows, recomendo:\n\n🏝️ **Resort Conrad Maldives**\n• Overwater villa com jacuzzi privado\n• Spa para casais\n• Jantar romântico na praia\n• 7 noites: desde €4.500/casal\n\n🏝️ **Centara Ras Fushi**\n• Overwater suite premium\n• All-inclusive premium\n• Excursões incluídas\n• 7 noites: desde €3.200/casal\n\nGostaria de mais detalhes sobre algum deles? Posso agendar uma videochamada com nossa especialista em Maldivas!"
      },
      {
        customer: "O Conrad parece interessante. Que atividades estão incluídas?",
        ai: "O Conrad Maldives oferece uma experiência completa! 🌊\n\n**Incluído no pacote:**\n✅ Snorkeling no recife da casa\n✅ Kayak e stand-up paddle\n✅ Aulas de yoga ao nascer do sol\n✅ Excursão de dolphin watching\n✅ Spa credit de €200\n✅ Jantar romântico na praia (1x)\n✅ Champanhe e frutas na chegada\n\n**Opcionais (com desconto):**\n• Mergulho certificado\n• Pesca ao pôr do sol\n• Excursão a ilhas locais\n• Spa treatments adicionais\n\nO resort tem também 2 restaurantes premiados e um bar overwater. Quer que reserve uma chamada com nossa especialista para finalizar?"
      }
    ],
    features: [
      {
        title: 'Recomendações Inteligentes',
        description: 'Sugere destinos baseados no perfil, orçamento e preferências do cliente'
      },
      {
        title: 'Gestão de Reservas',
        description: 'Processa reservas, alterações e cancelamentos automaticamente'
      },
      {
        title: 'Suporte Multilíngue',
        description: 'Atende em português, inglês, espanhol e francês'
      },
      {
        title: 'Integração CRM',
        description: 'Sincroniza automaticamente com seu sistema de gestão de clientes'
      },
      {
        title: 'Follow-up Inteligente',
        description: 'Acompanha clientes antes, durante e após a viagem'
      },
      {
        title: 'Relatórios Detalhados',
        description: 'Analytics completos sobre leads, conversões e satisfação'
      }
    ],
    metrics: [
      { label: 'Tempo médio de resposta', value: '< 10 segundos' },
      { label: 'Disponibilidade', value: '24/7/365' },
      { label: 'Taxa de conversão', value: '+45%' },
      { label: 'Satisfação do cliente', value: '4.8/5' },
      { label: 'Leads qualificados', value: '+80%' },
      { label: 'Redução de custos', value: '60%' }
    ]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Overview */}
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">{data.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-6">{data.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {data.metrics.map((metric, index) => (
                <div key={index} className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-[#00C3FF] font-bold text-lg">{metric.value}</div>
                  <div className="text-xs text-slate-300">{metric.label}</div>
                </div>
              ))}
            </div>

            <h4 className="text-white font-semibold mb-3">Principais Benefícios:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {data.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversation Examples */}
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-[#00C3FF]" />
              Exemplo de Conversa Real
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.conversationExamples.map((exchange, index) => (
                <div key={index} className="space-y-3">
                  {/* Customer Message */}
                  <div className="flex justify-end">
                    <div className="bg-[#00C3FF] text-white p-3 rounded-lg max-w-[80%] text-sm">
                      {exchange.customer}
                    </div>
                  </div>
                  
                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-slate-700 text-slate-100 p-3 rounded-lg max-w-[80%] text-sm whitespace-pre-line">
                      {exchange.ai}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Chat Test */}
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-[#00C3FF]" />
              Teste a IA ao Vivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">
              Experimente uma conversa real com o assistente de viagens. Esta é uma demonstração funcional do sistema.
            </p>
            <ChatInterface
              webhookUrl="https://n8n-n8n.tx2a4o.easypanel.host/webhook-test/teste_viagens"
              title="Assistente de Viagens"
              description="Teste a inteligência artificial especializada em turismo"
            />
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Features */}
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-lg">Funcionalidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.features.map((feature, index) => (
                <div key={index} className="border-b border-slate-700 last:border-b-0 pb-3 last:pb-0">
                  <h4 className="text-white font-medium text-sm mb-1">{feature.title}</h4>
                  <p className="text-slate-300 text-xs">{feature.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-br from-[#00C3FF]/20 to-slate-800/50 border-[#00C3FF]/50">
          <CardContent className="p-6 text-center">
            <h3 className="text-white font-semibold mb-2">Interessado nesta solução?</h3>
            <p className="text-slate-300 text-sm mb-4">
              Agende uma demonstração personalizada para o seu negócio
            </p>
            <Button 
              onClick={() => navigate('/#contact')}
              className="w-full bg-[#00C3FF] hover:bg-[#00A3D9] text-white"
            >
              Agendar Demonstração
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgenciaViagensExample;