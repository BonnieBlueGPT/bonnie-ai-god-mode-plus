// test/voice-test.js
const axios = require('axios');

axios.post('http://localhost:3005/purchase/voice', {
  session_id: 'test_session_001'
})
.then(res => {
  console.log('✅ Stripe Checkout URL:', res.data.url);
})
.catch(err => {
  console.error('❌ Failed to fetch voice checkout:', err.message);
});
