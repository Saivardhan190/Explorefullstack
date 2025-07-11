const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  processPayment,
  getPaymentStatus,
  createPaymentIntent,
  handleWebhook
} = require('../controllers/payments');

// Special route for Stripe webhook - needs raw body
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes
router.post('/process', protect, processPayment);
router.get('/:paymentId', protect, getPaymentStatus);
router.post('/create-intent', protect, createPaymentIntent);

module.exports = router;
