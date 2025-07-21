import { memo } from 'react';

const LoadingSpinner = memo(() => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="text-3xl font-bold text-senvia-500 glow mb-4">SENVIA</div>
      <p className="text-muted-foreground">Carregando...</p>
    </div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;