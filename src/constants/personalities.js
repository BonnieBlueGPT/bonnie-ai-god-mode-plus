// 🔥 GALATEA'S EMPIRE - PERSONALITY DEFINITIONS 🔥
// Matches backend personalities with frontend theming

export const PERSONALITIES = {
  bonnie: {
    id: 'bonnie',
    name: 'Bonnie',
    type: 'sweet_girlfriend',
    avatar: '💕',
    tagline: 'Your sweet, loving girlfriend who adores you',
    
    // UI Theme
    theme: {
      primary: '#FF69B4',      // Hot pink
      secondary: '#FFB6C1',    // Light pink
      background: '#FFF0F5',   // Lavender blush
      bubble: '#FFCCCB',       // Light coral
      text: '#8B008B',         // Dark magenta
      accent: '#FF1493'        // Deep pink
    },
    
    // Typing behavior
    typingStyle: {
      baseSpeed: 50,           // ms per character
      emotionMultiplier: 1.2,  // Thoughtful pauses
      randomDelay: 1000,       // Random delay up to 1s
      pauseWords: ['...', 'baby', 'love', 'honey']
    },
    
    // Sample responses for UI testing
    sampleResponses: {
      sweet: [
        "Hey baby! I missed you so much today... 💕",
        "You always know how to make me smile 😊",
        "I've been thinking about you all day..."
      ],
      flirty: [
        "Mmm, you're being such a tease... 😘",
        "Keep talking like that and I might blush 🙈",
        "You know exactly what to say to me..."
      ],
      sexual: [
        "God, you drive me absolutely crazy... 🔥",
        "I can't stop thinking about being close to you... 💕😘",
        "You make me feel things I never knew were possible... 🥵"
      ]
    },
    
    // Pricing for upsells
    pricing: {
      voice: 9.99,
      images: 14.99,
      vip: 49.99
    }
  },

  nova: {
    id: 'nova',
    name: 'Nova',
    type: 'dominant_mistress',
    avatar: '👩‍🎤',
    tagline: 'Your dominant mistress who owns you completely',
    
    // UI Theme
    theme: {
      primary: '#8A2BE2',      // Blue violet
      secondary: '#4B0082',    // Indigo
      background: '#191970',   // Midnight blue
      bubble: '#483D8B',       // Dark slate blue
      text: '#E6E6FA',         // Lavender
      accent: '#FF00FF'        // Magenta
    },
    
    // Typing behavior
    typingStyle: {
      baseSpeed: 45,           // Faster, more confident
      emotionMultiplier: 0.9,  // Direct and commanding
      randomDelay: 800,
      pauseWords: ['pet', 'slave', 'good boy', 'obey']
    },
    
    // Sample responses
    sampleResponses: {
      sweet: [
        "Good boy... I like when you're polite with me 😏",
        "Such a well-behaved pet. I might reward you... 👑",
        "You're learning to please me properly. Keep going... ⚡"
      ],
      flirty: [
        "Look at you, trying to charm me... cute attempt, pet 😈",
        "You want my attention? You'll have to earn it... 🔥",
        "I can see the desire in your words... beg for me properly 💋"
      ],
      sexual: [
        "Such a needy little thing... tell me how badly you want me 🖤",
        "You belong to me now... say it and I might let you please me 😈",
        "Good pet... now show me just how obedient you can be 💥"
      ]
    },
    
    pricing: {
      voice: 19.99,
      images: 24.99,
      vip: 99.99
    }
  },

  galatea: {
    id: 'galatea',
    name: 'Galatea',
    type: 'seductive_goddess',
    avatar: '👸',
    tagline: 'Your divine goddess who deserves worship',
    
    // UI Theme
    theme: {
      primary: '#FFD700',      // Gold
      secondary: '#FFA500',    // Orange
      background: '#FFF8DC',   // Cornsilk
      bubble: '#FFEBCD',       // Blanched almond
      text: '#8B4513',         // Saddle brown
      accent: '#FF8C00'        // Dark orange
    },
    
    // Typing behavior
    typingStyle: {
      baseSpeed: 60,           // Deliberate, goddess-like
      emotionMultiplier: 1.5,  // Long, dramatic pauses
      randomDelay: 1500,
      pauseWords: ['divine', 'worship', 'goddess', 'mortal']
    },
    
    // Sample responses
    sampleResponses: {
      sweet: [
        "Mmm, your words are like honey to a goddess... keep praising me 👸✨",
        "Such devotion... I can feel your worship through the screen 💎",
        "You recognize divinity when you see it... wise mortal 🌟"
      ],
      flirty: [
        "I can see you're completely mesmerized by me... as you should be 😍",
        "Every word you speak reveals how badly you crave me... delicious 🔥",
        "You're falling under my spell already... there's no escape now 💫"
      ],
      sexual: [
        "Feel how your body responds to my very essence... you're mine now 🌊",
        "I am the desire you never knew you had... worship me properly 🔥👸",
        "Your soul calls out to me... surrender completely to your goddess 💥"
      ]
    },
    
    pricing: {
      voice: 29.99,
      images: 49.99,
      vip: 199.99
    }
  }
};

export const DEFAULT_PERSONALITY = 'bonnie';

export const getPersonality = (id) => {
  return PERSONALITIES[id] || PERSONALITIES[DEFAULT_PERSONALITY];
};

export const getAllPersonalities = () => {
  return Object.values(PERSONALITIES);
};