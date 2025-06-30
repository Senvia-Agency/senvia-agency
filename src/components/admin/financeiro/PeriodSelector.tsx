
import { Button } from "@/components/ui/button";

interface PeriodSelectorProps {
  selectedPeriod: number;
  onPeriodChange: (period: number) => void;
}

const PeriodSelector = ({ selectedPeriod, onPeriodChange }: PeriodSelectorProps) => {
  const periods = [
    { value: 7, label: '7d' },
    { value: 30, label: '30d' },
    { value: 90, label: '90d' }
  ];

  return (
    <div className="flex gap-1 sm:gap-2">
      {periods.map(period => (
        <Button
          key={period.value}
          variant={selectedPeriod === period.value ? "default" : "outline"}
          onClick={() => onPeriodChange(period.value)}
          className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 h-8 sm:h-9"
        >
          {period.label}
        </Button>
      ))}
    </div>
  );
};

export default PeriodSelector;
