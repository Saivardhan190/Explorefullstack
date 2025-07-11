const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  package: {
    type: mongoose.Schema.ObjectId,
    ref: 'Package',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  travelDate: {
    type: Date,
    required: [true, 'Please add a travel date']
  },
  adults: {
    type: Number,
    required: [true, 'Please add number of adults'],
    min: 1
  },
  children: {
    type: Number,
    default: 0
  },
  roomType: {
    type: String,
    required: [true, 'Please select a room type'],
    enum: ['Standard', 'Deluxe', 'Suite', 'Family']
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  paymentId: {
    type: String
  },
  specialRequests: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Populate package and user info when finding bookings
BookingSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'package',
    select: 'name location duration price image'
  }).populate({
    path: 'user',
    select: 'name email'
  });
  
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
