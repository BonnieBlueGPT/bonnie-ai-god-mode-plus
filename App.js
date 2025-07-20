// 🔥 GALATEA'S EMPIRE - MOBILE FRONTEND 🔥
// Phase 1: WhatsApp-Style Chat with 3 Personalities
// Ready for backend integration and upsell implementation

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PersonalityProvider } from './src/context/PersonalityContext';
import ChatInterface from './src/components/chat/ChatInterface';

export default function App() {
  return (
    <PersonalityProvider>
      <View style={styles.container}>
        <ChatInterface />
      </View>
    </PersonalityProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});