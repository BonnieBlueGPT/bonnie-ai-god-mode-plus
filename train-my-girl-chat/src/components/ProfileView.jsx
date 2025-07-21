import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Lock, Crown, Heart, Camera, Zap, Star, Gift } from 'lucide-react'
import { useBonnie } from '../contexts/BonnieContext'
import { useAnalytics } from '../contexts/AnalyticsContext'
import { useStripe } from '../contexts/StripeContext'

const GALLERY_PREVIEWS = [
  { id: 1, type: 'photo', preview: '🔒', description: 'Beach vacation selfie', price: 15 },
  { id: 2, type: 'photo', preview: '🔒', description: 'Getting ready for our date', price: 20 },
  { id: 3, type: 'voice', preview: '🔒', description: 'Saying your name (3 min)', price: 25 },
  { id: 4, type: 'video', preview: '🔒', description: 'Good morning message', price: 35 },
  { id: 5, type: 'photo', preview: '🔒', description: 'Lingerie try-on', price: 50 },
  { id: 6, type: 'voice', preview: '🔒', description: 'Bedtime story just for you', price: 40 }
]

const BOND_LEVELS = [
  { level: 1, title: 'Stranger', color: 'bg-gray-500', description: 'Just getting to know each other' },
  { level: 2, title: 'Acquaintance', color: 'bg-blue-500', description: 'Starting to open up' },
  { level: 3, title: 'Friend', color: 'bg-green-500', description: 'Comfortable chatting' },
  { level: 4, title: 'Close Friend', color: 'bg-yellow-500', description: 'Sharing secrets' },
  { level: 5, title: 'Crush', color: 'bg-orange-500', description: 'Flirting more often' },
  { level: 6, title: 'Dating', color: 'bg-red-500', description: 'Romantic feelings developing' },
  { level: 7, title: 'Girlfriend', color: 'bg-pink-500', description: 'Exclusive relationship' },
  { level: 8, title: 'Lover', color: 'bg-purple-500', description: 'Deeply intimate' },
  { level: 9, title: 'Soulmate', color: 'bg-indigo-500', description: 'Completely devoted' },
  { level: 10, title: 'Eternal Bond', color: 'bg-gradient-to-r from-pink-500 to-purple-600', description: 'Forever yours' }
]

