import { useState } from "react";
import { FileDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from "sonner";

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
}

interface ViewReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: MarketingReport;
}

export const ViewReportModal = ({ open, onOpenChange, report }: ViewReportModalProps) => {
  const [generating, setGenerating] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-PT').format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const element = document.getElementById('report-content');
      if (!element) {
        toast.error('Erro ao gerar PDF');
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#111827', // bg-gray-900
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `relatorio_${report.client_name.replace(/\s+/g, '_')}_${report.report_period_start}_${report.report_period_end}.pdf`;
      pdf.save(fileName);
      
      toast.success('PDF gerado com sucesso');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-white">Relatório de Marketing</DialogTitle>
            <Button
              onClick={generatePDF}
              disabled={generating}
              className="bg-senvia-500 hover:bg-senvia-600 text-white"
            >
              <FileDown className="h-4 w-4 mr-2" />
              {generating ? "Gerando PDF..." : "Exportar PDF"}
            </Button>
          </div>
        </DialogHeader>

        <div id="report-content" className="space-y-6 p-6 bg-gray-900">
          {/* Header do Relatório */}
          <div className="text-center border-b border-gray-700 pb-6">
            <div className="flex justify-center mb-4">
              <div className="text-3xl font-bold text-senvia-500">SENVIA</div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Relatório de Marketing Digital</h1>
            <p className="text-gray-400">
              Período: {formatDate(report.report_period_start)} - {formatDate(report.report_period_end)}
            </p>
            <Badge 
              variant={report.status === 'final' ? 'default' : 'secondary'}
              className={`mt-2 ${report.status === 'final' ? 'bg-green-600' : 'bg-yellow-600'}`}
            >
              {report.status === 'final' ? 'Relatório Final' : 'Rascunho'}
            </Badge>
          </div>

          {/* Informações do Cliente */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-senvia-500">Informações da Campanha</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Cliente</p>
                <p className="text-white font-semibold text-lg">{report.client_name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Campanha</p>
                <p className="text-white font-semibold text-lg">{report.campaign_name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Tipo de Relatório</p>
                <p className="text-white font-semibold capitalize">{report.report_type}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Conjuntos de Anúncios</p>
                <p className="text-white font-semibold">{report.ad_sets_count}</p>
              </div>
            </CardContent>
          </Card>

          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700">
              <CardContent className="p-6 text-center">
                <h3 className="text-blue-200 text-sm font-medium">Impressões</h3>
                <p className="text-3xl font-bold text-white mt-2">{formatNumber(report.impressions)}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900 to-green-800 border-green-700">
              <CardContent className="p-6 text-center">
                <h3 className="text-green-200 text-sm font-medium">Cliques</h3>
                <p className="text-3xl font-bold text-white mt-2">{formatNumber(report.clicks)}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700">
              <CardContent className="p-6 text-center">
                <h3 className="text-purple-200 text-sm font-medium">Conversões</h3>
                <p className="text-3xl font-bold text-white mt-2">{formatNumber(report.conversions)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Métricas de Performance */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-senvia-500">Métricas de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">CTR</p>
                  <p className="text-2xl font-bold text-white">{report.ctr}%</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">CPC</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(report.cpc)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Taxa de Conversão</p>
                  <p className="text-2xl font-bold text-white">{report.conversion_rate}%</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Custo por Conversão</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(report.cost_per_conversion)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investimento e ROAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-red-900 to-red-800 border-red-700">
              <CardContent className="p-6 text-center">
                <h3 className="text-red-200 text-sm font-medium">Investimento Total</h3>
                <p className="text-3xl font-bold text-white mt-2">{formatCurrency(report.spend)}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-senvia-600 to-senvia-500 border-senvia-400">
              <CardContent className="p-6 text-center">
                <h3 className="text-senvia-100 text-sm font-medium">ROAS</h3>
                <p className="text-3xl font-bold text-white mt-2">{report.roas}x</p>
              </CardContent>
            </Card>
          </div>

          {/* Observações */}
          {report.notes && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-senvia-500">Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 whitespace-pre-wrap">{report.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              Relatório gerado em {formatDate(report.created_at)} | SENVIA - Marketing Digital
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};