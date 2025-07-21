import { memo } from 'react';

// Spinner super otimizado e quase instantâneo
const LoadingSpinner = memo(() => (
  <div className="fixed inset-0 bg-background/60 z-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-6 h-6 border-2 border-senvia-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
      <div className="text-sm font-medium text-senvia-500">SENVIA</div>
    </div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;