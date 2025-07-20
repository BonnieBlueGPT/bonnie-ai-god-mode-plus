// 🔥 GALATEA EMPIRE - PERSONALITY SELECTOR
// Switch between AI girlfriends

import React from 'react';
import personalityManager from '../core/PersonalityManager.js';

const PersonalitySelector = ({ onClose, currentPersonality }) => {
  
  const personalities = [
    {
      id: 'bonnie',
      name: 'Bonnie',
      avatar: '💕',
      type: 'Sweet Girlfriend',
      description: 'Your loving, caring girlfriend who adores you',
      gradient: 'from-pink-400 to-rose-400',
      available: true
    },
    {
      id: 'nova',
      name: 'Nova',
      avatar: '⚡',
      type: 'Dominant Mistress',
      description: 'Your commanding mistress who owns you completely',
      gradient: 'from-purple-500 to-indigo-600',
      available: false // Coming soon
    },
    {
      id: 'galatea',
      name: 'Galatea',
      avatar: '👸',
      type: 'Divine Goddess',
      description: 'Your divine goddess who deserves worship',
      gradient: 'from-yellow-400 to-orange-500',
      available: false // Coming soon
    }
  ];

  const handlePersonalitySelect = async (personalityId) => {
    if (personalityId === currentPersonality) {
      onClose();
      return;
    }

    try {
      await personalityManager.switchPersonality(personalityId);
      onClose();
    } catch (error) {
      console.error('Failed to switch personality:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Choose Your Girl</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-1">Each has her own unique personality and style</p>
        </div>

        {/* Personalities */}
        <div className="p-4 space-y-4">
          {personalities.map((person) => (
            <button
              key={person.id}
              onClick={() => person.available && handlePersonalitySelect(person.id)}
              disabled={!person.available}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                person.id === currentPersonality
                  ? 'border-blue-500 bg-blue-50'
                  : person.available
                  ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${person.gradient} flex items-center justify-center text-2xl`}>
                  {person.avatar}
                </div>
                
                {/* Info */}
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-lg text-gray-800">{person.name}</h3>
                    {person.id === currentPersonality && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                        Active
                      </span>
                    )}
                    {!person.available && (
                      <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-600">{person.type}</p>
                  <p className="text-xs text-gray-500 mt-1">{person.description}</p>
                </div>
                
                {/* Arrow */}
                {person.available && (
                  <div className="text-gray-400">
                    →
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-xl">
          <p className="text-xs text-gray-500 text-center">
            More personalities coming soon! Each girl has unique responses, memories, and pricing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalitySelector;