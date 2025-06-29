
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
    <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm w-full min-w-0">
      <CardHeader className="pb-2 lg:pb-3">
        <CardTitle className="flex items-center gap-2 text-base lg:text-lg text-white">
          <Euro className="h-4 w-4 lg:h-5 lg:w-5 text-senvia-500 flex-shrink-0" />
          <span className="truncate">Receita por Origem</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 lg:p-6 pt-0">
        <div className="h-40 sm:h-48 lg:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius="60%"
                innerRadius="30%"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend 
                wrapperStyle={{
                  fontSize: '11px',
                  color: '#e2e8f0'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-3 lg:mt-4 space-y-2">
          <div className="text-center">
            <p className="text-xs text-slate-400">Total</p>
            <p className="text-base sm:text-lg lg:text-xl font-bold text-white truncate">
              €{totalRevenue.toFixed(2)}
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-1.5 lg:gap-2 text-xs">
            {data.map((item, index) => (
              <div key={index} className="flex justify-between items-center min-w-0 gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div 
                    className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-300 truncate">{item.name}</span>
                </div>
                <span className="font-medium text-white flex-shrink-0">
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
