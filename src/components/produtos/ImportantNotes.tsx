import { AlertTriangle } from "lucide-react";

const ImportantNotes = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="border border-border/50 rounded-lg bg-card/50 p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">
              Notas Importantes (válido para todos os planos)
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <span className="font-medium text-foreground">📊 Banco de dados Supabase:</span>{" "}
                A estrutura usa o Supabase. O cliente pode começar no plano Free; se o volume exigir upgrade, 
                o custo do plano pago é assumido pelo cliente.
              </div>
              <div>
                <span className="font-medium text-foreground">📧 Plataforma de e-mail (Brevo, E-goi, SendGrid, etc.):</span>{" "}
                A conta fica em nome do cliente. Pode usar o plano gratuito e, se precisar de mais envios, 
                faz o upgrade diretamente com o fornecedor.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportantNotes;