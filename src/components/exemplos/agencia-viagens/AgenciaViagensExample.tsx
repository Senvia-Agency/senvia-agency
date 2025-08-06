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
      'Gestão automática de reservas e cancelamentos',
      'Suporte durante a viagem',
      'Integração com sistemas de reservas'
    ],
    features: [
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
    <div className="space-y-8">
      {/* Live Chat Test - Moved to top */}
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

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
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
    </div>
  );
};

export default AgenciaViagensExample;