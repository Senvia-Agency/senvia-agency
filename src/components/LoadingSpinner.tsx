import { memo } from 'react';

const LoadingSpinner = memo(() => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-senvia-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <div className="text-xl font-semibold text-senvia-500 mb-2">SENVIA</div>
      <p className="text-muted-foreground text-sm">A carregar...</p>
    </div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;