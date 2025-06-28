
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OneTimePricingProps {
  price: number | null;
  currency: string;
  onPriceChange: (price: number | null) => void;
  onCurrencyChange: (currency: string) => void;
}

const OneTimePricing = ({ price, currency, onPriceChange, onCurrencyChange }: OneTimePricingProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-slate-200">Preço do Produto</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Preço</label>
          <Input
            type="number"
            step="0.01"
            value={price || ''}
            onChange={(e) => onPriceChange(e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="0.00"
            className="bg-slate-700 border-slate-600 text-slate-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Moeda</label>
          <Select value={currency} onValueChange={onCurrencyChange}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="eur">EUR (€)</SelectItem>
              <SelectItem value="usd">USD ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default OneTimePricing;
