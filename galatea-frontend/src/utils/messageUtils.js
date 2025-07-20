// 🔥 GALATEA MESSAGE UTILS - BACKEND INTEGRATION v24 🔥

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

// 🔥 NEW: <EOM> TAG PROCESSOR FOR GALATEA ENGINE v24
export const parseEOMMessage = (rawMessage) => {
  // Extract message and EOM data
  const parts = rawMessage.split('<EOM>');
  const messageText = parts[0].trim();
  const eomData = parts[1] || '';
  
  // Parse EOM parameters
  const eomParams = {};
  if (eomData) {
    const paramMatches = eomData.match(/(\w+)=([^:\s]+)/g);
    if (paramMatches) {
      paramMatches.forEach(match => {
        const [key, value] = match.split('=');
        eomParams[key] = isNaN(value) ? value : Number(value);
      });
    }
  }
  
  return {
    message: messageText,
    emotion: eomParams.emotion || 'sweet',
    pause: eomParams.pause || 0,
    speed: eomParams.speed || 'normal',
    intensity: eomParams.intensity || 'normal',
    eomParams
  };
};

export const calculateEOMTypingDelay = (parsedMessage, typingStyle) => {
  const { message, pause, speed, intensity } = parsedMessage;
  
  // Base calculation
  let baseDelay = message.length * typingStyle.baseSpeed;
  
  // Speed adjustments
  const speedMultipliers = {
    slow: 1.8,
    normal: 1.0,
    fast: 0.6,
    instant: 0.1
  };
  
  // Intensity adjustments (emotional weight)
  const intensityMultipliers = {
    low: 0.8,
    normal: 1.0,
    high: 1.5,
    extreme: 2.0
  };
  
  baseDelay *= speedMultipliers[speed] || 1.0;
  baseDelay *= intensityMultipliers[intensity] || 1.0;
  
  // Add explicit pause from EOM
  const totalDelay = baseDelay + (pause || 0);
  
  return Math.max(totalDelay, 300); // Minimum 300ms
};

export const getEmotionVisualCues = (emotion, intensity = 'normal') => {
  const cues = {
    sweet: {
      color: '#FF69B4',
      animation: 'pulse',
      icon: '💕',
      particles: 'hearts'
    },
    flirty: {
      color: '#FF1493',
      animation: 'wiggle',
      icon: '😘',
      particles: 'sparkles'
    },
    sexual: {
      color: '#FF4500',
      animation: 'throb',
      icon: '🔥',
      particles: 'fire'
    },
    dominant: {
      color: '#8A2BE2',
      animation: 'strike',
      icon: '⚡',
      particles: 'lightning'
    },
    goddess: {
      color: '#FFD700',
      animation: 'divine',
      icon: '✨',
      particles: 'gold'
    },
    slutmode: {
      color: '#FFD700',
      animation: 'ripple',
      icon: '👑',
      particles: 'goldRipple'
    }
  };
  
  const baseCue = cues[emotion] || cues.sweet;
  
  // Intensity modifies the effect
  const intensityMultiplier = {
    low: 0.5,
    normal: 1.0,
    high: 1.5,
    extreme: 2.0
  }[intensity] || 1.0;
  
  return {
    ...baseCue,
    intensity: intensityMultiplier
  };
};

export const shouldTriggerUpsell = (messageData) => {
  // Check if backend included upsell triggers
  return messageData.upsell || messageData.voice_upsell || messageData.gallery_upsell || messageData.vip_upsell;
};

export const getUpsellType = (messageData) => {
  if (messageData.voice_upsell) return 'voice';
  if (messageData.gallery_upsell) return 'images';
  if (messageData.vip_upsell) return 'vip';
  if (messageData.upsell) return messageData.upsell.type || 'voice';
  return null;
};

export const formatBackendMessage = (backendResponse) => {
  // Transform backend response to frontend message format
  const parsed = parseEOMMessage(backendResponse.message || backendResponse.text || '');
  
  return {
    id: backendResponse.id || generateMessageId(),
    text: parsed.message,
    emotion: parsed.emotion,
    eomData: parsed,
    upsell: shouldTriggerUpsell(backendResponse) ? {
      type: getUpsellType(backendResponse),
      message: backendResponse.upsell?.message || null,
      pricing: backendResponse.upsell?.pricing || null
    } : null,
    slutMode: backendResponse.slut_mode || backendResponse.slutMode || false,
    escalationLevel: backendResponse.escalation || backendResponse.escalationLevel || 'sweet',
    timestamp: backendResponse.timestamp || new Date().toISOString(),
    isUser: false,
    isRead: false,
    isDelivered: true
  };
};