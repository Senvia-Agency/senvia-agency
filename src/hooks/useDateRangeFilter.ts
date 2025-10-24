import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { subDays, isSameMonth, isSameDay, endOfMonth, format, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UseDateRangeFilterProps {
  defaultDays?: number;
  storageKey?: string;
}

export const useDateRangeFilter = ({ 
  defaultDays = 30, 
  storageKey 
}: UseDateRangeFilterProps = {}) => {
  const getTodayRange = (): DateRange => {
    const today = new Date();
    return {
      from: today,
      to: today
    };
  };

  const getDefaultRange = (): DateRange => {
    const today = new Date();
    return {
      from: subDays(today, defaultDays - 1),
      to: today
    };
  };

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (storageKey) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const { from, to } = JSON.parse(saved);
          return {
            from: new Date(from),
            to: new Date(to)
          };
        }
      } catch (error) {
        console.error('Error loading saved date range:', error);
      }
    }
    return getDefaultRange(); // Filtro padrão de 30 dias
  });

  // Save to localStorage when range changes
  useEffect(() => {
    if (storageKey) {
      try {
        if (dateRange?.from && dateRange?.to) {
          localStorage.setItem(storageKey, JSON.stringify({
            from: dateRange.from.toISOString(),
            to: dateRange.to.toISOString()
          }));
        } else if (dateRange === undefined) {
          localStorage.removeItem(storageKey);
        }
      } catch (error) {
        console.error('Error saving date range:', error);
      }
    }
  }, [dateRange, storageKey]);

  // Get date range as ISO strings for API calls
  const getDateRangeForAPI = () => {
    if (!dateRange?.from || !dateRange?.to) {
      const defaultRange = getDefaultRange();
      return {
        startDate: defaultRange.from!.toISOString(),
        endDate: defaultRange.to!.toISOString()
      };
    }

    return {
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString()
    };
  };

  // Get number of days in the current range
  const getDaysInRange = () => {
    if (!dateRange?.from || !dateRange?.to) return defaultDays;
    
    const timeDiff = dateRange.to.getTime() - dateRange.from.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  };

  // Get smart period description
  const getPeriodDescription = () => {
    if (!dateRange?.from || !dateRange?.to) return `Últimos ${defaultDays} dias`;
    
    const today = new Date();
    const from = dateRange.from;
    const to = dateRange.to;
    
    // Detectar se é "Hoje"
    if (isSameDay(from, to) && isSameDay(from, today)) {
      return "Hoje";
    }
    
    // Detectar se é "Este mês" (do dia 1 ao último dia do mês)
    if (isSameMonth(from, to) && 
        from.getDate() === 1 && 
        to.getDate() === endOfMonth(to).getDate() &&
        isSameMonth(from, today)) {
      return "Este mês";
    }
    
    // Detectar se é um mês completo específico
    if (isSameMonth(from, to) && 
        from.getDate() === 1 && 
        to.getDate() === endOfMonth(to).getDate()) {
      return format(from, "MMMM 'de' yyyy", { locale: ptBR });
    }
    
    // Fallback: número de dias
    const days = getDaysInRange();
    return `Últimos ${days} dias`;
  };

  return {
    dateRange,
    setDateRange,
    getDateRangeForAPI,
    getDaysInRange,
    getPeriodDescription,
    resetToDefault: () => setDateRange(getDefaultRange()),
    clearDateRange: () => setDateRange(undefined)
  };
};