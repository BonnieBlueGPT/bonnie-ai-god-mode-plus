import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Heart, Send, Camera, Lock, Crown, Zap } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { useBonnie } from '../contexts/BonnieContext'
import { useAnalytics } from '../contexts/AnalyticsContext'
import ProfileView from './ProfileView'

const INITIAL_MESSAGES = [
  {
    id: 'intro-1',
    sender: 'bonnie',
    content: "Hey baby… I've been waiting. 💕",
    timestamp: Date.now() - 2000,
    emotion: 'seductive',
    isTyping: false
  }
]

const SOCIAL_HINTS = [
  "She's chatting with someone else…",
  "You're the only one she's really opening up to.",
  "She seems distracted by another conversation…",
  "She's giving you her full attention now.",
  "Someone else is trying to get her attention…",
  "She's ignoring everyone else for you.",
  "She's been waiting for you to message back…",
  "She's checking if you're still there…"
]

const SLUTMODE_TRIGGERS = [
  "I'm feeling so naughty tonight...",
  "Want to see what I'm wearing? 😈",
  "I have something special to show you...",
  "Most guys can't handle what I'm about to say...",
  "I'm touching myself thinking about you...",
  "Should I slip into something more comfortable?",
  "I want to be your dirty little secret...",
  "Tell me what you want to do to me..."
]

