import React from 'react';
import { WritingChallenge } from './WritingChallenge';
import { useAppContext } from '../contexts';

export const DangerousWritingApp: React.FC = () => {
  const { goBackToMenu } = useAppContext();

  return (
    <div className="relative">
      {/* Back to Menu Button */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={goBackToMenu}
          className="bg-white/90 hover:bg-white text-gray-700 font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2 border border-gray-200"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          Back to Menu
        </button>
      </div>

      {/* Writing Challenge Component */}
      <WritingChallenge />
    </div>
  );
};
