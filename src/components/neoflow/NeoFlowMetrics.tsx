import { Gauge, Clock, TrendingUp, DollarSign } from "lucide-react";

const NeoFlowMetrics = () => {
  const metrics = [
    {
      icon: Gauge,
      value: "93/100",
      label: "velocidade de página"
    },
    {
      icon: Clock,
      value: "≤ 60s",
      label: "tempo de resposta"
    },
    {
      icon: TrendingUp,
      value: "4,7%",
      label: "CR médio"
    },
    {
      icon: DollarSign,
      value: "4,8×",
      label: "ROI médio"
    }
  ];

  return (
    <section className="py-12 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <metric.icon className="w-6 h-6 text-primary" />
                <span className="text-2xl lg:text-3xl font-bold text-primary">
                  {metric.value}
                </span>
              </div>
              <p className="text-sm lg:text-base text-gray-300">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NeoFlowMetrics;