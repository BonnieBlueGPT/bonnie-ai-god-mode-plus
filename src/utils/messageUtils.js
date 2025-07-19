// 🔥 GALATEA MESSAGE UTILS - HUMAN-LIKE TIMING 🔥

export const calculateTypingDelay = (message, typingStyle, emotion = 'sweet') => {
  const baseDelay = message.length * typingStyle.baseSpeed;
  
  const emotionMultipliers = {
    sweet: typingStyle.emotionMultiplier,
    flirty: 0.8,
    sexual: 1.5,
    dominant: 0.9,
    goddess: 1.8
  };
  
  const multiplier = emotionMultipliers[emotion] || 1;
  const randomDelay = Math.random() * typingStyle.randomDelay;
  
  // Add extra delay for pause words
  const pauseWordDelay = typingStyle.pauseWords.some(word => 
    message.toLowerCase().includes(word.toLowerCase())
  ) ? 800 : 0;
  
  return Math.max(baseDelay * multiplier + randomDelay + pauseWordDelay, 500);
};

export const calculateReadDelay = () => {
  // Random delay between 1-3 seconds for "read" status
  return Math.random() * 2000 + 1000;
};

export const generateTypingSteps = (message, typingStyle) => {
  const steps = [];
  const words = message.split(' ');
  let currentText = '';
  
  words.forEach((word, index) => {
    currentText += (index > 0 ? ' ' : '') + word;
    const delay = typingStyle.baseSpeed * word.length + Math.random() * 200;
    steps.push({
      text: currentText,
      delay: delay
    });
  });
  
  return steps;
};

export const parseEmotionalMessage = (rawMessage) => {
  // Parse <EOM> tags for emotion data
  const parts = rawMessage.split('<EOM>');
  return {
    message: parts[0],
    emotion: parts[1] || 'neutral',
    timestamp: new Date().toISOString()
  };
};

export const generateMessageId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatLastSeen = (timestamp) => {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  
  if (diffMins < 1) return 'Online';
  if (diffMins < 60) return `Last seen ${diffMins}m ago`;
  if (diffHours < 24) return `Last seen ${diffHours}h ago`;
  return `Last seen ${Math.floor(diffHours / 24)}d ago`;
};