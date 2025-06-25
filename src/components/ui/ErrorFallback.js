import React from 'react';
import Button from './Button';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="p-4 bg-red-50 rounded-lg">
      <h2 className="text-lg font-bold text-red-800">Something went wrong</h2>
      <p className="text-red-600 mb-4">{error.message}</p>
      <Button onClick={resetErrorBoundary} variant="primary">
        Try Again
      </Button>
    </div>
  );
};

export default ErrorFallback;