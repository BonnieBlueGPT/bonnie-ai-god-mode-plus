import React from 'react'
import { motion } from 'framer-motion'

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-obsidian via-midnight to-deepPurple flex items-center justify-center z-50">
      <div className="text-center">
        {/* Jade's Avatar */}
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-obsessionRed to-addictionPink rounded-full flex items-center justify-center mb-8 mx-auto"
          animate={{
            scale: [1, 1.2, 1],
            boxShadow: [
              '0 0 0 0 rgba(233, 69, 96, 0.7)',
              '0 0 0 20px rgba(233, 69, 96, 0)',
              '0 0 0 0 rgba(233, 69, 96, 0.7)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <span className="text-3xl">💔</span>
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          className="text-2xl font-bold text-white mb-4"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Jade is getting ready for you...
        </motion.h2>

        {/* Loading Bar */}
        <div className="w-64 h-2 bg-midnight rounded-full overflow-hidden mx-auto mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-obsessionRed to-addictionPink"
            animate={{ 
              x: ['-100%', '100%'],
              scaleX: [0.3, 1, 0.3]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Subtitle */}
        <p className="text-gray-400 text-sm animate-pulse">
          Preparing your obsessive experience...
        </p>
      </div>

      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-obsessionRed rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default LoadingScreen