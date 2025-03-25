import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message,
  onRetry
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 mb-4">
      <div className="flex flex-col items-center py-4">
        <div className="rounded-full bg-red-100 p-3 mb-3">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-red-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        
        <h3 className="text-lg font-bold text-red-600 mb-2">Something went wrong</h3>
        
        <p className="text-center text-gray-600 mb-4">
          {message}
        </p>
        
        <div className="flex space-x-3 w-full">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
            >
              Try Again
            </button>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Refresh App
          </button>
        </div>
      </div>
    </div>
  );
}; 