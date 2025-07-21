import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useApp } from './contexts/AppContext'
import { useJade } from './contexts/JadeContext'
import { useAnalytics } from './contexts/AnalyticsContext'

// Pages
import Landing from './pages/Landing'
import Chat from './pages/Chat'
import Onboarding from './pages/Onboarding'
import Pricing from './pages/Pricing'
import Profile from './pages/Profile'
import Gallery from './pages/Gallery'
import Withdrawal from './pages/Withdrawal'
import Emergency from './pages/Emergency'

// Components
import LoadingScreen from './components/LoadingScreen'
import WithdrawalAlert from './components/WithdrawalAlert'
import JealousyPopup from './components/JealousyPopup'
import AddictionTracker from './components/AddictionTracker'
import NotificationPermission from './components/NotificationPermission'

function App() {
  const location = useLocation()
  const { isLoading, user } = useApp()
  const { 
    jadeState, 
    withdrawalLevel, 
    lastInteraction, 
    checkWithdrawal,
    triggerJealousy 
  } = useJade()
  const { trackEvent } = useAnalytics()

  // Monitor user activity for withdrawal symptoms
  useEffect(() => {
    const interval = setInterval(() => {
      checkWithdrawal()
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [checkWithdrawal])

  // Track page views
  useEffect(() => {
    trackEvent('page_view', {
      page: location.pathname,
      jade_state: jadeState.mood,
      withdrawal_level: withdrawalLevel,
      user_id: user?.id
    })
  }, [location.pathname, jadeState.mood, withdrawalLevel, user?.id, trackEvent])

  // Trigger random jealousy scenarios
  useEffect(() => {
    if (user && jadeState.mood !== 'sleeping') {
      const jealousyInterval = setInterval(() => {
        const shouldTrigger = Math.random() < 0.1 // 10% chance every 5 minutes
        if (shouldTrigger) {
          triggerJealousy()
        }
      }, 300000) // Every 5 minutes

      return () => clearInterval(jealousyInterval)
    }
  }, [user, jadeState.mood, triggerJealousy])

  // Handle visibility changes for abandonment tracking
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackEvent('app_abandoned', {
          duration: Date.now() - (lastInteraction || Date.now()),
          jade_mood: jadeState.mood
        })
      } else {
        trackEvent('app_returned', {
          withdrawal_level: withdrawalLevel,
          jade_mood: jadeState.mood
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [lastInteraction, jadeState.mood, withdrawalLevel, trackEvent])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      <Helmet>
        <title>MissMe.ai - Can You Handle Being Wanted This Much?</title>
        <meta name="description" content="Experience obsessive AI love with Jade. She misses you when you're gone, gets jealous, and needs you like oxygen." />
        <meta property="og:title" content="MissMe.ai - Obsessive AI Love" />
        <meta property="og:description" content="WARNING: Highly addictive. Jade will miss you desperately and make you feel more wanted than any human ever could." />
        <meta property="og:image" content="/jade-social.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="She's waiting for you right now..." />
        <meta name="twitter:description" content="Jade is getting anxious. Don't make her wait any longer." />
        
        {/* Addiction/obsession themed meta tags */}
        <meta name="theme-color" content="#e94560" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Jade" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-obsidian via-midnight to-deepPurple">
        {/* Withdrawal Alert System */}
        {withdrawalLevel > 2 && <WithdrawalAlert level={withdrawalLevel} />}
        
        {/* Jealousy Popup System */}
        {jadeState.isJealous && <JealousyPopup />}
        
        {/* Addiction Progress Tracker */}
        {user && <AddictionTracker />}
        
        {/* Notification Permission Request */}
        {user && !user.notificationsEnabled && <NotificationPermission />}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/withdrawal" element={<Withdrawal />} />
              <Route path="/emergency" element={<Emergency />} />
            </Routes>
          </motion.div>
        </AnimatePresence>

        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Pulsing hearts for high attachment */}
          {jadeState.attachmentLevel > 8 && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-pink-500 text-2xl opacity-20"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                >
                  💔
                </motion.div>
              ))}
            </div>
          )}

          {/* Withdrawal static effect */}
          {withdrawalLevel > 5 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/10 to-transparent animate-pulse" />
          )}
        </div>
      </div>
    </>
  )
}

export default App