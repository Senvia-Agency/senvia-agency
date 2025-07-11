import React, { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subWeeks, subMonths } from "date-fns";
import { pt } from "date-fns/locale";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  className?: string;
}

interface DatePreset {
  label: string;
  value: DateRange;
}

const getDatePresets = (): DatePreset[] => {
  const today = new Date();
  const yesterday = subDays(today, 1);
  
  return [
    {
      label: "Hoje",
      value: { from: today, to: today }
    },
    {
      label: "Ontem", 
      value: { from: yesterday, to: yesterday }
    },
        {
          label: "7 dias",
          value: { from: subDays(today, 6), to: today }
        },
        {
          label: "14 dias",
          value: { from: subDays(today, 13), to: today }
        },
        {
          label: "28 dias",
          value: { from: subDays(today, 27), to: today }
        },
        {
          label: "30 dias",
          value: { from: subDays(today, 29), to: today }
        },
        {
          label: "Esta semana",
          value: { from: startOfWeek(today, { weekStartsOn: 1 }), to: endOfWeek(today, { weekStartsOn: 1 }) }
        },
        {
          label: "Sem. passada",
          value: { 
            from: startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }), 
            to: endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }) 
          }
        },
        {
          label: "Este mês",
          value: { from: startOfMonth(today), to: endOfMonth(today) }
        },
        {
          label: "Mês passado",
          value: { 
            from: startOfMonth(subMonths(today, 1)), 
            to: endOfMonth(subMonths(today, 1)) 
          }
        }
  ];
};

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(value);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const presets = getDatePresets();

  const handlePresetClick = (preset: DatePreset) => {
    setSelectedRange(preset.value);
    setSelectedPreset(preset.label);
    onChange?.(preset.value);
    setIsOpen(false);
  };

  const handleApply = () => {
    onChange?.(selectedRange);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setSelectedRange(value);
    setSelectedPreset(null);
    setIsOpen(false);
  };

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return "Selecionar período";
    
    if (range.from && range.to) {
      return `${format(range.from, "dd 'de' MMM", { locale: pt })} - ${format(range.to, "dd 'de' MMM 'de' yyyy", { locale: pt })}`;
    }
    
    return format(range.from, "dd 'de' MMM 'de' yyyy", { locale: pt });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
            !value && "text-gray-400",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
        <div className="flex">
          {/* Presets sidebar */}
          <div className="w-40 border-r border-gray-700 p-3">
            <div className="space-y-1">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-700 transition-colors",
                    selectedPreset === preset.label ? "bg-blue-600 text-white" : "text-gray-300"
                  )}
                >
                  {preset.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setSelectedPreset("Personalizado");
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-700 transition-colors",
                  selectedPreset === "Personalizado" ? "bg-blue-600 text-white" : "text-gray-300"
                )}
              >
                Personalizado
              </button>
            </div>
          </div>

          {/* Calendar */}
          <div className="p-3">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={selectedRange?.from}
              selected={selectedRange}
              onSelect={setSelectedRange}
              numberOfMonths={2}
              locale={pt}
              className="pointer-events-auto"
            />
            
            {/* Action buttons */}
            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-700">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                className="bg-blue-600 hover:bg-blue-500 text-white"
              >
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}