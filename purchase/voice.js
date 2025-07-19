// backend/purchase/voice.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Bonnie Voice Upgrade',
              description: 'Unlock seductive voice replies from Bonnie',
            },
            unit_amount: 399, // £3.99 in pence
          },
          quantity: 1,
        },
      ],
      success_url: 'https://chat.trainmygirl.com/thankyou',
      cancel_url: 'https://chat.trainmygirl.com/cancelled',
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error('❌ Stripe error:', error.message);
    return res.status(500).json({ error: 'Checkout failed.' });
  }
});

module.exports = router;
