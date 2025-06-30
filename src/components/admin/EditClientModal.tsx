
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActivityHistorySection from "./shared/ActivityHistorySection";
import CustomerProjectsSection from "./clients/CustomerProjectsSection";
import { ClientDetailsForm } from "./clients/components/ClientDetailsForm";
import { ClientInfoDisplay } from "./clients/components/ClientInfoDisplay";

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: any;
}

const EditClientModal = ({ isOpen, onClose, client }: EditClientModalProps) => {
  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] bg-gray-800 border-gray-600 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Editar Cliente - {client.full_name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 bg-gray-700 flex-shrink-0">
            <TabsTrigger value="details" className="data-[state=active]:bg-senvia-500">Detalhes</TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-senvia-500">Projetos</TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-senvia-500">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="flex-1 overflow-y-auto mt-6 space-y-6">
            <ClientDetailsForm client={client} onClose={onClose} />
            <ClientInfoDisplay client={client} />
          </TabsContent>

          <TabsContent value="projects" className="flex-1 overflow-y-auto mt-6">
            <CustomerProjectsSection customerId={client.id} />
          </TabsContent>

          <TabsContent value="activity" className="flex-1 overflow-y-auto mt-6">
            <ActivityHistorySection 
              entityType="customer" 
              entityId={client.id} 
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientModal;
