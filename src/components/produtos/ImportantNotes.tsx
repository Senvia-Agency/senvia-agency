import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const ImportantNotes = () => {
  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto border-orange-500/20 bg-orange-50/50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-orange-700 dark:text-orange-400">
              <AlertTriangle className="h-6 w-6" />
              Notas Importantes (válido para todos os planos)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                📊 Banco de dados Supabase:
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                A estrutura usa o Supabase. O cliente pode começar no plano Free; se o volume exigir upgrade, 
                o custo do plano pago é assumido pelo cliente.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                📧 Plataforma de e-mail (Brevo, E-goi, SendGrid, etc.):
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                A conta fica em nome do cliente. Pode usar o plano gratuito e, se precisar de mais envios, 
                faz o upgrade diretamente com o fornecedor.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ImportantNotes;