
import { Users } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="text-center text-gray-400 py-6">
      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
      <p>Nenhum responsável atribuído</p>
    </div>
  );
};
