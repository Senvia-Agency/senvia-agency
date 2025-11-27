import { Users } from "lucide-react";

interface VacancyCounterProps {
  totalVacancies: number;
  remainingVacancies: number;
}

const VacancyCounter = ({ totalVacancies, remainingVacancies }: VacancyCounterProps) => {
  const filledVacancies = totalVacancies - remainingVacancies;
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        <span className="text-sm font-semibold text-primary uppercase">
          Vagas Disponíveis
        </span>
      </div>
      
      <div className="bg-card border border-primary/30 rounded-lg p-4 sm:p-6 min-w-[160px] sm:min-w-[200px]">
        <div className="text-center mb-4">
          <span className="text-4xl sm:text-5xl font-bold text-primary">{remainingVacancies}</span>
          <span className="text-xl sm:text-2xl text-muted-foreground">/{totalVacancies}</span>
        </div>
        
        {/* Visual Progress Bar */}
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${(filledVacancies / totalVacancies) * 100}%` }}
          ></div>
        </div>
        
        <p className="text-xs text-center text-muted-foreground mt-2">
          {filledVacancies > 0 ? `${filledVacancies} ${filledVacancies === 1 ? 'vaga reservada' : 'vagas reservadas'}` : 'Seja o primeiro!'}
        </p>
      </div>
    </div>
  );
};

export default VacancyCounter;
