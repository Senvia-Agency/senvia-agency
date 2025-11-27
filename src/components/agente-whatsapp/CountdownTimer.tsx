import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  targetDate: string;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-destructive" />
        <span className="text-sm font-semibold text-destructive uppercase">
          Oferta termina em
        </span>
      </div>
      
      <div className="flex gap-2 md:gap-4">
        <div className="flex flex-col items-center bg-card border border-destructive/30 rounded-lg p-3 min-w-[60px]">
          <span className="text-3xl font-bold text-destructive">{timeLeft.days}</span>
          <span className="text-xs text-muted-foreground uppercase">Dias</span>
        </div>
        <div className="flex flex-col items-center bg-card border border-destructive/30 rounded-lg p-3 min-w-[60px]">
          <span className="text-3xl font-bold text-destructive">{timeLeft.hours}</span>
          <span className="text-xs text-muted-foreground uppercase">Horas</span>
        </div>
        <div className="flex flex-col items-center bg-card border border-destructive/30 rounded-lg p-3 min-w-[60px]">
          <span className="text-3xl font-bold text-destructive">{timeLeft.minutes}</span>
          <span className="text-xs text-muted-foreground uppercase">Min</span>
        </div>
        <div className="flex flex-col items-center bg-card border border-destructive/30 rounded-lg p-3 min-w-[60px]">
          <span className="text-3xl font-bold text-destructive">{timeLeft.seconds}</span>
          <span className="text-xs text-muted-foreground uppercase">Seg</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
