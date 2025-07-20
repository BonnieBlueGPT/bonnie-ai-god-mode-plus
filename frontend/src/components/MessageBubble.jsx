// 🔥 GALATEA EMPIRE - MESSAGE BUBBLE COMPONENT
// Personality-adaptive message display

import React from 'react';

const MessageBubble = ({ message, personality }) => {
  const isUser = message.isUser;
  const theme = personality?.theme || {};
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getEscalationStyle = (level) => {
    const styles = {
      sweet: 'shadow-pink-200',
      flirty: 'shadow-rose-300',
      romantic: 'shadow-purple-300',
      intimate: 'shadow-red-300'
    };
    return styles[level] || styles.sweet;
  };

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-xs lg:max-w-md">
          <div className="bg-blue-500 text-white rounded-lg px-4 py-2 shadow-md">
            <p className="text-sm">{message.text}</p>
            <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
          </div>
        </div>
      </div>
    );
  }

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
        
        {/* Message */}
        <div>
          <div 
            className={`rounded-lg px-4 py-2 shadow-md ${getEscalationStyle(message.escalationLevel)}`}
            style={{ 
              backgroundColor: theme.bubble || '#FFCCCB',
              color: theme.text || '#8B008B'
            }}
          >
            <p className="text-sm leading-relaxed">{message.text}</p>
            <div className="flex items-center justify-between mt-1">
              <p 
                className="text-xs opacity-70"
                style={{ color: theme.text || '#8B008B' }}
              >
                {formatTime(message.timestamp)}
              </p>
              {message.escalationLevel && message.escalationLevel !== 'sweet' && (
                <span className="text-xs opacity-60 ml-2">
                  {getEscalationEmoji(message.escalationLevel)}
                </span>
              )}
            </div>
          </div>
          
          {/* Personality name */}
          <p className="text-xs text-gray-500 mt-1 ml-1">
            {personality?.name || 'AI'}
          </p>
        </div>
      </div>
    </div>
  );
};

const getEscalationEmoji = (level) => {
  const emojis = {
    flirty: '😘',
    romantic: '💖',
    intimate: '🥰'
  };
  return emojis[level] || '';
};

export default MessageBubble;