import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Thermometer } from "lucide-react";

interface LeadTemperatureProps {
  temperature: string;
  isEditing?: boolean;
  onTemperatureChange?: (temperature: string) => void;
}

export const LeadTemperature = ({ temperature, isEditing, onTemperatureChange }: LeadTemperatureProps) => {
  const getTemperatureColor = (temp: string) => {
    switch (temp) {
      case 'hot': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warm': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cold': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTemperatureLabel = (temp: string) => {
    switch (temp) {
      case 'hot': return 'Quente';
      case 'warm': return 'Morno';
      case 'cold': return 'Frio';
      default: return temp;
    }
  };

  if (isEditing && onTemperatureChange) {
    return (
      <Select value={temperature} onValueChange={onTemperatureChange}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hot">🔥 Quente</SelectItem>
          <SelectItem value="warm">🌡️ Morno</SelectItem>
          <SelectItem value="cold">❄️ Frio</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Badge variant="outline" className={`${getTemperatureColor(temperature)} flex items-center gap-1`}>
      <Thermometer className="h-3 w-3" />
      {getTemperatureLabel(temperature)}
    </Badge>
  );
};