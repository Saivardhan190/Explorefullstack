const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const { getDB } = require("../config/db"); // Use getDB to get the correct model
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { convertToCents } = require("../utils/helpers"); // Import the utility function

// Get the appropriate Booking model based on current database mode
const getBookingModel = () => getDB("Booking");

// @desc    Process payment
// @route   POST /api/v1/payments/process
// @access  Private
exports.processPayment = asyncHandler(async (req, res, next) => {
  const { paymentMethodId, amount, bookingId } = req.body;

  // Find booking using getDB
  const booking = await getBookingModel().findById(bookingId);

  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with id of ${bookingId}`, 404)
    );
  }

  // Make sure user is booking owner
  // Ensure booking.user comparison works for both Mongoose ObjectId and string ID
  // CORRECTED: Use req.user._id
  if (booking.user.toString() !== req.user._id && req.user.role !== "admin") {
    return next(
      new ErrorResponse("Not authorized to process payment for this booking", 403)
    );
  }

  try {
    // Ensure amount is an integer in cents using the utility function
    const amountInCents = convertToCents(amount);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents, // USE UTILITY FUNCTION
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      description: `Payment for booking ${booking.referenceNumber || booking._id}`,
      metadata: {
        bookingId: booking._id.toString(),
        userId: req.user._id // CORRECTED: Use req.user._id here too for consistency
      }
    });

    // Prepare updated booking data
    const updatedBookingData = {
      ...booking,
      paymentInfo: {
        id: paymentIntent.id,
        status: "completed",
        method: "credit_card"
      },
      status: "confirmed"
    };

    // Update booking using findByIdAndUpdate instead of save()
    await getBookingModel().findByIdAndUpdate(booking._id, updatedBookingData);

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        booking: updatedBookingData // Return the updated data
      }
    });
  } catch (error) {
    return next(
      new ErrorResponse(`Payment failed: ${error.message}`, 400)
    );
  }
});

// @desc    Get payment status
// @route   GET /api/v1/payments/:paymentId
// @access  Private
exports.getPaymentStatus = asyncHandler(async (req, res, next) => {
  const { paymentId } = req.params;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

    // Add authorization check: Ensure user owns the booking associated with the payment or is admin
    const bookingId = paymentIntent.metadata.bookingId;
    if (bookingId) {
      const booking = await getBookingModel().findById(bookingId);
      if (booking && booking.user.toString() !== req.user._id && req.user.role !== "admin") {
         return next(
           new ErrorResponse("Not authorized to view this payment status", 403)
         );
      }
    }

    res.status(200).json({
      success: true,
      data: {
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency
      }
    });
  } catch (error) {
    return next(
      new ErrorResponse(`Error retrieving payment: ${error.message}`, 400)
    );
  }
});

// @desc    Create payment intent
// @route   POST /api/v1/payments/create-intent
// @access  Private
exports.createPaymentIntent = asyncHandler(async (req, res, next) => {
  const { amount, bookingId } = req.body;

  // Find booking using getDB
  const booking = await getBookingModel().findById(bookingId);

  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with id of ${bookingId}`, 404)
    );
  }

  // Make sure user is booking owner
  // CORRECTED: Use req.user._id
  if (booking.user.toString() !== req.user._id && req.user.role !== "admin") {
    return next(
      new ErrorResponse("Not authorized to create payment intent for this booking", 403)
    );
  }

  try {
    // Ensure amount is an integer in cents using the utility function
    const amountInCents = convertToCents(amount);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents, // USE UTILITY FUNCTION
      currency: "usd",
      metadata: {
        bookingId: booking._id.toString(),
        userId: req.user._id // CORRECTED: Use req.user._id here too for consistency
      }
    });

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret
      }
    });
  } catch (error) {
    return next(
      new ErrorResponse(`Error creating payment intent: ${error.message}`, 400)
    );
  }
});

// @desc    Handle webhook events from Stripe
// @route   POST /api/v1/payments/webhook
// @access  Public
exports.handleWebhook = asyncHandler(async (req, res, next) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    // Ensure STRIPE_WEBHOOK_SECRET is set in .env
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Stripe webhook secret not configured.");
      return next(
        new ErrorResponse("Webhook secret not configured", 500)
      );
    }

    event = stripe.webhooks.constructEvent(
      req.rawBody, // Use req.rawBody if using express.raw middleware
      signature,
      webhookSecret
    );
  } catch (error) {
    return next(
      new ErrorResponse(`Webhook error: ${error.message}`, 400)
    );
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      const bookingId = paymentIntent.metadata.bookingId;

      // Update booking status
      if (bookingId) {
        const booking = await getBookingModel().findById(bookingId);
        if (booking) {
          const updatedBookingData = {
            ...booking,
            paymentInfo: {
              id: paymentIntent.id,
              status: "completed",
              method: "credit_card"
            },
            status: "confirmed"
          };
          // Update using findByIdAndUpdate
          await getBookingModel().findByIdAndUpdate(booking._id, updatedBookingData);
        }
      }
      break;
    case "payment_intent.payment_failed":
      const failedPayment = event.data.object;
      const failedBookingId = failedPayment.metadata.bookingId;

      // Update booking status
      if (failedBookingId) {
        const booking = await getBookingModel().findById(failedBookingId);
        if (booking) {
           const updatedBookingData = {
            ...booking,
            paymentInfo: {
              id: failedPayment.id,
              status: "failed",
              method: "credit_card"
            }
            // Optionally update booking status to 'payment_failed' or similar
          };
           // Update using findByIdAndUpdate
          await getBookingModel().findByIdAndUpdate(booking._id, updatedBookingData);
        }
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
});

