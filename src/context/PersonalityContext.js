import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPersonality, DEFAULT_PERSONALITY } from '../constants/personalities';

const PersonalityContext = createContext();

export const usePersonality = () => {
  const context = useContext(PersonalityContext);
  if (!context) {
    throw new Error('usePersonality must be used within a PersonalityProvider');
  }
  return context;
};

export const PersonalityProvider = ({ children }) => {
  const [activePersonalityId, setActivePersonalityId] = useState(DEFAULT_PERSONALITY);
  const [personality, setPersonality] = useState(getPersonality(DEFAULT_PERSONALITY));

  useEffect(() => {
    setPersonality(getPersonality(activePersonalityId));
  }, [activePersonalityId]);

  const switchPersonality = (personalityId) => {
    setActivePersonalityId(personalityId);
  };

  const value = {
    personality,
    activePersonalityId,
    switchPersonality,
    theme: personality.theme,
    typingStyle: personality.typingStyle
  };

  return (
    <PersonalityContext.Provider value={value}>
      {children}
    </PersonalityContext.Provider>
  );
};