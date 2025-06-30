
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
    <div className="bg-gray-900 p-3 rounded border border-gray-600 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-white">🔍 Debug: Usuários Admin</h4>
        {onRefresh && (
          <Button
            size="sm"
            variant="outline"
            onClick={onRefresh}
            className="h-6 px-2 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Atualizar
          </Button>
        )}
      </div>
      
      {adminUsersLoading && (
        <div className="text-xs text-yellow-400 mb-2">
          ⏳ Carregando usuários admin...
        </div>
      )}
      
      {adminUsersError && (
        <div className="text-xs text-red-400 mb-2">
          ❌ Erro ao carregar usuários admin: {adminUsersError.message}
        </div>
      )}
      
      {adminUsers && (
        <div className="space-y-2">
          <div className="text-xs text-green-400">
            ✅ {adminUsers.length} usuários admin encontrados
          </div>
          
          {adminUsers.length > 0 ? (
            <div className="text-xs text-gray-300">
              <div className="font-medium mb-1">📋 Lista de usuários admin:</div>
              <ul className="list-disc list-inside space-y-1">
                {adminUsers.map((user, index) => (
                  <li key={user.user_id} className="text-xs">
                    {index + 1}. <strong>{user.full_name}</strong> ({user.email}) 
                    <br />
                    <span className="ml-4 text-gray-400">
                      ID: {user.user_id} | Role: {user.role}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-xs text-orange-400">
              ⚠️ Array de usuários está vazio mesmo sem erro.
              <br />
              <span className="text-gray-400">
                Isso pode indicar que não há usuários com role='admin' na tabela profiles.
              </span>
            </div>
          )}
        </div>
      )}
      
      {!adminUsersLoading && !adminUsersError && (!adminUsers || adminUsers.length === 0) && (
        <div className="text-xs text-orange-400">
          ⚠️ Nenhum usuário admin encontrado. 
          <br />
          <span className="text-gray-400">
            Verifique se existem usuários com role='admin' na tabela profiles do Supabase.
          </span>
        </div>
      )}
    </div>
  );
};
