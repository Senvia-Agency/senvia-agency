
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Euro } from "lucide-react";

interface AdminRevenueBreakdownProps {
  revenueMetrics: any;
}

const AdminRevenueBreakdown = ({ revenueMetrics }: AdminRevenueBreakdownProps) => {
  console.log('AdminRevenueBreakdown - Dados recebidos:', revenueMetrics);

  const data = [
    {
      name: "Landing Pages",
      value: revenueMetrics?.landing_page_revenue || 0,
      color: "#22c55e"
    },
    {
      name: "Assinaturas",
      value: revenueMetrics?.subscription_revenue || 0,
      color: "#8b5cf6"
    },
    {
      name: "Outros",
      value: revenueMetrics?.other_revenue || 0,
      color: "#f59e0b"
    }
  ];

  const totalRevenue = revenueMetrics?.total_revenue || 0;

  return (
    <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Euro className="h-5 w-5 text-senvia-500" />
          Breakdown de Receita
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend 
                wrapperStyle={{
                  fontSize: '14px',
                  color: '#e2e8f0'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="text-center">
            <p className="text-sm text-slate-400">Total</p>
            <p className="text-2xl font-bold text-white">
              €{totalRevenue.toFixed(2)}
            </p>
          </div>
          
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-medium text-white">
                  €{item.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRevenueBreakdown;
