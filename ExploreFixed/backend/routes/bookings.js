const express = require('express');
const router = express.Router();
const { 
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  updateBookingStatus
} = require('../controllers/bookings');

const { protect, authorize } = require('../middleware/auth');

// Include user ID parameter
router.use('/:userId/bookings', protect, (req, res, next) => {
  req.params.userId = req.params.userId;
  next();
}, getBookings);

router
  .route('/')
  .get(protect, authorize('admin'), getBookings);

router
  .route('/:id')
  .get(protect, getBooking)
  .put(protect, updateBooking)
  .delete(protect, deleteBooking);

router
  .route('/:id/status')
  .put(protect, authorize('admin'), updateBookingStatus);

module.exports = router;
