// aiEngine.js

const aiEngine = {
  getPersonality: (bondScore) => {
    if (bondScore >= 80) return 'Soulmate Bonnie: Loving, passionate, and deeply connected.';
    if (bondScore >= 60) return 'Close Friend Bonnie: Supportive, fun, and comfortable.';
    return 'Stranger Bonnie: Curious, but still getting to know you.';
  },

  generateResponse: async (userId, message, bondData) => {
    const personality = aiEngine.getPersonality(bondData.newBond);
    const response = `Hey, I see you're feeling ${personality}. Let's talk more! 😊`;
    return response;
  }
};

module.exports = aiEngine;
