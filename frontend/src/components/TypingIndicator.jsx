// 🔥 GALATEA EMPIRE - TYPING INDICATOR
// Shows when AI girlfriend is typing

import React from 'react';

const TypingIndicator = ({ personality }) => {
  const theme = personality?.theme || {};
  
  return (
    <div className="flex justify-start">
      <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
        {/* Avatar */}
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{ backgroundColor: theme.secondary || '#FFB6C1' }}
        >
          {personality?.avatar || '💕'}
        </div>
        
        {/* Typing bubble */}
        <div>
          <div 
            className="rounded-lg px-4 py-3 shadow-md"
            style={{ 
              backgroundColor: theme.bubble || '#FFCCCB',
              color: theme.text || '#8B008B'
            }}
          >
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <div 
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ 
                    backgroundColor: theme.primary || '#FF69B4',
                    animationDelay: '0ms'
                  }}
                />
                <div 
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ 
                    backgroundColor: theme.primary || '#FF69B4',
                    animationDelay: '150ms'
                  }}
                />
                <div 
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ 
                    backgroundColor: theme.primary || '#FF69B4',
                    animationDelay: '300ms'
                  }}
                />
              </div>
              <span className="text-xs opacity-70 ml-2">
                {personality?.name || 'AI'} is typing...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;