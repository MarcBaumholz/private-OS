
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <div className="h-3 w-3 animate-pulse rounded-full bg-cyan-300 [animation-delay:-0.3s]"></div>
      <div className="h-3 w-3 animate-pulse rounded-full bg-cyan-300 [animation-delay:-0.15s]"></div>
      <div className="h-3 w-3 animate-pulse rounded-full bg-cyan-300"></div>
    </div>
  );
};

export default Loader;
