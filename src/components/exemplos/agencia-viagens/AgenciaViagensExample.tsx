import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, MessageCircle, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
      { label: 'Tempo de resposta', value: '< 10s', icon: '⚡' },
      { label: 'Disponibilidade', value: '24/7', icon: '🕐' },
      { label: 'Conversões', value: '+45%', icon: '📈' },
      { label: 'Satisfação', value: '4.8/5', icon: '⭐' }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">{data.title}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{data.description}</p>
      </div>

      {/* WhatsApp Test Section - Destacado */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-foreground flex items-center justify-center">
            <Phone className="w-6 h-6 mr-3 text-primary" />
            Experimente a IA Agora
          </CardTitle>
          <p className="text-muted-foreground">
            Teste o assistente especializado em viagens diretamente no WhatsApp
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            onClick={() => window.open('https://wa.me/351939135114?text=Quero%20testar%20o%20agente%20de%20IA%20para%20Ag%C3%AAncias%20de%20Viagem', '_blank')}
            className="bg-green-600 hover:bg-green-700 text-white font-medium text-lg px-8 py-4 h-auto"
            size="lg"
          >
            <Phone className="w-5 h-5 mr-3" />
            Testar Agente de IA Ao Vivo no WhatsApp
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Clique para iniciar uma conversa real com o assistente de viagens
          </p>
        </CardContent>
      </Card>

      {/* Métricas em Cards Destacados */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {data.metrics.map((metric, index) => (
          <Card key={index} className="bg-card border hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">{metric.icon}</div>
              <div className="text-2xl font-bold text-primary mb-1">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Benefícios */}
        <div className="lg:col-span-2">
          <Card className="bg-card border h-fit">
            <CardHeader>
              <CardTitle className="text-xl text-foreground flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                Principais Benefícios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start p-4 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Funcionalidades */}
          <Card className="bg-card border mt-6">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Como Funciona</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.features.map((feature, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg hover:bg-muted/20 transition-colors">
                    <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar CTA */}
        <div>
          <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30 sticky top-6">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Pronto para implementar?
              </h3>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Agende uma demonstração personalizada e veja como nossa IA pode transformar o atendimento da sua agência de viagens.
              </p>
              <Button 
                onClick={() => navigate('/#contact')}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                size="lg"
              >
                Agendar Demonstração
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                Sem compromisso • Demonstração gratuita
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgenciaViagensExample;