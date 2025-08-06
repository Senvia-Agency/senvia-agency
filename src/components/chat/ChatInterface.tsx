import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatInterfaceProps {
  webhookUrl: string;
  title: string;
  description: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ webhookUrl, title, description }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou o assistente virtual da agência de viagens. Como posso ajudá-lo hoje? 😊',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    console.log('=== sendMessage called ===', { inputValue, isLoading });
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      console.log('=== Fazendo requisição ===', { webhookUrl, payload: { message: inputValue, timestamp: new Date().toISOString(), session_id: 'demo_session_' + Date.now() } });
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          timestamp: new Date().toISOString(),
          session_id: 'demo_session_' + Date.now()
        })
      });

      console.log('=== Resposta recebida ===', { status: response.status, ok: response.ok });

      if (!response.ok) {
        throw new Error('Erro na resposta do servidor');
      }

      let responseText: string;
      
      // Clona o response para poder ler de diferentes formas
      const responseClone = response.clone();
      
      try {
        const data = await response.json();
        
        // Se for um array, pega o primeiro item
        if (Array.isArray(data) && data.length > 0) {
          responseText = data[0].text || data[0].response || data[0].message || 'Resposta vazia do servidor.';
        } else {
          responseText = data.text || data.response || data.message || 'Resposta vazia do servidor.';
        }
      } catch {
        // Se não for JSON, lê como texto simples
        responseText = await responseClone.text() || 'Resposta vazia do servidor.';
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };

      console.log('=== Adicionando mensagem do bot ===', { responseText, botMessage });
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Desculpe, houve um erro ao processar sua mensagem. Tente novamente.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      toast.error('Erro ao enviar mensagem');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-600 h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center">
          <Bot className="w-5 h-5 mr-2 text-[#00C3FF]" />
          {title}
        </CardTitle>
        <p className="text-slate-300 text-sm">{description}</p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4">
        {/* Messages Area */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-[#00C3FF] text-white'
                    : 'bg-slate-700 text-slate-100'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === 'bot' && (
                    <Bot className="w-4 h-4 mt-0.5 text-[#00C3FF] flex-shrink-0" />
                  )}
                  {message.sender === 'user' && (
                    <User className="w-4 h-4 mt-0.5 text-white flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString('pt-PT', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-700 text-slate-100 rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-[#00C3FF]" />
                  <Loader2 className="w-4 h-4 animate-spin text-[#00C3FF]" />
                  <span className="text-sm">Digitando...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
          />
          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            className="bg-[#00C3FF] hover:bg-[#00A3D9] text-white"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;