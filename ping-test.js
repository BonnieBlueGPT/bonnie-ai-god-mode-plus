// backend/ping-test.js
const axios = require('axios');

axios.get('http://localhost:3001/health')
  .then(res => console.log('✅ HEALTH RESPONSE:', res.data))
  .catch(err => console.error('❌ ERROR PINGING HEALTH:', err.message));
