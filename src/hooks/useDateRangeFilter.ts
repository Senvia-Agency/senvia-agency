import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";

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
    return getTodayRange(); // Definir range padrão para hoje
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

  return {
    dateRange,
    setDateRange,
    getDateRangeForAPI,
    getDaysInRange,
    resetToDefault: () => setDateRange(getDefaultRange()),
    clearDateRange: () => setDateRange(undefined)
  };
};