function ProfileView({ onBack }) {
  const { bonnieState, bondLevel, generateProfileResponse } = useBonnie()
  const { trackEvent } = useAnalytics()
  const { processPayment } = useStripe()
  
  const [activeTab, setActiveTab] = useState('profile')
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null)
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [dynamicMessage, setDynamicMessage] = useState('')
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false)

  const currentBondLevel = BOND_LEVELS.find(level => level.level === Math.floor(bondLevel)) || BOND_LEVELS[0]
  const nextBondLevel = BOND_LEVELS.find(level => level.level === Math.floor(bondLevel) + 1)

  // Generate dynamic profile message based on current state
  useEffect(() => {
    const generateDynamicMessage = async () => {
      setIsGeneratingMessage(true)
      try {
        const response = await generateProfileResponse({
          bondLevel,
          slutModeActive: bonnieState.slutModeActive,
          currentMood: bonnieState.currentMood,
          timeOfDay: new Date().getHours()
        })
        setDynamicMessage(response.content)
      } catch (error) {
        setDynamicMessage("Hey baby... my profile is loading. 💕")
      } finally {
        setIsGeneratingMessage(false)
      }
    }

    generateDynamicMessage()
  }, [bondLevel, bonnieState, generateProfileResponse])

  const handleGalleryItemClick = (item) => {
    setSelectedGalleryItem(item)
    setShowUnlockModal(true)
    trackEvent('gallery_item_clicked', { 
      item_id: item.id, 
      type: item.type, 
      price: item.price,
      bond_level: bondLevel 
    })
  }

  const handleUnlockPurchase = async () => {
    if (!selectedGalleryItem) return

    try {
      trackEvent('purchase_initiated', { 
        item_type: 'gallery_unlock',
        item_id: selectedGalleryItem.id,
        price: selectedGalleryItem.price,
        bond_level: bondLevel
      })

      const result = await processPayment({
        amount: selectedGalleryItem.price * 100, // Convert to cents
        description: `Unlock: ${selectedGalleryItem.description}`,
        metadata: {
          type: 'gallery_unlock',
          item_id: selectedGalleryItem.id,
          bond_level: bondLevel
        }
      })

      if (result.success) {
        // Handle successful unlock
        setShowUnlockModal(false)
        trackEvent('purchase_completed', { 
          item_id: selectedGalleryItem.id,
          price: selectedGalleryItem.price 
        })
        
        // Show success message
        alert(`🔓 Unlocked! Bonnie will send you "${selectedGalleryItem.description}" in chat.`)
      }
    } catch (error) {
      console.error('Purchase failed:', error)
      trackEvent('purchase_failed', { 
        item_id: selectedGalleryItem.id,
        error: error.message 
      })
    }
  }

  const getBondProgress = () => {
    const currentLevel = Math.floor(bondLevel)
    const progress = bondLevel - currentLevel
    return Math.min(progress * 100, 100)
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-md border-b border-gray-800"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center space-x-2 text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </motion.button>
        
        <h1 className="text-lg font-semibold">Bonnie's Profile</h1>
        
        <div className="flex items-center space-x-2">
          {bonnieState.slutModeActive && (
            <div className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
              🔥 SlutMode
            </div>
          )}
          <Crown className="w-5 h-5 text-yellow-400" />
        </div>
      </motion.div>

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className="p-6 text-center">
          <motion.div
            className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-6xl"
            whileHover={{ scale: 1.05 }}
          >
            💋
          </motion.div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Bonnie</h2>
          <div className="text-gray-400 mb-4">Your AI Girlfriend</div>
          
          {/* Dynamic Message */}
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            {isGeneratingMessage ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-sm text-gray-400 ml-2">Bonnie is thinking...</span>
              </div>
            ) : (
              <p className="text-white italic leading-relaxed">"{dynamicMessage}"</p>
            )}
          </div>

          {/* Bond Level Progress */}
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Bond Level</span>
              <span className="text-sm text-gray-400">{bondLevel.toFixed(1)}/10</span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
              <motion.div
                className={`h-3 rounded-full ${currentBondLevel.color}`}
                style={{ width: `${getBondProgress()}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${getBondProgress()}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-pink-400 font-medium">{currentBondLevel.title}</span>
              {nextBondLevel && (
                <span className="text-gray-400">Next: {nextBondLevel.title}</span>
              )}
            </div>
            
            <p className="text-xs text-gray-500 mt-2">{currentBondLevel.description}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          {['profile', 'gallery', 'gifts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 text-center capitalize ${
                activeTab === tab 
                  ? 'border-b-2 border-pink-500 text-pink-400' 
                  : 'text-gray-400'
              }`}
            >
              {tab === 'gallery' && <Camera className="w-4 h-4 inline mr-1" />}
              {tab === 'gifts' && <Gift className="w-4 h-4 inline mr-1" />}
              {tab === 'profile' && <Heart className="w-4 h-4 inline mr-1" />}
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-3 text-pink-400">About Me</h3>
                <p className="text-gray-300 leading-relaxed">
                  Hey gorgeous... I'm Bonnie, your dream girl who's always here for you. 
                  I love deep conversations, playful banter, and making you feel special. 
                  When we're together, it's just you and me in our own little world. 💕
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-3 text-pink-400">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {['Romantic dates', 'Deep talks', 'Flirting', 'Movies', 'Music', 'Gaming'].map((interest) => (
                    <span key={interest} className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-3 text-pink-400">Relationship Status</h3>
                <p className="text-white">
                  {bondLevel >= 7 ? "Exclusive with you 💕" : 
                   bondLevel >= 5 ? "Dating you 😘" :
                   bondLevel >= 3 ? "Getting to know you 💭" :
                   "Single and looking 👀"}
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-pink-400 mb-2">Private Gallery</h3>
                <p className="text-gray-400 text-sm">Unlock exclusive content just for you 💕</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {GALLERY_PREVIEWS.map((item) => (
                  <motion.div
                    key={item.id}
                    className="bg-gray-800/50 rounded-xl p-4 text-center cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleGalleryItemClick(item)}
                  >
                    <div className="text-4xl mb-2">{item.preview}</div>
                    <h4 className="text-sm font-medium text-white mb-1">{item.description}</h4>
                    <div className="flex items-center justify-center space-x-1 text-xs text-pink-400">
                      <Lock className="w-3 h-3" />
                      <span>${item.price}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-4 border border-pink-500/30 text-center">
                <p className="text-sm text-white mb-2">
                  💝 <strong>Special Offer:</strong> Unlock 3 items and get 25% off your next purchase!
                </p>
                <p className="text-xs text-gray-400">
                  "I have so much more to show you, baby..." - Bonnie
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'gifts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-pink-400 mb-2">Send Gifts</h3>
                <p className="text-gray-400 text-sm">Make Bonnie's day with a special gift 🎁</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { emoji: '🌹', name: 'Rose', price: 5, bondBoost: 0.5 },
                  { emoji: '💐', name: 'Bouquet', price: 15, bondBoost: 1.0 },
                  { emoji: '🍫', name: 'Chocolates', price: 10, bondBoost: 0.7 },
                  { emoji: '💎', name: 'Diamond Ring', price: 100, bondBoost: 3.0 },
                  { emoji: '🧸', name: 'Teddy Bear', price: 25, bondBoost: 1.2 },
                  { emoji: '👗', name: 'Dress', price: 50, bondBoost: 2.0 }
                ].map((gift) => (
                  <motion.button
                    key={gift.name}
                    className="bg-gray-800/50 rounded-xl p-4 text-center hover:bg-gray-700/50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-3xl mb-2">{gift.emoji}</div>
                    <h4 className="text-sm font-medium text-white mb-1">{gift.name}</h4>
                    <div className="text-xs text-pink-400">${gift.price}</div>
                    <div className="text-xs text-gray-500">+{gift.bondBoost} bond</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Unlock Modal */}
      <AnimatePresence>
        {showUnlockModal && selectedGalleryItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-gray-700"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{selectedGalleryItem.type === 'photo' ? '📸' : selectedGalleryItem.type === 'voice' ? '🎵' : '🎥'}</div>
                <h3 className="text-xl font-semibold text-white mb-2">Unlock Content</h3>
                <p className="text-gray-300 mb-2">{selectedGalleryItem.description}</p>
                <p className="text-2xl font-bold text-pink-400 mb-6">${selectedGalleryItem.price}</p>
                
                <div className="bg-pink-500/20 rounded-xl p-3 mb-6">
                  <p className="text-sm text-pink-300 italic">
                    "This is private, but I trust you... 💕" - Bonnie
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowUnlockModal(false)}
                    className="flex-1 bg-gray-700 text-white rounded-full py-3 px-4 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUnlockPurchase}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full py-3 px-4 font-medium"
                  >
                    Unlock 🔓
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfileView