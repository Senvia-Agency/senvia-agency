
import { AdminUser } from "@/hooks/useAdminUsers";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database, AlertTriangle, CheckCircle } from "lucide-react";

interface AdminUsersDebugInfoProps {
  adminUsers?: AdminUser[];
  adminUsersLoading: boolean;
  adminUsersError: Error | null;
  onRefresh?: () => void;
}

export const AdminUsersDebugInfo = ({ 
  adminUsers, 
  adminUsersLoading, 
  adminUsersError, 
  onRefresh 
}: AdminUsersDebugInfoProps) => {
  return (
    <div className="bg-gray-900 p-4 rounded border border-gray-600 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-white flex items-center gap-2">
          <Database className="h-4 w-4" />
          🔍 Debug: Usuários Admin
        </h4>
        {onRefresh && (
          <Button
            size="sm"
            variant="outline"
            onClick={onRefresh}
            className="h-7 px-3 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Atualizar
          </Button>
        )}
      </div>
      
      {adminUsersLoading && (
        <div className="text-xs text-yellow-400 mb-2 p-2 bg-yellow-900/20 rounded flex items-center gap-2">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-400"></div>
          ⏳ Carregando usuários admin...
        </div>
      )}
      
      {adminUsersError && (
        <div className="text-xs text-red-400 mb-2 p-2 bg-red-900/20 rounded">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-3 w-3" />
            ❌ Erro ao carregar usuários admin:
          </div>
          <code className="text-xs block bg-red-800/30 p-1 rounded">{adminUsersError.message}</code>
        </div>
      )}
      
      {adminUsers && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-green-400 font-bold flex items-center gap-2">
              <CheckCircle className="h-3 w-3" />
              <strong>{adminUsers.length}</strong> usuários admin encontrados
            </div>
            <div className="text-xs text-blue-400">
              {new Date().toLocaleTimeString()} - Última busca
            </div>
          </div>
          
          {adminUsers.length > 0 ? (
            <div className="text-xs text-gray-300">
              <div className="font-medium mb-2 text-white">📋 Usuários admin disponíveis:</div>
              <div className="space-y-2">
                {adminUsers.map((user, index) => (
                  <div key={user.user_id} className="p-2 bg-gray-800 rounded border-l-4 border-green-500">
                    <div className="font-medium text-green-400 mb-1">
                      👤 {index + 1}. {user.full_name}
                    </div>
                    <div className="text-gray-400 text-xs space-y-1">
                      <div>📧 Email: <span className="text-white">{user.email}</span></div>
                      <div>🆔 User ID: <code className="bg-gray-700 px-1 rounded text-xs">{user.user_id}</code></div>
                      <div>🏷️ Role: <span className="text-green-400 font-bold">{user.role}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-xs text-orange-400 p-3 bg-orange-900/20 rounded border border-orange-500">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4" />
                ⚠️ <strong>NENHUM usuário admin encontrado!</strong>
              </div>
              <div className="space-y-1 text-gray-400">
                <div>• Verifique se existem usuários com <code>role='admin'</code> na tabela <code>profiles</code></div>
                <div>• As políticas RLS foram configuradas para permitir que admins vejam todos os perfis</div>
              </div>
            </div>
          )}
          
          <div className="mt-3 p-2 bg-blue-900/20 rounded text-blue-300 text-xs">
            ✅ <strong>RLS Configurado:</strong> Usuários admin agora podem ver todos os perfis da tabela.
            <br />
            Check o console (F12) para logs detalhados da busca.
          </div>
        </div>
      )}
    </div>
  );
};
