
import { Button } from "@/components/ui/button";

interface PeriodSelectorProps {
  selectedPeriod: number;
  onPeriodChange: (period: number) => void;
}

const PeriodSelector = ({ selectedPeriod, onPeriodChange }: PeriodSelectorProps) => {
  const periods = [
    { value: 7, label: '7 dias' },
    { value: 30, label: '30 dias' },
    { value: 90, label: '90 dias' }
  ];

  return (
    <div className="flex gap-2">
      {periods.map(period => (
        <Button
          key={period.value}
          variant={selectedPeriod === period.value ? "default" : "outline"}
          onClick={() => onPeriodChange(period.value)}
          className="text-sm"
        >
          {period.label}
        </Button>
      ))}
    </div>
  );
};

export default PeriodSelector;
