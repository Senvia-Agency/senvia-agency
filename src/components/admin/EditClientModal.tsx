
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ActivityHistorySection from "./shared/ActivityHistorySection";
import CustomerProjectsSection from "./clients/CustomerProjectsSection";
import { ClientDetailsForm } from "./clients/components/ClientDetailsForm";
import { ClientInfoDisplay } from "./clients/components/ClientInfoDisplay";
import EntityContactsSection from "./shared/EntityContactsSection";

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: any;
}

const EditClientModal = ({ isOpen, onClose, client }: EditClientModalProps) => {
  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] bg-gray-800 border-gray-600 text-white p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-0 flex-shrink-0">
          <DialogTitle className="text-xl">Editar Cliente - {client.full_name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Fixed Tabs Header */}
          <div className="px-6 py-4 border-b border-gray-600 flex-shrink-0">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-700">
                <TabsTrigger value="details" className="data-[state=active]:bg-senvia-500">
                  Detalhes
                </TabsTrigger>
                <TabsTrigger value="contacts" className="data-[state=active]:bg-senvia-500">
                  Contatos
                </TabsTrigger>
                <TabsTrigger value="projects" className="data-[state=active]:bg-senvia-500">
                  Projetos
                </TabsTrigger>
                <TabsTrigger value="activity" className="data-[state=active]:bg-senvia-500">
                  Histórico
                </TabsTrigger>
              </TabsList>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-hidden">
                <TabsContent value="details" className="h-[calc(90vh-200px)] overflow-y-auto mt-6 px-1">
                  <div className="space-y-6">
                    <ClientDetailsForm client={client} onClose={onClose} />
                    <ClientInfoDisplay client={client} />
                  </div>
                </TabsContent>

                <TabsContent value="contacts" className="h-[calc(90vh-200px)] overflow-y-auto mt-6 px-1">
                  <EntityContactsSection entityType="customer" entityId={client.id} />
                </TabsContent>

                <TabsContent value="projects" className="h-[calc(90vh-200px)] overflow-y-auto mt-6 px-1">
                  <CustomerProjectsSection customerId={client.id} />
                </TabsContent>

                <TabsContent value="activity" className="h-[calc(90vh-200px)] overflow-y-auto mt-6 px-1">
                  <ActivityHistorySection 
                    entityType="customer" 
                    entityId={client.id} 
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Fixed Footer with Action Buttons */}
          <div className="px-6 py-4 border-t border-gray-600 flex-shrink-0 bg-gray-800">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                className="bg-senvia-500 hover:bg-senvia-600 text-white"
                onClick={() => {
                  // This will be handled by the form inside ClientDetailsForm
                  console.log('Save button clicked - form submission handled by ClientDetailsForm');
                }}
              >
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientModal;
