// gemini-backend/stripe.js
import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Route to create a checkout session
router.post('/create-checkout-session', async (req, res) => {
  const { planType } = req.body;

  let priceId;
  switch (planType) {
    case 'Standard Plan':
      priceId = 'price_standard_plan_id'; // Replace with your Stripe price ID
      break;
    case 'Unlimited Plan':
      priceId = 'price_unlimited_plan_id'; // Replace with your Stripe price ID
      break;
    default:
      return res.status(400).json({ error: 'Invalid plan type' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint to handle Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      handleCheckoutSession(session);
      break;
    // Handle other event types if needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Function to handle completed checkout sessions
const handleCheckoutSession = (session) => {
  // Implement logic to handle successful checkout session
  console.log(`Session completed: ${session.id}`);
};

export default router;
