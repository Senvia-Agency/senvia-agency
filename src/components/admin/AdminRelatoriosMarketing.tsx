import { useState, useEffect } from "react";
import { Plus, Edit, FileDown, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreateReportModal } from "./relatorios/CreateReportModal";
import { EditReportModal } from "./relatorios/EditReportModal";
import { ViewReportModal } from "./relatorios/ViewReportModal";

interface MarketingReport {
  id: string;
  client_name: string;
  campaign_name: string;
  report_period_start: string;
  report_period_end: string;
  report_type: string;
  ad_sets_count: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  spend: number;
  conversions: number;
  conversion_rate: number;
  cost_per_conversion: number;
  roas: number;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const AdminRelatoriosMarketing = () => {
  const [reports, setReports] = useState<MarketingReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<MarketingReport | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
      toast.error('Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (report: MarketingReport) => {
    setSelectedReport(report);
    setEditModalOpen(true);
  };

  const handleView = (report: MarketingReport) => {
    setSelectedReport(report);
    setViewModalOpen(true);
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm('Tem certeza que deseja excluir este relatório?')) return;

    try {
      const { error } = await supabase
        .from('marketing_reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;
      
      toast.success('Relatório excluído com sucesso');
      fetchReports();
    } catch (error) {
      console.error('Erro ao excluir relatório:', error);
      toast.error('Erro ao excluir relatório');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-senvia-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Relatórios de Marketing</h1>
          <p className="text-gray-400 mt-2">Gerencie relatórios de campanhas do Meta Ads</p>
        </div>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="bg-senvia-500 hover:bg-senvia-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Relatório
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white text-lg">{report.client_name}</CardTitle>
                  <p className="text-gray-400 text-sm mt-1">{report.campaign_name}</p>
                </div>
                <Badge 
                  variant={report.status === 'final' ? 'default' : 'secondary'}
                  className={report.status === 'final' ? 'bg-green-600' : 'bg-yellow-600'}
                >
                  {report.status === 'final' ? 'Final' : 'Rascunho'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Período</p>
                  <p className="text-white">
                    {formatDate(report.report_period_start)} - {formatDate(report.report_period_end)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Tipo</p>
                  <p className="text-white capitalize">{report.report_type}</p>
                </div>
                <div>
                  <p className="text-gray-400">Investimento</p>
                  <p className="text-white">{formatCurrency(report.spend)}</p>
                </div>
                <div>
                  <p className="text-gray-400">ROAS</p>
                  <p className="text-white">{report.roas}x</p>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-700">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleView(report)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(report)}
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(report.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reports.length === 0 && (
        <div className="text-center py-12">
          <FileDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">Nenhum relatório encontrado</h3>
          <p className="text-gray-400 mb-4">Crie seu primeiro relatório de marketing</p>
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="bg-senvia-500 hover:bg-senvia-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Relatório
          </Button>
        </div>
      )}

      <CreateReportModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={fetchReports}
      />

      {selectedReport && (
        <>
          <EditReportModal
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            report={selectedReport}
            onSuccess={fetchReports}
          />
          <ViewReportModal
            open={viewModalOpen}
            onOpenChange={setViewModalOpen}
            report={selectedReport}
          />
        </>
      )}
    </div>
  );
};

export default AdminRelatoriosMarketing;