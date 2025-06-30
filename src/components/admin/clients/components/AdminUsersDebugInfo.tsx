
import { AdminUser } from "@/hooks/useAdminUsers";

interface AdminUsersDebugInfoProps {
  adminUsers?: AdminUser[];
  adminUsersLoading: boolean;
  adminUsersError: Error | null;
}

export const AdminUsersDebugInfo = ({ adminUsers, adminUsersLoading, adminUsersError }: AdminUsersDebugInfoProps) => {
  return (
    <>
      {adminUsersLoading && (
        <div className="text-xs text-yellow-400 mb-2">
          Carregando usuários admin...
        </div>
      )}
      {adminUsersError && (
        <div className="text-xs text-red-400 mb-2">
          Erro ao carregar usuários admin: {adminUsersError.message}
        </div>
      )}
      {adminUsers && (
        <div className="text-xs text-green-400 mb-2">
          {adminUsers.length} usuários admin encontrados
        </div>
      )}
    </>
  );
};
