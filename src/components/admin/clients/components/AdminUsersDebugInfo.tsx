
import { AdminUser } from "@/hooks/useAdminUsers";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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
        <h4 className="text-sm font-medium text-white">🔍 Debug: Usuários Admin</h4>
        {onRefresh && (
          <Button
            size="sm"
            variant="outline"
            onClick={onRefresh}
            className="h-7 px-3 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Força Atualizar
          </Button>
        )}
      </div>
      
      {adminUsersLoading && (
        <div className="text-xs text-yellow-400 mb-2 p-2 bg-yellow-900/20 rounded">
          ⏳ Carregando usuários admin...
        </div>
      )}
      
      {adminUsersError && (
        <div className="text-xs text-red-400 mb-2 p-2 bg-red-900/20 rounded">
          ❌ Erro ao carregar usuários admin: 
          <br />
          <code className="text-xs">{adminUsersError.message}</code>
        </div>
      )}
      
      {adminUsers && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-green-400">
              ✅ <strong>{adminUsers.length}</strong> usuários admin encontrados
            </div>
            <div className="text-xs text-blue-400">
              {new Date().toLocaleTimeString()} - Última busca
            </div>
          </div>
          
          {adminUsers.length > 0 ? (
            <div className="text-xs text-gray-300">
              <div className="font-medium mb-2 text-white">📋 Lista completa de usuários admin:</div>
              <div className="space-y-2">
                {adminUsers.map((user, index) => (
                  <div key={user.user_id} className="p-2 bg-gray-800 rounded border-l-2 border-green-500">
                    <div className="font-medium text-white">
                      {index + 1}. {user.full_name}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      📧 Email: {user.email}
                      <br />
                      🆔 User ID: <code className="bg-gray-700 px-1 rounded text-xs">{user.user_id}</code>
                      <br />
                      👤 Role: <span className="text-green-400">{user.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-xs text-orange-400 p-3 bg-orange-900/20 rounded">
              ⚠️ <strong>Array de usuários está vazio!</strong>
              <br />
              <span className="text-gray-400">
                Isso indica que não há usuários com role='admin' sendo retornados pela query.
              </span>
              <br />
              <span className="text-yellow-400">
                Verifique o console do navegador (F12) para logs detalhados.
              </span>
            </div>
          )}
        </div>
      )}
      
      {!adminUsersLoading && !adminUsersError && (!adminUsers || adminUsers.length === 0) && (
        <div className="text-xs text-orange-400 p-3 bg-orange-900/20 rounded">
          ⚠️ <strong>Nenhum usuário admin encontrado.</strong>
          <br />
          <span className="text-gray-400">
            Mesmo com usuários admin existindo no Supabase, eles não estão sendo retornados.
          </span>
          <br />
          <span className="text-yellow-400">
            Verifique os logs do console para mais detalhes sobre a query.
          </span>
        </div>
      )}
    </div>
  );
};
