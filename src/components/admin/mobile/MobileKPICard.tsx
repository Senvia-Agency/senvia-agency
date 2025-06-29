
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MobileKPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "orange" | "purple";
}

const MobileKPICard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  color = "blue" 
}: MobileKPICardProps) => {
  const colorClasses = {
    blue: "text-blue-400 bg-blue-500/20",
    green: "text-green-400 bg-green-500/20", 
    orange: "text-orange-400 bg-orange-500/20",
    purple: "text-purple-400 bg-purple-500/20"
  };

  return (
    <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
          {trend && (
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              trend.isPositive 
                ? 'text-green-400 bg-green-500/20' 
                : 'text-red-400 bg-red-500/20'
            }`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {title}
          </h3>
          <p className="text-xl font-bold text-white">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileKPICard;