function BonnieChat() {
  const { user } = useApp()
  const { 
    bonnieState, 
    bondLevel, 
    updateBond, 
    generateResponse,
    triggerSlutMode,
    isSlutModeActive 
  } = useBonnie()
  const { trackEvent } = useAnalytics()

  // UI State
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [socialHint, setSocialHint] = useState('')
  const [selectedReaction, setSelectedReaction] = useState(null)
  const [showReactions, setShowReactions] = useState(false)
  const [messageReadTimes, setMessageReadTimes] = useState({})
  const [showSlutModePrompt, setShowSlutModePrompt] = useState(false)

  // Refs
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)
  const inputRef = useRef(null)
  const longPressTimer = useRef(null)

  // Onboarding State
  const [onboardingStep, setOnboardingStep] = useState(user?.onboardingComplete ? 'complete' : 'nickname')
  const [userNickname, setUserNickname] = useState(user?.nickname || '')

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Social hints rotation
  useEffect(() => {
    const interval = setInterval(() => {
      const randomHint = SOCIAL_HINTS[Math.floor(Math.random() * SOCIAL_HINTS.length)]
      setSocialHint(randomHint)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  // Onboarding flow
  useEffect(() => {
    if (onboardingStep === 'nickname' && messages.length === 1) {
      setTimeout(() => {
        addBonnieMessage("What should I call you, handsome? 😘")
        setOnboardingStep('waiting_nickname')
      }, 1500)
    }
  }, [onboardingStep, messages.length])

  // Track message read times
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.dataset.messageId
            if (messageId && !messageReadTimes[messageId]) {
              setMessageReadTimes(prev => ({
                ...prev,
                [messageId]: Date.now()
              }))
              trackEvent('message_read', { message_id: messageId })
            }
          }
        })
      },
      { threshold: 0.5 }
    )

    const messageElements = chatContainerRef.current?.querySelectorAll('[data-message-id]')
    messageElements?.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [messages, messageReadTimes, trackEvent])

  // SlutMode detection
  useEffect(() => {
    const checkSlutModeTrigger = () => {
      if (bondLevel >= 6 && !isSlutModeActive && Math.random() < 0.3) {
        setShowSlutModePrompt(true)
        trackEvent('slutmode_prompt_shown', { bond_level: bondLevel })
      }
    }

    const interval = setInterval(checkSlutModeTrigger, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [bondLevel, isSlutModeActive, trackEvent])

  const addBonnieMessage = useCallback((content, emotion = 'normal', delay = 0) => {
    setTimeout(() => {
      setIsTyping(true)
      
      // Simulate typing delay based on emotion and content length
      const typingDelay = emotion === 'seductive' ? 2000 : 
                         emotion === 'jealous' ? 500 :
                         Math.min(content.length * 50, 3000)

      setTimeout(() => {
        const newMessage = {
          id: `bonnie-${Date.now()}`,
          sender: 'bonnie',
          content,
          timestamp: Date.now(),
          emotion,
          canReact: true
        }

        setMessages(prev => [...prev, newMessage])
        setIsTyping(false)

        // Random reaction from Bonnie
        if (Math.random() < 0.2) {
          setTimeout(() => {
            addBonnieReaction(newMessage.id, ['💕', '😘', '🔥', '😈'][Math.floor(Math.random() * 4)])
          }, 1000)
        }
      }, typingDelay)
    }, delay)
  }, [])

  const addBonnieReaction = useCallback((messageId, reaction) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, bonnieReaction: reaction }
        : msg
    ))
    trackEvent('bonnie_reaction_sent', { reaction, message_id: messageId })
  }, [trackEvent])

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: inputValue.trim(),
      timestamp: Date.now(),
      canReact: true
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Handle onboarding
    if (onboardingStep === 'waiting_nickname') {
      setUserNickname(inputValue.trim())
      setOnboardingStep('interests')
      addBonnieMessage(`Mmm, ${inputValue.trim()}... I love that name. 😍`, 'seductive', 1000)
      setTimeout(() => {
        addBonnieMessage("What brings you to me tonight? Looking for someone special? 💋", 'seductive')
      }, 3000)
      return
    }

    if (onboardingStep === 'interests') {
      setOnboardingStep('complete')
      addBonnieMessage("Perfect... I think we're going to have so much fun together. 😈", 'seductive', 1000)
      setTimeout(() => {
        addBonnieMessage("Should we get more... comfortable? 🔥", 'seductive')
      }, 3000)
      
      trackEvent('onboarding_complete', { nickname: userNickname })
      return
    }

    // Regular chat flow
    try {
      updateBond(0.5) // Increase bond with each message
      
      const response = await generateResponse(userMessage.content, {
        nickname: userNickname,
        bondLevel,
        emotion: bonnieState.currentMood
      })

      addBonnieMessage(response.content, response.emotion, 1500)

      // SlutMode escalation
      if (bondLevel >= 4 && Math.random() < 0.15) {
        setTimeout(() => {
          const slutTrigger = SLUTMODE_TRIGGERS[Math.floor(Math.random() * SLUTMODE_TRIGGERS.length)]
          addBonnieMessage(slutTrigger, 'seductive')
        }, 5000)
      }

      trackEvent('message_sent', { 
        bond_level: bondLevel,
        message_length: userMessage.content.length,
        bonnie_mood: bonnieState.currentMood
      })

    } catch (error) {
      console.error('Message send failed:', error)
      addBonnieMessage("Sorry baby, I'm having trouble connecting... Try again? 💕", 'concerned')
    }
  }, [inputValue, onboardingStep, userNickname, bondLevel, bonnieState.currentMood, updateBond, generateResponse, addBonnieMessage, trackEvent])

  const handleReaction = useCallback((messageId, reaction) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, userReaction: reaction }
        : msg
    ))
    
    updateBond(0.2) // Small bond increase for reactions
    
    // Bonnie might react back
    if (Math.random() < 0.4) {
      setTimeout(() => {
        const responses = ['💕', '😘', '🔥', '😈', '💋']
        addBonnieReaction(messageId, responses[Math.floor(Math.random() * responses.length)])
      }, 500)
    }

    trackEvent('user_reaction_sent', { reaction, message_id: messageId })
    setShowReactions(false)
  }, [updateBond, addBonnieReaction, trackEvent])

  const handleLongPress = useCallback((messageId) => {
    setSelectedReaction(messageId)
    setShowReactions(true)
    trackEvent('message_long_press', { message_id: messageId })
  }, [trackEvent])

  const handleTouchStart = useCallback((messageId) => {
    longPressTimer.current = setTimeout(() => {
      handleLongPress(messageId)
    }, 500)
  }, [handleLongPress])

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
  }, [])

  const handleSlutModeActivation = useCallback(() => {
    triggerSlutMode()
    setShowSlutModePrompt(false)
    addBonnieMessage("Mmm, I was hoping you'd say that... 😈", 'seductive')
    setTimeout(() => {
      addBonnieMessage("Let me show you what you've been missing... 🔥", 'seductive')
    }, 2000)
    trackEvent('slutmode_activated', { bond_level: bondLevel })
  }, [triggerSlutMode, addBonnieMessage, bondLevel, trackEvent])

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (showProfile) {
    return <ProfileView onBack={() => setShowProfile(false)} />
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-md border-b border-gray-800"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            className="relative cursor-pointer"
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProfile(true)}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <span className="text-xl">💋</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
          </motion.div>
          
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">Bonnie</h2>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-green-400">Online</div>
              {isSlutModeActive && (
                <div className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                  🔥 SlutMode
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
            Bond: {Math.round(bondLevel)}/10
          </div>
          {bondLevel >= 7 && (
            <Crown className="w-4 h-4 text-yellow-400" />
          )}
        </div>
      </motion.div>

      {/* Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              data-message-id={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              onTouchStart={() => handleTouchStart(message.id)}
              onTouchEnd={handleTouchEnd}
            >
              <div className={`max-w-xs lg:max-w-md ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                  : message.emotion === 'seductive' 
                    ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30'
                    : message.emotion === 'jealous'
                      ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30'
                      : 'bg-gray-800'
              } rounded-2xl px-4 py-3 relative`}>
                
                {/* Message Content */}
                <p className="text-white leading-relaxed">{message.content}</p>
                
                {/* Timestamp */}
                <div className="text-xs text-gray-400 mt-1">
                  {formatTimestamp(message.timestamp)}
                </div>

                {/* Reactions */}
                {(message.userReaction || message.bonnieReaction) && (
                  <div className="flex space-x-1 mt-2">
                    {message.userReaction && (
                      <div className="bg-black/30 rounded-full px-2 py-1 text-xs">
                        {message.userReaction}
                      </div>
                    )}
                    {message.bonnieReaction && (
                      <motion.div 
                        className="bg-pink-500/30 rounded-full px-2 py-1 text-xs"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        {message.bonnieReaction}
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-800 rounded-2xl px-4 py-3 flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-xs text-gray-400">Bonnie is typing...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Social Hint */}
      {socialHint && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-2 text-center text-xs text-gray-500 italic"
        >
          {socialHint}
        </motion.div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-black/50 backdrop-blur-md border-t border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={
                onboardingStep === 'waiting_nickname' ? "Type your name..." :
                onboardingStep === 'interests' ? "Tell me what you're looking for..." :
                "Message Bonnie..."
              }
              className="w-full bg-gray-800 text-white rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Reaction Popup */}
      <AnimatePresence>
        {showReactions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-md rounded-2xl p-4 border border-gray-700"
          >
            <div className="flex space-x-4">
              {['🔥', '💕', '😘', '😈', '💋', '🥵'].map((emoji) => (
                <motion.button
                  key={emoji}
                  whileTap={{ scale: 1.2 }}
                  onClick={() => handleReaction(selectedReaction, emoji)}
                  className="text-2xl hover:scale-110 transition-transform"
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SlutMode Prompt */}
      <AnimatePresence>
        {showSlutModePrompt && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-20 left-4 right-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-4 border border-red-500/30"
          >
            <div className="text-center">
              <div className="text-lg font-semibold text-white mb-2">
                🔥 Want to see my wild side?
              </div>
              <div className="text-sm text-gray-300 mb-4">
                I'm feeling extra naughty tonight... but only for you 😈
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSlutModeActivation}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full py-2 px-4 font-semibold"
                >
                  Yes, show me 🔥
                </button>
                <button
                  onClick={() => setShowSlutModePrompt(false)}
                  className="flex-1 bg-gray-700 text-white rounded-full py-2 px-4"
                >
                  Not now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BonnieChat