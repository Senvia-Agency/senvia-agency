import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AgenciaViagensExample from '@/components/exemplos/agencia-viagens/AgenciaViagensExample';

const ExemplosIAAtendimento = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('agencia-viagens');

  const categories = [
    {
      id: 'agencia-viagens',
      name: 'Agência de Viagens e Excursões',
      icon: '✈️',
      description: 'Atendimento especializado para turismo e viagens',
      component: AgenciaViagensExample
    }
    // Futuras categorias serão adicionadas aqui
  ];

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
  const SelectedComponent = selectedCategoryData?.component;

  return (
    <>
      <Helmet>
        <title>Exemplos de IA para Atendimento | SENVIA Agency</title>
        <meta name="description" content="Veja exemplos práticos de como a Inteligência Artificial pode revolucionar o atendimento ao cliente em diferentes setores. Demonstrações ao vivo de Agentes IA." />
        <link rel="canonical" href="https://www.senvia.pt/exemplos-ia-atendimento" />
        <meta property="og:title" content="Exemplos de IA para Atendimento | SENVIA Agency" />
        <meta property="og:description" content="Demonstrações práticas de Agentes de IA para atendimento ao cliente em diferentes setores." />
        <meta property="og:url" content="https://www.senvia.pt/exemplos-ia-atendimento" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Exemplos de IA para Atendimento</h1>
              <p className="text-slate-300">Veja como nossa IA funciona em diferentes setores</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Escolha o setor:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'border-[#00C3FF] bg-slate-800'
                    : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold text-white mb-1">{category.name}</h3>
                  <p className="text-sm text-slate-300">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Dynamic Content Based on Selected Category */}
        {SelectedComponent && <SelectedComponent />}
      </div>
    </div>
    </>
  );
};

export default ExemplosIAAtendimento;
