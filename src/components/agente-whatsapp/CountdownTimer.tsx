import { useEffect, useState } from "react";
import { Clock, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownTimerProps {
  targetDate: string;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const unitLabels: Record<string, string> = {
    days: "Dias",
    hours: "Horas",
    minutes: "Min",
    seconds: "Seg"
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Clock className="h-6 w-6 text-destructive" />
        </motion.div>
        <span className="text-base font-bold text-destructive uppercase tracking-wider">
          ⏰ Oferta termina em
        </span>
      </motion.div>
      
      <div className="grid grid-cols-2 sm:flex gap-3 md:gap-4">
        {Object.entries(timeLeft).map(([unit, value], index) => (
          <motion.div
            key={unit}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center relative"
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl"
              animate={{ 
                opacity: [0.2, 0.4, 0.2],
                scale: [0.9, 1.1, 0.9]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
            />
            
            {/* Card */}
            <div className="relative bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/40 rounded-2xl p-3 sm:p-4 min-w-[70px] sm:min-w-[80px] md:min-w-[90px] shadow-lg backdrop-blur-sm overflow-hidden">
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
              />
              
              {/* Number with flip animation */}
              <div className="relative h-10 sm:h-12 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={value}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-black text-gradient absolute"
                  >
                    {String(value).padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
            
            {/* Label */}
            <motion.span
              className="text-xs md:text-sm text-muted-foreground mt-2 font-semibold uppercase tracking-wide"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
            >
              {unitLabels[unit]}
            </motion.span>
            
            {/* Decorative pulse */}
            {unit === 'seconds' && (
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Zap className="h-4 w-4 text-destructive fill-destructive" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Urgency message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <motion.p
          className="text-sm text-destructive font-semibold"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Não perca esta oportunidade única!
        </motion.p>
      </motion.div>
    </div>
  );
};

export default CountdownTimer;
