import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Prices in cents
const pricing = {
  'Explorer Plan': {
    monthly: 0, // Free
    yearly: 0,  // Free
  },
  'Standard Plan': {
    monthly: 999, // $9.99
    yearly: 9990, // $99.90 (10% discount for yearly)
  },
  'Unlimited Plan': {
    monthly: 2499, // $24.99
    yearly: 24990, // $249.90 (10% discount for yearly)
  },
};

router.post("/create-payment-intent", async (req, res) => {
  const { plan, duration } = req.body;

  try {
    const amount = pricing[plan][duration];

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send({ error: "Payment failed" });
  }
});

export default router;
